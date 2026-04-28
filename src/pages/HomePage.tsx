import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Shuffle,
  Zap,
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  ChevronRight,
  Flame,
  AlertCircle,
  BarChart3,
  Globe,
  Library,
  Star,
  History
} from "lucide-react";
import { Layout } from "../components/Layout";
import { useDashboardQuery } from "@/features/progress/useDashboardQuery";

function formatDurationMinutes(ms: number) {
  if (!Number.isFinite(ms)) return 0;
  return Math.max(0, Math.round(ms / 60000));
}

export function HomePage() {
  const { data } = useDashboardQuery();
  const dashboard = data?.data;

  const todayStats = {
    questionsDone: dashboard?.today_review_count ?? 0,
    studyTimeMinutes: formatDurationMinutes(dashboard?.today_time_spent_ms ?? 0),
    accuracy: dashboard?.today_accuracy_percent ?? 0,
    streakDays: dashboard?.total_learning_days ?? 0,
  };

  const tasks = {
    dailyGoal: 150,
    pendingCorrections: 8,
    expiredReviews: 3,
    ebbinghausPending: 24,
  };

  // Simple mock data for weekly chart
  const weeklyData = (dashboard?.accuracy_chart_7_days || []).map((d) => ({
    day: d.date.slice(5),
    value: d.accuracy,
  }));
  const maxWeeklyValue = Math.max(1, ...weeklyData.map((d) => d.value));
  const deltaMinutes = formatDurationMinutes((dashboard?.today_time_spent_ms ?? 0) - (dashboard?.yesterday_time_spent_ms ?? 0));

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        
        {/* 2. 欢迎 & 数据卡片区 (Welcome & Data Cards) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                欢迎回来，学习者 <span className="text-2xl animate-bounce origin-bottom-right">👋</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium">今天是你坚持学习的第 <span className="text-indigo-600 dark:text-indigo-400 font-bold">{todayStats.streakDays}</span> 天，继续保持！</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold border border-orange-100 dark:border-orange-500/20">
                <Flame size={16} strokeWidth={2.5} />
                {todayStats.streakDays} 天连胜
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-500/20">
                <Award size={16} strokeWidth={2.5} />
                知识达人
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 今日已做题数 */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Target size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5">今日已做题数</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{todayStats.questionsDone}</span>
                    <span className="text-sm font-medium text-slate-400">/ {tasks.dailyGoal}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, (todayStats.questionsDone / tasks.dailyGoal) * 100)}%` }}
                />
              </div>
            </div>

            {/* 累计学习时长 */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5">今日学习时长</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{todayStats.studyTimeMinutes}</span>
                    <span className="text-sm font-medium text-slate-400">分钟</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 relative z-10">
                <TrendingUp size={16} strokeWidth={2.5} />
                <span>{deltaMinutes >= 0 ? `比昨天多 ${deltaMinutes} 分钟` : `比昨天少 ${Math.abs(deltaMinutes)} 分钟`}</span>
              </div>
            </div>

            {/* 今日正确率 */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 dark:bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <BarChart3 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5">今日正确率</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{todayStats.accuracy}</span>
                    <span className="text-xl font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end relative z-10 h-8">
                {weeklyData.length > 0 ? weeklyData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group/bar">
                    <div className="w-6 md:w-8 bg-slate-100 dark:bg-slate-800 rounded-t-sm flex items-end justify-center relative overflow-hidden h-8">
                      <div 
                        className="w-full bg-purple-400 dark:bg-purple-500 rounded-t-sm transition-all group-hover/bar:bg-purple-600"
                        style={{ height: `${(d.value / maxWeeklyValue) * 100}%` }}
                      />
                    </div>
                  </div>
                )) : (
                  <div className="text-xs text-slate-400">暂无数据</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. 核心做题模式入口 (Core Review Modes) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">智能复习模式</h2>
            <Link to="/review" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
              进入错题本 <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/review/recall" className="group relative bg-indigo-600 rounded-[24px] p-6 overflow-hidden shadow-lg shadow-indigo-600/20 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 relative z-10">
                <BrainCircuit size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">回忆模式</h3>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed relative z-10">主动回忆填空与默写，最硬核的抗遗忘方式，直击核心难点。</p>
            </Link>

            <Link to="/review/discern" className="group relative bg-amber-500 rounded-[24px] p-6 overflow-hidden shadow-lg shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 relative z-10">
                <Shuffle size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">辨析模式</h3>
              <p className="text-amber-50 text-sm font-medium leading-relaxed relative z-10">易混知识点对比选择题，精准定位并纠正你的认知偏差。</p>
            </Link>

            <Link to="/review/rapid" className="group relative bg-emerald-500 rounded-[24px] p-6 overflow-hidden shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 relative z-10">
                <Zap size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">快刷模式</h3>
              <p className="text-emerald-50 text-sm font-medium leading-relaxed relative z-10">极简速刷，10秒一题。充分利用碎片时间进行高密度知识复习。</p>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 4. 题库 & 内容推荐区 (Question Bank & Recommendations) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">推荐题库</h2>
              <Link to="/library" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                全部题库 <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recent */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                  <History size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">最近练习：前端八股文</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">包含 React, Vue, 浏览器原理等核心考点，上次复习到第 42 题。</p>
                </div>
              </div>

              {/* Weak Points */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-red-300 dark:hover:border-red-500/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <AlertCircle size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">薄弱知识点专项</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">基于大模型分析，你在“网络协议”板块的错误率较高，已生成专项。</p>
                </div>
              </div>

              {/* High Freq Errors */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                  <Star size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">高频错题集</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">收录了你反复做错超过 3 次的顽固知识点，建议使用费曼模式攻克。</p>
                </div>
              </div>

              {/* Multi-language */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Globe size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">多语种词单</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">英语四六级、考研词汇、日语 N1 核心词法分类快捷入口。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 错题 & 任务快捷区 (Mistakes & Tasks) */}
          <section className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">今日任务</h2>
            
            <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
              
              {/* Task 1: Pending Ebbinghaus */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Library size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">待复习内容</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">艾宾浩斯曲线提醒</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{tasks.ebbinghausPending}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>

              {/* Task 2: Expired */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                    <Clock size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">过期未复习</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">急需抢救的记忆</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-red-600 dark:text-red-400">{tasks.expiredReviews}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>

              {/* Task 3: Corrections */}
              <div className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <BookOpen size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">待订正错题</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">一键进入错题重做</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-orange-600 dark:text-orange-400">{tasks.pendingCorrections}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
