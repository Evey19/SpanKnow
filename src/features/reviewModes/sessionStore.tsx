import React, { createContext, useContext, useMemo, useState } from "react";
import type {
  ReviewDeckSelection,
  ReviewMode,
  ReviewQuestion,
  ReviewSummary,
  SubmitReviewAnswerRequest,
  SubmitReviewAnswerResponse,
} from "./contracts";
import {
  createReviewSession,
  fetchNextReviewQuestions,
  fetchReviewSummary,
  submitReviewAnswer,
} from "./api";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type SessionSnapshot = {
  sessionId: string | null;
  mode: ReviewMode | null;
  deck: ReviewDeckSelection | null;
  queue: ReviewQuestion[];
  current: ReviewQuestion | null;
  startedAt: number | null;
  totalAnswered: number;
  breakdown: Record<string, number>;
  pausedMs: number;
  page: number;
};

type ReviewSessionContextValue = {
  snapshot: SessionSnapshot;
  isBusy: boolean;
  error: string | null;
  summary: ReviewSummary | null;
  reset: () => void;
  start: (input: { mode: ReviewMode; deck: ReviewDeckSelection; prefetch: number }) => Promise<void>;
  answer: (input: { request: SubmitReviewAnswerRequest; swiped?: boolean; advance?: boolean }) => Promise<SubmitReviewAnswerResponse>;
  advance: () => void;

  finish: () => Promise<ReviewSummary>;
  pause: () => void;
  resume: () => void;
};

const ReviewSessionContext = createContext<ReviewSessionContextValue | null>(null);

const STORAGE_KEY = "snapknow-review-session-v1";
const SUMMARY_KEY = "snapknow-review-summary-v1";

function initialSnapshot(): SessionSnapshot {
  return {
    sessionId: null,
    mode: null,
    deck: null,
    queue: [],
    current: null,
    startedAt: null,
    totalAnswered: 0,
    breakdown: {},
    pausedMs: 0,
    page: 1,
  };
}

