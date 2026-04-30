import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Clock,
  Tag,
  ExternalLink,
  Check,
  Trash2,
  Edit,
  Share2,
  X,
  Save,
} from "lucide-react";
import { Layout } from "../components/Layout";
import DOMPurify from "dompurify";
import { useContentDetailQuery } from "@/features/contents/useContentDetailQuery";
import { useDeleteContentMutation } from "@/features/contents/useDeleteContentMutation";
import { useUpdateContentMutation } from "@/features/contents/useUpdateContentMutation";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DismantleResultView } from "@/components/DismantleResultView";
import { normalizePipeTablesHtml } from "@/lib/normalizePipeTablesHtml";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusBadge(status: string) {
  if (status === "published") {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)] border border-[color:var(--chart-3)]/20">
        已发布
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground border border-border">
      草稿
    </span>
  );
}

export function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useContentDetailQuery(id);
  const { mutate: deleteContent, isPending: isDeleting } = useDeleteContentMutation();
  const { mutateAsync: updateContent, isPending: isUpdating } = useUpdateContentMutation(id || "");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (data) {
      setEditTitle(data.title);
      setEditContent(data.content);
      setEditTags(data.tags ? [...data.tags] : []);
    }
  }, [data, isEditing]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const newTags = tagInput
      .split(/[,，、\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const uniqueNewTags = newTags.filter((t) => !editTags.includes(t));
    if (uniqueNewTags.length > 0) {
      setEditTags([...editTags, ...uniqueNewTags]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    let finalTags = [...editTags];
    if (tagInput.trim()) {
      const newTags = tagInput
        .split(/[,，、\s]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const uniqueNewTags = newTags.filter((t) => !finalTags.includes(t));
      if (uniqueNewTags.length > 0) {
        finalTags = [...finalTags, ...uniqueNewTags];
        setEditTags(finalTags);
      }
      setTagInput("");
    }

    if (!editTitle.trim()) {
      toast.error("标题不能为空");
      return;
    }

    try {
      await updateContent({
        title: editTitle,
        content: editContent,
        tags: finalTags,
      });
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error && err.message === "请先登录") {
        navigate("/auth");
      }
    }
  };

  useEffect(() => {
    if (!error) return;
    if (error instanceof Error && error.message !== "请先登录") {
      toast.error(error.message);
    }
  }, [error]);

  const safeHtml = useMemo(() => {
    if (!data?.content) return "";
    const normalized = normalizePipeTablesHtml(data.content);
    return DOMPurify.sanitize(normalized, { USE_PROFILES: { html: true } });
  }, [data?.content]);

  const plainText = useMemo(() => {
    if (!safeHtml) return "";
    const doc = new DOMParser().parseFromString(safeHtml, "text/html");
    return doc.body.textContent ?? "";
  }, [safeHtml]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(`${data.title}\n\n${plainText}`.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-6">
        <header className="flex items-center gap-3 mb-2">
          <button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                navigate(-1);
              }
            }}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1" />
          
          {data && !isEditing && (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors" 
                title="编辑"
              >
                <Edit size={20} className="text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="分享">
                <Share2 size={20} className="text-muted-foreground" />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" 
                    title="删除"
                    disabled={isDeleting}
                  >
                    <Trash2 size={20} className={isDeleting ? "text-destructive/40" : "text-destructive"} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除？</AlertDialogTitle>
                    <AlertDialogDescription>
                      删除后该条内容将无法恢复。你确定要删除《{data.title}》吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => id && deleteContent(id)}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      {isDeleting ? "删除中..." : "确认删除"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isUpdating ? "保存中..." : "保存修改"}
            </button>
          )}
        </header>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">加载中...</div>
        ) : error instanceof Error && error.message === "请先登录" ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Tag className="text-muted-foreground" size={40} />
            </div>
            <p className="text-muted-foreground text-lg">请先登录后查看内容</p>
            <Link
              to="/auth"
              className="text-primary text-sm hover:underline mt-2 inline-block"
            >
              去登录
            </Link>
          </div>
        ) : !data ? (
          <div className="text-center py-16 text-muted-foreground">内容不存在</div>
        ) : isEditing ? (
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                标题
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="输入标题..."
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground mb-4"
              />

              <label className="block text-sm font-medium text-foreground mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:opacity-80"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="可添加多个标签（多个标签请使用逗号、空格、顿号分隔）"
                  className="flex-1 px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
                >
                  添加
                </button>
              </div>

              <label className="block text-sm font-medium text-foreground mb-2">
                内容
              </label>
              <RichTextEditor
                value={editContent}
                onChange={setEditContent}
                placeholder="输入内容..."
                disabled={isUpdating}
                className="bg-card rounded-xl"
              />
            </div>
          </div>
        ) : (
          <article className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-xl font-bold text-foreground break-words">{data.title}</h1>
                <div className="shrink-0">{getStatusBadge(data.status)}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {data.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs bg-accent text-accent-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(new Date(data.created_at))}
                </span>
                {data.published_at && (
                  <span className="flex items-center gap-1">
                    <ExternalLink size={12} />
                    {formatDate(new Date(data.published_at))}
                  </span>
                )}
              </div>

              <div
                className="tiptap max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>
          </article>
        )}

        {!isEditing && id && (
          <DismantleResultView contentId={id} textContent={plainText} isDismantled={data?.is_dismantled} />
        )}

        {!isEditing && (
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={!data}
              className="flex-1 py-3 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <Check size={18} className="text-[color:var(--chart-3)]" />
              ) : (
                <Copy size={18} />
              )}
              {copied ? "已复制" : "复制内容"}
            </button>
            <Link
              to="/review"
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-center"
            >
              开始复习
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
