import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  Clock,
  Tag,
  Loader2,
  Trash2,
} from "lucide-react";
import { Layout } from "../components/Layout";
// import { search } from "../api/search";
// import {
//   getSearchHistory,
//   addSearchHistory,
//   clearSearchHistory,
//   removeSearchHistory,
// } from "../api/searchHistory";
import { KnowledgeItem } from "../types";

function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    // setSearchHistory(getSearchHistory());
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
      setLoading(true);
      setError(null);
      try {
        // addSearchHistory(query);
        // setSearchHistory(getSearchHistory());
        // const response = await search(query);
        // setResults(response.results);
      } catch (err) {
        setError("搜索失败，请重试");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
    setError(null);
  };

  const handleHistoryClick = async (keyword: string) => {
    setQuery(keyword);
    setHasSearched(true);
    setLoading(true);
    setError(null);
    try {
      // const response = await search(keyword);
      // setResults(response.results);
    } catch (err) {
      setError("搜索失败，请重试");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、内容、标签..."
            className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          )}
        </form>

        {!hasSearched ? (
          <div className="space-y-6">
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <h3 className="text-sm font-medium text-slate-600">
                      搜索历史
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSearchHistory([]);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    清除
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((keyword) => (
                    <div key={keyword} className="relative">
                      <button
                        onClick={() => handleHistoryClick(keyword)}
                        className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        {keyword}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="absolute -top-1 -right-1 p-0.5 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-slate-400" />
                <h3 className="text-sm font-medium text-slate-600">热门标签</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "TypeScript",
                  "AI",
                  "效率",
                  "Node.js",
                  "Docker",
                  "前端",
                  "后端",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleHistoryClick(tag)}
                    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center py-8">
              <SearchIcon className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500">输入关键词搜索知识库</p>
            </div>
          </div>
        ) : query.trim() === "" ? (
          <div className="text-center py-8">
            <SearchIcon className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500">请输入搜索关键词</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <Loader2
              className="mx-auto text-indigo-500 mb-3 animate-spin"
              size={40}
            />
            <p className="text-slate-500">搜索中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <SearchIcon className="mx-auto text-red-400 mb-3" size={40} />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              重试
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500 mb-4">
              找到 {results.length} 个结果
            </p>
            <div className="space-y-3">
              {results.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-slate-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatDate(new Date(item.createdAt))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
