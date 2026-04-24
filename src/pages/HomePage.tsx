import { Link } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Clock,
  Tag,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Layout } from "../components/Layout";

const mockStats = {
  totalItems: 42,
  todayAdded: 3,
  pendingReview: 5,
  tagsCount: 12,
};

const mockRecentItems = [
  {
    id: "1",
    title: "React 18 新特性详解",
    summary:
      "深入理解 React 18 带来的并发渲染机制、Suspense、useTransition 等新特性。",
    type: "link",
    tags: ["React", "前端"],
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "TypeScript 类型系统进阶",
    summary: "掌握 TypeScript 高级类型和条件类型、映射类型等概念。",
    type: "note",
    tags: ["TypeScript", "笔记"],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    title: "AI 工具效率提升指南",
    summary: "利用 AI 工具提升开发和学习效率的实用技巧。",
    type: "link",
    tags: ["AI", "效率"],
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: "4",
    title: "Docker 从入门到实践",
    summary: "Docker 基础概念、镜像构建、容器编排等完整教程。",
    type: "link",
    tags: ["Docker", "DevOps"],
    createdAt: new Date(Date.now() - 259200000),
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}

export function HomePage() {
  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        <header>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
            欢迎回来
          </h1>
          <p className="text-slate-500 mt-1">AI 个人知识库</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <BookOpen className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {mockStats.totalItems}
                </p>
                <p className="text-sm text-slate-500">知识条目</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {mockStats.todayAdded}
                </p>
                <p className="text-sm text-slate-500">今日新增</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {mockStats.pendingReview}
                </p>
                <p className="text-sm text-slate-500">待复习</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Tag className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {mockStats.tagsCount}
                </p>
                <p className="text-sm text-slate-500">标签数量</p>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/add"
          className="flex items-center justify-center gap-2 w-full lg:w-auto lg:px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          快速收藏
        </Link>

        {mockStats.pendingReview > 0 && (
          <Link
            to="/review"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg">今日复习</p>
                <p className="text-slate-500">
                  {mockStats.pendingReview} 条内容待复习
                </p>
              </div>
            </div>
            <ArrowRight className="text-amber-600" size={24} />
          </Link>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">最近添加</h2>
            <Link
              to="/library"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockRecentItems.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 line-clamp-2 mb-4">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
