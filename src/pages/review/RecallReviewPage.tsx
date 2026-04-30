import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FocusShell } from "@/components/review/FocusShell";
import { QuestionCard } from "@/components/review/QuestionCard";
import { BottomActionBar } from "@/components/review/BottomActionBar";
import { SwipeTransition } from "@/components/review/SwipeTransition";
import type { RecallReviewQuestion, ReviewDeckSelection } from "@/features/reviewModes/contracts";
import { useReviewSession } from "@/features/reviewModes/sessionStore";

export function RecallReviewPage() {
  const navigate = useNavigate();
  const { snapshot, start, answer, finish, isBusy, error } = useReviewSession();
  const [direction, setDirection] = useState<1 | -1>(1);
  const [revealed, setRevealed] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const deck = useMemo<ReviewDeckSelection>(() => ({ type: "all" }), []);

  useEffect(() => {
    if (!snapshot.sessionId || snapshot.mode !== "recall") {
      start({ mode: "recall", deck, prefetch: 5 }).catch(() => {});
    }
  }, []); // Only run once on mount

  useEffect(() => {
    setRevealed(false);
    setStartedAt(Date.now());
  }, [snapshot.current?.id]);

  const current = snapshot.current && snapshot.current.type === "recall" ? snapshot.current : null;
  const progress = snapshot.totalAnswered + (current ? 1 : 0);

  const goSummary = async () => {
    await finish();
    navigate("/review/summary");
  };

  const submit = async (q: RecallReviewQuestion, input: { revealed_answer: boolean; decision: "mastered" | "blurry" | "forgot" }) => {
    setDirection(1);
    await answer({
      request: {
        question_id: q.id,
        answer: {
          type: "recall",
          revealed_answer: input.revealed_answer,
          decision: input.decision,
        },
        elapsed_ms: Date.now() - startedAt,
        events: {
          paused_ms: snapshot.pausedMs,
        },
      },
    });
    setRevealed(false);
    setStartedAt(Date.now());
  };

  if (!current) {
    return (
      <FocusShell title="回忆模式" onExit={() => navigate("/review")}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {isBusy ? (
            <div className="text-muted-foreground">题目加载中...</div>
          ) : (
            <>
              <div className="text-lg font-medium text-foreground mb-2">
                当前没有需要复习的卡片
              </div>
              <div className="text-sm text-muted-foreground mb-8">
                太棒了！你已经完成了当前阶段的学习任务。
              </div>
              <button
                type="button"
                onClick={goSummary}
                className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium active:scale-95 transition-transform"
                disabled={isBusy}
              >
                查看统计
              </button>
            </>
          )}
        </div>
      </FocusShell>
    );
  }

  return (
    <FocusShell title="回忆模式" progress={`${progress}`} onExit={goSummary} bottom={
      !revealed ? (
        <BottomActionBar>
          <button
            type="button"
            onClick={() => submit(current, { revealed_answer: false, decision: "mastered" })}
            className="flex-1 py-3 rounded-2xl bg-[color:var(--chart-3)] text-primary-foreground font-medium active:scale-95 transition-transform disabled:opacity-50"
            disabled={isBusy}
          >
            我已回忆起来
          </button>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-medium active:scale-95 transition-transform disabled:opacity-50"
            disabled={isBusy}
          >
            查看答案
          </button>
        </BottomActionBar>
      ) : (
        <BottomActionBar>
          <button
            type="button"
            onClick={() => submit(current, { revealed_answer: true, decision: "mastered" })}
            className="flex-1 py-3 rounded-2xl bg-[color:var(--chart-3)] text-primary-foreground font-medium active:scale-95 transition-transform disabled:opacity-50"
            disabled={isBusy}
          >
            已掌握
          </button>
          <button
            type="button"
            onClick={() => submit(current, { revealed_answer: true, decision: "blurry" })}
            className="flex-1 py-3 rounded-2xl bg-[color:var(--chart-4)] text-primary-foreground font-medium active:scale-95 transition-transform disabled:opacity-50"
            disabled={isBusy}
          >
            仍模糊
          </button>
        </BottomActionBar>
      )
    }>
      <SwipeTransition
        itemKey={current.id}
        direction={direction}
        onSwipeLeft={() => {
          if (isBusy) return;
          setDirection(1);
          submit(current, { revealed_answer: false, decision: "mastered" }).catch(() => {});
        }}
        onSwipeRight={() => {
          if (isBusy) return;
          setDirection(-1);
          setRevealed(true);
        }}
      >
        <QuestionCard prompt={current.prompt}>
          {current.explanation && (
            <div className="text-xs text-muted-foreground text-center whitespace-pre-wrap">
              来自：{current.explanation}
            </div>
          )}
          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
          )}
          {revealed && (
            <div className="mt-4 rounded-xl bg-muted border border-border p-4">
              <div className="text-sm font-medium text-foreground">答案</div>
              <div className="mt-2 text-[16px] text-foreground whitespace-pre-wrap">
                {current.answer}
              </div>
            </div>
          )}
        </QuestionCard>
      </SwipeTransition>
    </FocusShell>
  );
}