export function ReviewSessionProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useLocalStorageState<SessionSnapshot>(STORAGE_KEY, initialSnapshot());
  const [summary, setSummary] = useLocalStorageState<ReviewSummary | null>(SUMMARY_KEY, null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);

  const reset = () => {
    setSnapshot(initialSnapshot());
    setSummary(null);
    setError(null);
    setPausedAt(null);
  };

  const start: ReviewSessionContextValue["start"] = async (input) => {
    setIsBusy(true);
    setError(null);
    try {
      const res = await createReviewSession(input);
      const [first, ...rest] = res.questions;
      setSnapshot({
        sessionId: res.session_id,
        mode: input.mode,
        deck: input.deck,
        queue: rest,
        current: first || null,
        startedAt: Date.now(),
        totalAnswered: 0,
        breakdown: {},
        pausedMs: 0,
        page: 1,
      });
      setSummary(null);
      setPausedAt(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "创建复习会话失败");
      throw e;
    } finally {
      setIsBusy(false);
    }
  };

  const prefetchIfNeeded = async (sessionId: string, queue: ReviewQuestion[], mode: ReviewMode, page: number) => {
    if (queue.length >= 3) return { nextQueue: queue, nextPage: page };
    const res = await fetchNextReviewQuestions({ session_id: sessionId, count: 5, mode, page: page + 1 });
    return { nextQueue: [...queue, ...res.questions], nextPage: page + 1 };
  };

  const answer: ReviewSessionContextValue["answer"] = async (input) => {
    if (!snapshot.sessionId || !snapshot.current || !snapshot.mode) {
      throw new Error("no active session");
    }
    const shouldAdvance = input.advance !== false;
    setIsBusy(true);
    setError(null);
    try {
      const response = await submitReviewAnswer({
        session_id: snapshot.sessionId,
        request: input.request,
      });

      const nextBreakdown = { ...snapshot.breakdown };
      const a = input.request.answer;
      if (a.type === "recall") {
        nextBreakdown[a.decision] = (nextBreakdown[a.decision] || 0) + 1;
      } else if (a.type === "rapid") {
        nextBreakdown[a.result] = (nextBreakdown[a.result] || 0) + 1;
      } else if (a.type === "discern") {
        const key = response.correct ? "correct" : "wrong";
        nextBreakdown[key] = (nextBreakdown[key] || 0) + 1;
      }

      let finalQueue = snapshot.queue;
      let finalPage = snapshot.page;

      if (response.next_questions && response.next_questions.length > 0) {
        finalQueue = [...snapshot.queue, ...response.next_questions];
      } else {
        const prefetchResult = await prefetchIfNeeded(snapshot.sessionId, snapshot.queue, snapshot.mode, snapshot.page);
        finalQueue = prefetchResult.nextQueue;
        finalPage = prefetchResult.nextPage;
      }

      setSnapshot({
        ...snapshot,
        current: shouldAdvance ? finalQueue[0] || null : snapshot.current,
        queue: shouldAdvance ? finalQueue.slice(1) : finalQueue,
        totalAnswered: snapshot.totalAnswered + 1,
        breakdown: nextBreakdown,
        page: finalPage,
      });

      return response;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "提交失败");
      throw e;
    } finally {
      setIsBusy(false);
    }
  };

  const advance = () => {
    if (!snapshot.queue.length) {
      finish();
      return;
    }
    const [nextCurrent, ...rest] = snapshot.queue;
    setSnapshot({ ...snapshot, current: nextCurrent || null, queue: rest });
  };

  const finish: ReviewSessionContextValue["finish"] = async () => {
    if (!snapshot.sessionId || !snapshot.startedAt) {
      throw new Error("no active session");
    }
    setIsBusy(true);
    setError(null);
    try {
      const remoteSummary = await fetchReviewSummary({ session_id: snapshot.sessionId }).catch(() => null);
      const merged: ReviewSummary = {
        ...(remoteSummary || {}),
        total_answered: remoteSummary?.total_answered ?? snapshot.totalAnswered,
        breakdown: (remoteSummary && Object.keys(remoteSummary.breakdown || {}).length > 0) ? remoteSummary.breakdown : snapshot.breakdown,
        duration_ms: remoteSummary?.duration_ms ?? (Date.now() - snapshot.startedAt),
        mastery_rate:
          (remoteSummary && typeof remoteSummary.mastery_rate === "number") ? remoteSummary.mastery_rate : computeMasteryRate(snapshot),
      };
      setSummary(merged);
      return merged;
    } catch {
      const local: ReviewSummary = {
        total_answered: snapshot.totalAnswered,
        mastery_rate: computeMasteryRate(snapshot),
        breakdown: snapshot.breakdown,
        duration_ms: Date.now() - snapshot.startedAt,
      };
      setSummary(local);
      return local;
    } finally {
      setIsBusy(false);
    }
  };

  const pause = () => {
    if (pausedAt) return;
    setPausedAt(Date.now());
  };

  const resume = () => {
    if (!pausedAt) return;
    const delta = Date.now() - pausedAt;
    setSnapshot({ ...snapshot, pausedMs: snapshot.pausedMs + delta });
    setPausedAt(null);
  };

  const value = useMemo<ReviewSessionContextValue>(
    () => ({
      snapshot,
      isBusy,
      error,
      summary,
      reset,
      start,
      answer,
      advance,
      finish,
      pause,
      resume,
    }),
    [snapshot, isBusy, error, summary, advance]
  );


  return <ReviewSessionContext.Provider value={value}>{children}</ReviewSessionContext.Provider>;
}

function computeMasteryRate(snapshot: SessionSnapshot) {
  const total = snapshot.totalAnswered;
  if (total === 0) return 0;
  const mastered =
    (snapshot.breakdown.mastered || 0) +
    (snapshot.breakdown.know || 0) +
    (snapshot.breakdown.correct || 0);
  return mastered / total;
}

export function useReviewSession() {
  const ctx = useContext(ReviewSessionContext);
  if (!ctx) {
    throw new Error("useReviewSession must be used within ReviewSessionProvider");
  }
  return ctx;
}
