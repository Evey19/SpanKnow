import { useState } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, Brain, LayoutGrid } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6 text-indigo-500" />,
    title: '知识图谱构建',
    description: '通过卡片和链接，构建你的个人知识网络。',
  },
  {
    icon: <Search className="w-6 h-6 text-indigo-500" />,
    title: '全局极速检索',
    description: '毫秒级搜索，让你瞬间找到沉淀的每一个灵感。',
  },
  {
    icon: <LayoutGrid className="w-6 h-6 text-indigo-500" />,
    title: '模块化卡片',
    description: '将复杂概念拆解为易于消化的知识卡片。',
  }
];

const recentCards = [
  {
    id: 1,
    title: 'React 并发渲染原理解析',
    category: '前端工程化',
    date: '2023-10-24',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Tailwind CSS 进阶技巧',
    category: 'UI 设计',
    date: '2023-10-23',
    readTime: '3 min read'
  },
  {
    id: 3,
    title: '深入理解 TypeScript 泛型',
    category: '编程语言',
    date: '2023-10-21',
    readTime: '8 min read'
  }
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <BookOpen className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">SpanKnow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">发现</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">专栏</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">关于</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">登录</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-200">
              开始使用
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2000ms' }}></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4000ms' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>知识管理的新范式</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            连接灵感，<br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              跨越认知的边界
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10">
            SpanKnow 帮助你将碎片化的信息编织成结构化的知识图谱。构建、检索、分享，让每一次学习都有迹可循。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              创建我的知识库
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto justify-center">
              探索精选内容
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Cards Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">近期精选</h2>
              <p className="text-slate-600">探索社区中最新沉淀的优质知识卡片</p>
            </div>
            <button className="hidden md:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCards.map((card) => (
              <div 
                key={card.id}
                className={`p-6 rounded-2xl bg-white border transition-all cursor-pointer ${
                  hoveredCard === card.id 
                    ? 'border-indigo-200 shadow-lg shadow-indigo-100/50 -translate-y-1' 
                    : 'border-slate-200 shadow-sm'
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                    {card.category}
                  </span>
                  <span className="text-xs text-slate-400">{card.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2">
                  {card.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                  <span>{card.date}</span>
                  <div className={`transition-transform duration-300 ${hoveredCard === card.id ? 'translate-x-1 text-indigo-600' : ''}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold">SpanKnow</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SpanKnow. Crafted with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
}
