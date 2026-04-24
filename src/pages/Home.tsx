import { useState } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, Brain, LayoutGrid, Cloud, ShieldCheck, PenTool, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: <PenTool className="w-6 h-6 text-emerald-600" />,
    title: '沉浸式块级编辑',
    description: '采用现代化的块级编辑器，支持 Markdown 快捷键，让你的写作如丝般顺滑。',
  },
  {
    icon: <LayoutGrid className="w-6 h-6 text-emerald-600" />,
    title: '结构化知识目录',
    description: '无限层级的目录树，灵活的文档双链，帮助你构建严谨的个人与团队知识网络。',
  },
  {
    icon: <Cloud className="w-6 h-6 text-emerald-600" />,
    title: '多端实时同步',
    description: '毫秒级云端同步，随时随地在手机、平板和电脑上访问你的知识库。',
  }
];

const useCases = [
  {
    id: 1,
    title: '个人笔记与日记',
    description: '记录灵感、生活点滴与读书笔记，打造你的第二大脑。',
    icon: <Brain className="w-5 h-5 text-emerald-500" />
  },
  {
    id: 2,
    title: '团队知识沉淀',
    description: '项目文档、会议记录、规范指南，助力团队高效协同。',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
  },
  {
    id: 3,
    title: '全局极速检索',
    description: '强大的全文搜索能力，让你瞬间找到沉淀的每一个灵感。',
    icon: <Search className="w-5 h-5 text-emerald-500" />
  }
];

export default function Home() {
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <BookOpen className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-zinc-900">SpanKnow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#" className="hover:text-emerald-600 transition-colors">产品特性</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">解决方案</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">价格</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">下载</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">登录</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow-emerald-200">
              免费使用
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>全新升级的知识管理体验</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
            构建你的<span className="text-emerald-600">第二大脑</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 mb-10">
            SpanKnow 是一款结构化的个人与团队知识库。无论是闪念笔记、长篇写作还是团队文档，这里都是你思考、记录和协作的理想空间。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              免费开始记录
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all w-full sm:w-auto justify-center">
              了解企业版
            </button>
          </div>
        </div>

        {/* Workspace Mockup */}
        <div className="max-w-5xl mx-auto px-6 mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 shadow-2xl shadow-zinc-200/50 overflow-hidden flex flex-col md:flex-row h-[400px]">
            {/* Sidebar Mockup */}
            <div className="w-64 bg-zinc-50 border-r border-zinc-200/80 p-4 hidden md:block">
              <div className="flex items-center gap-2 text-zinc-800 font-medium mb-6">
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">S</div>
                我的工作区
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">笔记本</div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 p-1.5 rounded hover:bg-zinc-100">
                  <ChevronRight className="w-4 h-4" /> 日记与复盘
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-1.5 rounded font-medium">
                  <ChevronRight className="w-4 h-4 rotate-90" /> 产品需求文档
                </div>
                <div className="pl-6 space-y-1 mt-1">
                  <div className="text-sm text-zinc-800 p-1.5 rounded bg-white border border-zinc-100 shadow-sm">2024 Q3 规划</div>
                  <div className="text-sm text-zinc-500 p-1.5 rounded hover:bg-zinc-100">竞品分析报告</div>
                </div>
              </div>
            </div>
            {/* Editor Mockup */}
            <div className="flex-1 bg-white p-8">
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">2024 Q3 产品规划</h2>
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-8 border-b border-zinc-100 pb-4">
                <span>更新于 10 分钟前</span>
                <span>作者：Evey19</span>
              </div>
              <div className="space-y-4">
                <p className="text-zinc-600">在此阶段，我们将重点提升文档编辑器的核心体验，并增强云端同步的稳定性。</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="rounded text-emerald-600 accent-emerald-600" />
                  <span className="text-zinc-600 line-through">重构 Markdown 解析引擎</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" readOnly className="rounded border-zinc-300" />
                  <span className="text-zinc-800">支持多级目录树的拖拽排序</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" readOnly className="rounded border-zinc-300" />
                  <span className="text-zinc-800">上线深色模式 (Dark Mode)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">一切为了更好的思考</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">我们去除了多余的干扰，专注于打磨核心的书写与整理体验。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-zinc-100 hover:border-emerald-100 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-zinc-900 mb-6">满足你的各类知识管理需求</h2>
              <p className="text-zinc-600 mb-8 text-lg">
                无论你是学生、知识工作者还是团队管理者，SpanKnow 都能为你提供结构化的沉淀方案。
              </p>
              <div className="space-y-4">
                {useCases.map((useCase) => (
                  <div 
                    key={useCase.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                      hoveredCase === useCase.id 
                        ? 'border-emerald-200 bg-emerald-50/50 shadow-sm' 
                        : 'border-transparent hover:border-zinc-100 hover:bg-zinc-50'
                    }`}
                    onMouseEnter={() => setHoveredCase(useCase.id)}
                    onMouseLeave={() => setHoveredCase(null)}
                  >
                    <div className="mt-1">{useCase.icon}</div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 mb-1">{useCase.title}</h4>
                      <p className="text-sm text-zinc-500">{useCase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="aspect-square md:aspect-[4/3] rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative z-10 text-center">
                  <BookOpen className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium">无缝切换的知识图谱与文档视图</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 py-12 text-zinc-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">SpanKnow</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">关于我们</a>
            <a href="#" className="hover:text-white transition-colors">用户协议</a>
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} SpanKnow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
