import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Layout } from "../components/Layout";
import type { ReviewFeedback } from "../types";
import { useReviewDueQuery } from "@/features/review/useReviewDueQuery";

export function ReviewPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Record<string, ReviewFeedback>>({});

  const { data, isLoading, isError, error } = useReviewDueQuery();

  const pendingItems = data?.cards || [];
  const completedCount = Object.keys(feedbacks).length;
  const currentItem = pendingItems[currentIndex];

  const handleFeedback = (feedback: ReviewFeedback) => {
    if (currentItem) {
      setFeedbacks({ ...feedbacks, [currentItem.id]: feedback });
      // TODO: send feedback to backend API
      if (currentIndex < pendingItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowPoints(false);
      } else {
        // Increment currentIndex to trigger completed state
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
          <p>正在获取待复习卡片...</p>
        </div>
      </Layout>
    );
  }

  if (isError) {
    if (error instanceof Error && error.message === "请先登录") {
      navigate("/auth");
      return null;
    }
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
          <AlertCircle className="w-8 h-8 mb-4 text-red-500" />
          <p>加载失败: {error?.message || "未知错误"}</p>
        </div>
      </Layout>
    );
  }

  if (pendingItems.length === 0 || currentIndex >= pendingItems.length) {
    return (
      <Layout>
        <div className="p-4 lg:p-8 space-y-6">
          <header className="flex items-center gap-3 mb-6">
            <Link to="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">复习</h1>
          </header>

          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="text-green-600" size={40} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              太棒了！
            </h2>
            <p className="text-slate-500">今日复习已完成</p>
            <Link
              to="/"
              className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <header className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">复习</h1>
          <span className="ml-auto text-sm text-slate-500">
            {currentIndex + 1} / {pendingItems.length}
          </span>
        </header>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 flex items-center gap-3 border border-amber-100">
          <Clock className="text-amber-600" size={20} />
          <div>
            <p className="text-sm text-amber-800 font-medium">
              待复习: {data?.total_due || 0} 张
            </p>
            <p className="text-xs text-amber-600">
              新学: {data?.new || 0} | 学习中: {data?.learning || 0} | 复习: {data?.review || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            知识卡片
          </h2>
          <p className="text-slate-600 mb-4 whitespace-pre-wrap">
            {currentItem?.knowledge_content}
          </p>

          {!showPoints ? (
            <button
              onClick={() => setShowPoints(true)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              显示答案 / 思考结果
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 mb-2">卡片信息</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-100 rounded">状态: {currentItem?.status}</span>
                <span className="px-2 py-1 bg-slate-100 rounded">掌握度: {currentItem?.stability?.toFixed(2) || 0}</span>
                <span className="px-2 py-1 bg-slate-100 rounded">难度: {currentItem?.difficulty?.toFixed(2) || 0}</span>
              </div>
            </div>
          )}
        </div>

        {showPoints && (
          <div className="flex gap-3">
            <button
              onClick={() => handleFeedback("needs_review")}
              className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              忘记了
            </button>
            <button
              onClick={() => handleFeedback("remembered")}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              记住了
            </button>
          </div>
        )}

        {completedCount > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">
              当前进度
            </p>
            <div className="flex gap-2">
              {pendingItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    feedbacks[item.id] === "remembered"
                      ? "bg-green-500"
                      : feedbacks[item.id] === "needs_review"
                      ? "bg-red-400"
                      : index === currentIndex
                      ? "bg-indigo-500"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <Link
          to="/library"
          className="flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-slate-700 mt-4"
        >
          查看知识库
          <ChevronRight size={16} />
        </Link>
      </div>
    </Layout>
  );
}
