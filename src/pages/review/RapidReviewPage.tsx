import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Zap, Check, X as XIcon, BrainCircuit } from "lucide-react";
import { CountdownRing } from "@/components/review/CountdownRing";
import type { RapidReviewQuestion, ReviewDeckSelection } from "@/features/reviewModes/contracts";
import { useReviewSession } from "@/features/reviewModes/sessionStore";

const TOTAL_MS = 10_000;

export function RapidReviewPage() {
  const navigate = useNavigate();
  const { snapshot, start, answer, finish, isBusy, error, pause, resume } = useReviewSession();
  const [remainingMs, setRemainingMs] = useState(TOTAL_MS);
  const [paused, setPaused] = useState(false);
  const startedAtRef = useRef<number>(Date.now());

  const deck = useMemo<ReviewDeckSelection>(() => ({ type: "all" }), []);

  useEffect(() => {
    if (!snapshot.sessionId || snapshot.mode !== "rapid") {
      start({ mode: "rapid", deck, prefetch: 5 }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    setRemainingMs(TOTAL_MS);
    setPaused(false);
    startedAtRef.current = Date.now();
  }, [snapshot.current?.id]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") {
        setPaused(true);
        pause();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pause]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - 250;
        return next < 0 ? 0 : next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (remainingMs > 0) return;
    const current = snapshot.current;
    if (!current || current.type !== "rapid") return;
    if (paused) return;
    submit(current, "timeout").catch(() => {});
  }, [remainingMs, paused, snapshot.current]);

  const current = snapshot.current && snapshot.current.type === "rapid" ? snapshot.current : null;

  const goSummary = async () => {
    await finish();
    navigate("/review/summary");
  };

  const togglePause = () => {
    setPaused((p) => {
      const next = !p;
      if (next) pause();
      else resume();
      return next;
    });
  };

  const submit = async (q: RapidReviewQuestion, result: "know" | "dont_know" | "timeout") => {
    setPaused(false);
    await answer({
      request: {
        question_id: q.id,
        answer: {
          type: "rapid",
          result,
        },
        elapsed_ms: Date.now() - startedAtRef.current,
        events: {
          paused_ms: snapshot.pausedMs,
        },
      },
    });
    startedAtRef.current = Date.now();
    setRemainingMs(TOTAL_MS);
  };

  if (!current) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] flex flex-col">
        <div className="px-4 py-3 flex items-center">
          <div className="text-base font-semibold text-[#1D2129] dark:text-slate-100">快刷模式</div>
          <button
            type="button"
            onClick={() => navigate("/review")}
            className="ml-auto p-2 -mr-2 rounded-lg active:scale-95 transition-transform text-[#6E7681] dark:text-slate-400"
            aria-label="退出"
          >
            <X size={20} />
          </button>
        </div>
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
      </div>
    );
  }

  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -ml-64 -mb-64 pointer-events-none" />

      <div className="px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">快刷模式</div>
        </div>
        <button
          type="button"
          onClick={goSummary}
          className="p-2.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 active:scale-95 transition-all text-slate-500 dark:text-slate-400"
          aria-label="退出"
        >
          <X size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-6 pt-2 pb-6 flex justify-center relative z-10">
        <div className="relative group cursor-pointer" onClick={togglePause} title={paused ? "点击继续" : "点击暂停"}>
          <div className="absolute inset-0 rounded-full bg-emerald-50 dark:bg-emerald-900/20 scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CountdownRing
            totalMs={TOTAL_MS}
            remainingMs={remainingMs}
            size={100}
            strokeWidth={6}
            color="#10B981"
            center={
              <div className="text-center transition-transform active:scale-95">
                <div className={`text-3xl font-bold tracking-tighter ${paused ? 'text-amber-500' : 'text-slate-800 dark:text-slate-100'}`}>
                  {seconds}
                </div>
                <div className="text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                  {paused ? "PAUSED" : "SECONDS"}
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 max-w-3xl mx-auto w-full pb-8">
        {current.explanation && (
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 px-4 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full inline-flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {current.explanation}
          </div>
        )}
        
        <div className="text-2xl md:text-3xl lg:text-4xl leading-snug md:leading-normal font-bold text-slate-800 dark:text-slate-100 text-center whitespace-pre-wrap tracking-tight drop-shadow-sm">
          {current.prompt}
        </div>
        
        {current.mnemonic && (
          <div className="mt-10 p-5 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-emerald-100 dark:border-emerald-900/40 rounded-2xl w-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                <BrainCircuit size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1 text-left pt-0.5">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 block mb-1.5 tracking-widest uppercase">记忆口诀</span>
                <p className="text-[15px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{current.mnemonic}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="px-6 pb-4 text-sm font-medium text-red-500 text-center relative z-10">{error}</div>}

      <div className="px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] relative z-10">
        <div className="max-w-2xl mx-auto flex gap-4 h-24">
          <button
            type="button"
            onClick={() => submit(current, "know")}
            className="flex-1 relative overflow-hidden group rounded-[2rem] bg-[#10B981] hover:bg-[#059669] text-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center gap-1 border-b-4 border-[#047857]"
            disabled={isBusy}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Check size={28} strokeWidth={3} className="relative z-10" />
            <span className="text-lg font-bold tracking-wider relative z-10">记得</span>
          </button>
          
          <button
            type="button"
            onClick={() => submit(current, "dont_know")}
            className="flex-1 relative overflow-hidden group rounded-[2rem] bg-[#F43F5E] hover:bg-[#E11D48] text-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_25px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center gap-1 border-b-4 border-[#BE123C]"
            disabled={isBusy}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <XIcon size={28} strokeWidth={3} className="relative z-10" />
            <span className="text-lg font-bold tracking-wider relative z-10">忘了</span>
          </button>
        </div>
      </div>
    </div>
  );
}
