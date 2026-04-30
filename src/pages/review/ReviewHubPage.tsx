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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">复习模式</h1>
          <p className="text-muted-foreground text-lg">根据艾宾浩斯遗忘曲线，选择适合当下的复习策略</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {/* 回忆模式 */}
          <Link
            to="/review/recall"
            onClick={reset}
            className="group relative flex flex-col h-full bg-card rounded-[24px] border border-border/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--chart-1)]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-[color:var(--chart-1)]/15 flex items-center justify-center mb-6 relative z-10 text-[color:var(--chart-1)]">
              <BrainCircuit strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-[color:var(--chart-1)] transition-colors">回忆模式</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                先想再看，强制主动回忆。最硬核但也最有效的抗遗忘方式，适合攻克核心难点。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-[color:var(--chart-1)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              开始复习 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* 辨析模式 */}
          <Link
            to="/review/discern"
            onClick={reset}
            className="group relative flex flex-col h-full bg-card rounded-[24px] border border-border/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--chart-2)]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-[color:var(--chart-2)]/15 flex items-center justify-center mb-6 relative z-10 text-[color:var(--chart-2)]">
              <Shuffle strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-[color:var(--chart-2)] transition-colors">辨析模式</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                对抗模糊记忆，拆穿易混概念。通过选择题形式帮你精准定位认知偏差。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-[color:var(--chart-2)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              开始辨析 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* 快刷模式 */}
          <Link
            to="/review/rapid"
            onClick={reset}
            className="group relative flex flex-col h-full bg-card rounded-[24px] border border-border/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--chart-3)]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-[color:var(--chart-3)]/15 flex items-center justify-center mb-6 relative z-10 text-[color:var(--chart-3)]">
              <Zap strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-[color:var(--chart-3)] transition-colors">快刷模式</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                10 秒/题，碎片时间高密度复习。快速过一遍熟悉度，保持知识在大脑中的活跃。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-[color:var(--chart-3)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              极速开始 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* 费曼讲解模式 */}
          <Link
            to="/review/feynman"
            onClick={reset}
            className="group relative flex flex-col h-full bg-card rounded-[24px] border border-border/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--chart-4)]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-12 h-12 rounded-2xl bg-[color:var(--chart-4)]/15 flex items-center justify-center mb-6 relative z-10 text-[color:var(--chart-4)]">
              <MessageCircle strokeWidth={2} size={24} />
            </div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-[color:var(--chart-4)] transition-colors">费曼讲解</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                用自己的话解释，AI智能点评。以教促学，检验真正的理解深度。
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-[color:var(--chart-4)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              开始讲解 <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>
        
        <div className="mt-12 rounded-2xl bg-muted border border-border/60 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm shrink-0 text-muted-foreground">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">智能调度已开启</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              复习模式已接入真实生成接口，算法会根据你过往的遗忘曲线和记忆状况，自动为你分配最需要温习的内容。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
