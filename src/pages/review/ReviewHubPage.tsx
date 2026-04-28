import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useReviewSession } from "@/features/reviewModes/sessionStore";
import { BrainCircuit, Shuffle, Zap, ArrowRight, Sparkles, MessageCircle } from "lucide-react";

export function ReviewHubPage() {
  const { reset } = useReviewSession();

  return (
    <Layout>
      <div className="p-4 lg:p-10 space-y-8 max-w-5xl mx-auto w-full">
        <header className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">复习模式</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">根据艾宾浩斯遗忘曲线，选择适合当下的复习策略</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {/* 回忆模式 */}
          <Link
            to="/review/recall"
            onClick={reset}
            className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-6 relative z-10 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">回忆模式</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                先想再看，强制主动回忆。最硬核但也最有效的抗遗忘方式，适合攻克核心难点。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              开始复习 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* 辨析模式 */}
          <Link
            to="/review/discern"
            onClick={reset}
            className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-6 relative z-10 text-amber-600 dark:text-amber-400">
              <Shuffle strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">辨析模式</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                对抗模糊记忆，拆穿易混概念。通过选择题形式帮你精准定位认知偏差。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              开始辨析 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* 快刷模式 */}
          <Link
            to="/review/rapid"
            onClick={reset}
            className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-6 relative z-10 text-emerald-600 dark:text-emerald-400">
              <Zap strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">快刷模式</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                10 秒/题，碎片时间高密度复习。快速过一遍熟悉度，保持知识在大脑中的活跃。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              极速开始 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* 费曼讲解模式 */}
          <Link
            to="/review/feynman"
            onClick={reset}
            className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-6 relative z-10 text-violet-600 dark:text-violet-400">
              <MessageCircle strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">费曼讲解</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                用自己的话解释，AI智能点评。以教促学，检验真正的理解深度。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              开始讲解 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>
        
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/20 border border-slate-200/60 dark:border-slate-800 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0 text-slate-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">智能调度已开启</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              复习模式已接入真实生成接口，算法会根据你过往的遗忘曲线和记忆状况，自动为你分配最需要温习的内容。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

