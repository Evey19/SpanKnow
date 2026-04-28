import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FocusShell } from "@/components/review/FocusShell";
import { SwipeTransition } from "@/components/review/SwipeTransition";
import type { ReviewDeckSelection, SubmitReviewAnswerResponse } from "@/features/reviewModes/contracts";
import { useReviewSession } from "@/features/reviewModes/sessionStore";
import { MessageCircle, Sparkles, Send, Loader2, Key, ArrowRight } from "lucide-react";

export function FeynmanReviewPage() {
  const navigate = useNavigate();
  const { snapshot, start, answer, advance, finish, isBusy } = useReviewSession();
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [userAnswer, setUserAnswer] = useState("");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showKeywords, setShowKeywords] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitReviewAnswerResponse | null>(null);

  const deck = useMemo<ReviewDeckSelection>(() => ({ type: "all" }), []);

  useEffect(() => {
    if (!snapshot.sessionId || snapshot.mode !== "feynman") {
      start({ mode: "feynman", deck, prefetch: 3 }).catch(() => {});
    }
  }, []); // Only run once on mount

  useEffect(() => {
    setUserAnswer("");
    setShowKeywords(false);
    setSubmitResult(null);
    setStartedAt(Date.now());
  }, [snapshot.current?.id]);

  const current = snapshot.current && snapshot.current.type === "feynman" ? snapshot.current : null;
  const progress = snapshot.totalAnswered + (current ? 1 : 0);

  const goSummary = async () => {
    await finish();
    navigate("/review/summary");
  };

  const submit = async () => {
    if (!current || !userAnswer.trim()) return;
    
    setDirection(1);
    
    try {
      const res = await answer({
        request: {
          question_id: current.id,
          answer: {
            type: "feynman",
            user_answer: userAnswer.trim(),
          },
          elapsed_ms: Date.now() - startedAt,
          events: {
            paused_ms: snapshot.pausedMs,
          },
        },
        advance: false, // Wait for user to read feedback before advancing
      });
      setSubmitResult(res);
    } catch (e) {
      console.error("Failed to submit feynman answer", e);
    }
  };

  const advanceToNext = () => {
    advance();
  };

  if (!current) {
    return (
      <FocusShell title="费曼讲解模式" onExit={() => navigate("/review")}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {isBusy ? (
            <div className="flex flex-col items-center gap-3 text-violet-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>正在为你生成讲解课题...</span>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-slate-400" />
              </div>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                当前没有需要讲解的课题
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                太棒了！你已经完成了当前阶段的深度理解任务。
              </div>
              <button
                type="button"
                onClick={goSummary}
                className="px-6 py-3 rounded-2xl bg-violet-600 text-white font-medium active:scale-95 transition-transform shadow-lg shadow-violet-600/20"
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

  // Define get rating color and label
  const getRatingInfo = (rating?: number) => {
    switch (rating) {
      case 4: return { color: "text-emerald-600 bg-emerald-50 border-emerald-200", label: "完美掌握" };
      case 3: return { color: "text-blue-600 bg-blue-50 border-blue-200", label: "基本理解" };
      case 2: return { color: "text-amber-600 bg-amber-50 border-amber-200", label: "概念模糊" };
      case 1: return { color: "text-red-600 bg-red-50 border-red-200", label: "偏题错误" };
      default: return { color: "text-slate-600 bg-slate-50 border-slate-200", label: "已点评" };
    }
  };

  return (
    <FocusShell
      title="费曼讲解"
      subtitle={current.explanation}
      progress={String(progress)}
      onExit={() => navigate("/review")}
      action={
        submitResult ? (
          <button
            type="button"
            onClick={advanceToNext}
            className="w-full py-3.5 rounded-2xl bg-violet-600 text-white font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
          >
            下一题 <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={isBusy || !userAnswer.trim()}
            className="w-full py-3.5 rounded-2xl bg-violet-600 text-white font-semibold active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
          >
            {isBusy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            提交讲解
          </button>
        )
      }
    >
      <SwipeTransition itemKey={current.id} direction={direction}>
        <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
          {/* Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 shadow-sm mb-6 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400 mt-1">
                <MessageCircle size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-2 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles size={14} /> AI 提问
                </h3>
                <div className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {current.prompt}
                </div>
              </div>
            </div>
            
            {current.keywords && current.keywords.length > 0 && !submitResult && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {!showKeywords ? (
                  <button 
                    onClick={() => setShowKeywords(true)}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition-colors"
                  >
                    <Key size={14} /> 卡壳了？查看提示词
                  </button>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="text-xs font-medium text-slate-400 mb-2">尝试在你的讲解中包含以下关键词：</div>
                    <div className="flex flex-wrap gap-2">
                      {current.keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-xs font-medium rounded-lg border border-violet-100 dark:border-violet-800/50">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Answer Area or Feedback Area */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {submitResult ? (
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 shadow-sm overflow-y-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="text-violet-500" size={18} />
                    AI 导师点评
                  </h3>
                  {submitResult.rating_assigned && (
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getRatingInfo(submitResult.rating_assigned).color}`}>
                      {getRatingInfo(submitResult.rating_assigned).label}
                    </div>
                  )}
                </div>
                
                <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed">
                  {submitResult.feedback ? (
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {submitResult.feedback}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic">点评生成中...</p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">你的讲解回顾</h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap border border-slate-100 dark:border-slate-700">
                    {userAnswer}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-2 shadow-sm flex flex-col focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-50 transition-all">
                <textarea
                  className="flex-1 w-full bg-transparent resize-none outline-none p-4 md:p-6 text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="用你自己的话解释这个概念... 就像讲给一个完全不懂的人听一样。"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isBusy}
                />
              </div>
            )}
          </div>
        </div>
      </SwipeTransition>
    </FocusShell>
  );
}
