import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Tag,
  FileText,
  Grid,
  List,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { useContentsQuery } from "@/features/contents/useContentsQuery";
import { useContentTagsQuery } from "@/features/contents/useContentTagsQuery";
import { toast } from "sonner";

function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function getStatusBadge(status: string) {
  if (status === "published") {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
        已发布
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-50 text-slate-600 border border-slate-200">
      草稿
    </span>
  );
}

export function LibraryPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const { data, isLoading, error } = useContentsQuery({
    page,
    page_size: 20,
    keyword: keyword.trim() ? keyword.trim() : undefined,
    tag: selectedTags.length === 1 ? selectedTags[0] : undefined,
    tags: selectedTags.length > 1 ? selectedTags : undefined,
  });

  const { data: tagsData, error: tagsError } = useContentTagsQuery();

  useEffect(() => {
    if (!error) return;
    if (error instanceof Error && error.message !== "请先登录") {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (!tagsError) return;
    if (tagsError instanceof Error) {
      toast.error(tagsError.message);
    }
  }, [tagsError]);

  const items = useMemo(() => data?.data ?? [], [data?.data]);
  const total = data?.total ?? 0;
  const pageSize = data?.page_size ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const availableTags = useMemo(() => tagsData?.data ?? [], [tagsData?.data]);

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
            知识库
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <Grid size={20} />
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索标题..."
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              搜索
            </button>
          </div>

          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setPage(1);
                    toggleTag(tag);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-slate-500">加载中...</div>
        ) : error instanceof Error && error.message === "请先登录" ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Tag className="text-slate-400" size={40} />
            </div>
            <p className="text-slate-500 text-lg">请先登录后查看内容</p>
            <Link
              to="/auth"
              className="text-indigo-600 text-sm hover:underline mt-2 inline-block"
            >
              去登录
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Tag className="text-slate-400" size={40} />
            </div>
            <p className="text-slate-500 text-lg">暂无知识条目</p>
            <Link
              to="/add"
              className="text-indigo-600 text-sm hover:underline mt-2 inline-block"
            >
              立即添加
            </Link>
          </div>
        ) : viewMode === "list" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <FileText size={16} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800 truncate">
                        {item.title}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        {formatDate(new Date(item.created_at))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-slate-500" />
                    <span className="text-xs text-slate-400">
                      {formatDate(new Date(item.created_at))}
                    </span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <h3 className="font-medium text-slate-800 text-sm line-clamp-2 mb-3">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50"
            >
              上一页
            </button>
            <div className="text-sm text-slate-500">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
