import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, FileText, Keyboard, ArrowLeft, Sparkles } from "lucide-react";
import { Layout } from "../components/Layout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "sonner";
import { useCreateContent } from "@/features/contents/useCreateContentMutation";

type AddType = "link" | "text" | "note";

export function AddPage() {
  const navigate = useNavigate();
  const [addType, setAddType] = useState<AddType | null>(null);
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const { mutateAsync: createContent, isPending: isProcessing } =
    useCreateContent();

  const handleSubmit = async () => {
    if (!title && !url && addType !== "text" && addType !== "note") {
      toast.error("请输入标题或链接");
      return;
    }

    if (!title && (addType === "text" || addType === "note")) {
      toast.error("请输入标题");
      return;
    }

    try {
      const result = await createContent({
        title: title || url,
        content: content,
      });

      if (result && result.id) {
        navigate(`/item/${result.id}`);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      if (err.message === "请先登录") {
        navigate("/auth");
      }
    }
  };

  if (!addType) {
    return (
      <Layout>
        <div className="p-4 lg:p-8 space-y-6">
          <header className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">添加内容</h1>
          </header>

          <button
            onClick={() => setAddType("link")}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Link className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-slate-800">收藏网页链接</h3>
              <p className="text-sm text-slate-500">输入网址，自动提取内容</p>
            </div>
          </button>

          <button
            onClick={() => setAddType("text")}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Keyboard className="text-purple-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-slate-800">粘贴文本</h3>
              <p className="text-sm text-slate-500">复制粘贴文本内容</p>
            </div>
          </button>

          <button
            onClick={() => setAddType("note")}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText className="text-green-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-slate-800">新建笔记</h3>
              <p className="text-sm text-slate-500">手动创建知识笔记</p>
            </div>
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setAddType(null)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {addType === "link" && "收藏网页"}
            {addType === "text" && "粘贴内容"}
            {addType === "note" && "新建笔记"}
          </h1>
        </header>

        <div className="bg-indigo-50 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="text-indigo-600 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-indigo-800 font-medium">AI 智能处理</p>
            <p className="text-xs text-indigo-600 mt-0.5">
              添加后将自动提取关键信息、生成摘要和知识点
            </p>
          </div>
        </div>

        {addType === "link" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              网页链接
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        )}

        {addType !== "link" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入标题..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {addType === "link" ? "补充内容（可选）" : "内容"}
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder={
              addType === "link" ? "添加备注或补充说明..." : "输入内容..."
            }
            compact={addType === "link"}
            disabled={isProcessing}
            className="bg-white rounded-xl"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isProcessing || (!url && !title && !content)}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI 处理中...
            </>
          ) : (
            "收藏"
          )}
        </button>
      </div>
    </Layout>
  );
}
