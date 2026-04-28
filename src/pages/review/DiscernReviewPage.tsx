import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FocusShell } from "@/components/review/FocusShell";
import { QuestionCard } from "@/components/review/QuestionCard";
import { SwipeTransition } from "@/components/review/SwipeTransition";
import type { DiscernReviewQuestion, ReviewDeckSelection } from "@/features/reviewModes/contracts";
import { useReviewSession } from "@/features/reviewModes/sessionStore";

export function DiscernReviewPage() {
  const navigate = useNavigate();
  const { snapshot, start, answer, advance, finish, isBusy, error } = useReviewSession();
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | undefined>(undefined);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const deck = useMemo<ReviewDeckSelection>(() => ({ type: "all" }), []);

  useEffect(() => {
    if (!snapshot.sessionId || snapshot.mode !== "discern") {
      start({ mode: "discern", deck, prefetch: 4 }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    setSelected([]);
    setSubmitted(false);
    setCorrect(undefined);
    setStartedAt(Date.now());
  }, [snapshot.current?.id]);

  const current = snapshot.current && snapshot.current.type === "discern" ? snapshot.current : null;

  const goSummary = async () => {
    await finish();
    navigate("/review/summary");
  };

  const toggle = (id: string, q: DiscernReviewQuestion) => {
    if (submitted) return;
    if (q.question.kind === "multi") {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setSelected([id]);
    }
  };

  const submit = async (q: DiscernReviewQuestion) => {
    if (selected.length === 0) return;
    setDirection(1);
    const res = await answer({
      request: {
        question_id: q.id,
        answer: {
          type: "discern",
          selected_option_ids: selected,
        },
        elapsed_ms: Date.now() - startedAt,
        events: {
          paused_ms: snapshot.pausedMs,
        },
      },
      advance: false,
    });
    setSubmitted(true);
    setCorrect(res.correct);
  };

  const next = () => {
    setDirection(1);
    advance();
  };

  if (!current) {
    return (
      <FocusShell title="辨析模式" onExit={() => navigate("/review")}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {isBusy ? (
            <div className="text-slate-500">题目加载中...</div>
          ) : (
            <>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                当前没有需要复习的卡片
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                太棒了！你已经完成了当前阶段的学习任务。
              </div>
              <button
                type="button"
                onClick={goSummary}
                className="px-6 py-3 rounded-2xl bg-[#165DFF] text-white font-medium active:scale-95 transition-transform"
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

  const progress = `${snapshot.totalAnswered + (submitted ? 0 : 1)}`;

  return (
    <FocusShell
      title="辨析模式"
      progress={progress}
      onExit={goSummary}
      bottom={
        !submitted ? (
          <button
            type="button"
            onClick={() => submit(current)}
            className="w-full py-3 rounded-2xl bg-[#165DFF] text-white font-medium active:scale-95 transition-transform disabled:opacity-50"
            disabled={isBusy || selected.length === 0}
          >
            提交
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="w-full py-3 rounded-2xl bg-[#165DFF] text-white font-medium active:scale-95 transition-transform"
          >
            下一组
          </button>
        )
      }
    >
      <SwipeTransition itemKey={current.id} direction={direction}>
        <QuestionCard prompt={current.question.prompt}>
          {error && <div className="text-sm text-[#F53F3F] text-center">{error}</div>}

          <div className="mt-4 grid gap-2">
            {current.question.options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              const isCorrect = submitted && current.question.correct_option_ids.includes(opt.id);
              const isWrong = submitted && isSelected && !current.question.correct_option_ids.includes(opt.id);

              const border = isCorrect
                ? "border-[#00B42A]"
                : isWrong
                ? "border-[#F53F3F]"
                : isSelected
                ? "border-[#165DFF]"
                : "border-slate-200 dark:border-slate-700";

              const bg = isCorrect
                ? "bg-[#00B42A]/10"
                : isWrong
                ? "bg-[#F53F3F]/10"
                : isSelected
                ? "bg-[#165DFF]/5"
                : "bg-white dark:bg-slate-900";

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id, current)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border ${border} ${bg} active:scale-[0.99] transition-transform`}
                  disabled={isBusy}
                >
                  <div className="text-[16px] text-[#1D2129] dark:text-slate-100">{opt.text}</div>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div
                className={`text-sm font-medium ${
                  correct ? "text-[#00B42A]" : correct === false ? "text-[#F53F3F]" : "text-[#6E7681]"
                }`}
              >
                {correct === undefined ? "已提交" : correct ? "回答正确" : "回答错误"}
              </div>

              {current.analysis?.compare_table && current.analysis.compare_table.length > 0 && (
                <div className="mt-3 space-y-3">
                  {current.analysis.compare_table.map((row) => (
                    <div key={row.label}>
                      <div className="text-xs text-[#6E7681] dark:text-slate-400">{row.label}</div>
                      <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${current.items.length}, minmax(0, 1fr))` }}>
                        {current.items.map((it) => (
                          <div
                            key={it.id}
                            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3"
                          >
                            <div className="text-xs font-medium text-[#1D2129] dark:text-slate-100">{it.title}</div>
                            <div className="mt-1 text-xs text-[#6E7681] dark:text-slate-400 whitespace-pre-wrap">
                              {row.values[it.id]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {current.analysis?.summary && (
                <div className="mt-3 text-sm text-[#1D2129] dark:text-slate-100 whitespace-pre-wrap">
                  {current.analysis.summary}
                </div>
              )}
            </div>
          )}
        </QuestionCard>
      </SwipeTransition>
    </FocusShell>
  );
}
