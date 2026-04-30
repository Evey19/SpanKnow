import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Bot, Send, Sparkles, Bug, Trash2 } from "lucide-react";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import {
  chatWithAiStream,
  confirmAssistantSave,
  type AiChatChunk,
  type AssistantMessage,
  type ConfirmSaveDraft,
  type AssistantStatusPhase,
} from "../api/ai";
import { Markdown } from "./Markdown";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chunks?: AiChatChunk[];
}

type DebugEventType = "meta" | "delta" | "done" | "trace" | "tool" | "error" | string;

type DebugTimelineEvent = {
  id: string;
  at: number;
  event: DebugEventType;
  data: unknown;
};

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatDrawer({ isOpen, onClose }: AIChatDrawerProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const debugScrollRef = useRef<HTMLDivElement | null>(null);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [timeline, setTimeline] = useState<DebugTimelineEvent[]>([]);
  const [saveDraft, setSaveDraft] = useState<ConfirmSaveDraft | null>(null);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [streamPhase, setStreamPhase] = useState<AssistantStatusPhase | "connecting" | null>(null);
  const [streamStartedAt, setStreamStartedAt] = useState<number | null>(null);
  const [lastPingAt, setLastPingAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const renderMessages = useMemo(() => messages, [messages]);
  const renderTimeline = useMemo(() => timeline, [timeline]);
  const safeDraftHtml = useMemo(() => {
    if (!saveDraft?.content_html) return "";
    return DOMPurify.sanitize(saveDraft.content_html, { USE_PROFILES: { html: true } });
  }, [saveDraft?.content_html]);

  function toAssistantMessages(list: Message[]): AssistantMessage[] {
    return list.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  }

  function pushTimeline(event: DebugTimelineEvent) {
    setTimeline((prev) => [...prev, event].slice(-500));
  }

  function newEventId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [isOpen, renderMessages]);

  useEffect(() => {
    if (!debugOpen) return;
    const el = debugScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [debugOpen, renderTimeline]);

  useEffect(() => {
    if (!isStreaming) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [isStreaming]);

  const handleSubmit = (value: string) => {
    const message = value.trim();
    if (!message || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };
    const assistantId = `${Date.now() + 1}`;

    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setInputValue("");

    setStreamPhase("connecting");
    setStreamStartedAt(Date.now());
    setLastPingAt(null);
    setIsStreaming(true);
    void chatWithAiStream(
      {
        messages: [
          ...toAssistantMessages(nextMessages),
        ],
        rag_enabled: false,
        top_k: 5,
        debug: debugEnabled,
      },
      {
        onStatus: (data) => {
          setStreamPhase(data.phase);
        },
        onPing: () => {
          setLastPingAt(Date.now());
        },
        onMeta: (data) => {
          pushTimeline({
            id: newEventId(),
            at: Date.now(),
            event: "meta",
            data,
          });
        },
        onReplyDelta: (delta) => {
          pushTimeline({
            id: newEventId(),
            at: Date.now(),
            event: "delta",
            data: { content: delta },
          });
        },
        onDone: () => {
          pushTimeline({
            id: newEventId(),
            at: Date.now(),
            event: "done",
            data: {},
          });
        },
        onConfirmSave: (draft) => {
          pushTimeline({
            id: newEventId(),
            at: Date.now(),
            event: "confirm_save",
            data: draft,
          });
          setSaveDraft(draft);
          setSaveTitle(draft.title || "");
        },
        onEvent: (event, data) => {
          if (event === "meta" || event === "delta" || event === "done") return;
          pushTimeline({
            id: newEventId(),
            at: Date.now(),
            event,
            data,
          });
        },
        onProgress: (snapshot) => {
          setMessages((p) =>
            p.map((m) =>
              m.id === assistantId
                ? { ...m, content: snapshot.reply, chunks: snapshot.chunks ?? m.chunks }
                : m,
            ),
          );
        },
      },
    )
      .then((final) => {
        setMessages((p) =>
          p.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: final.reply,
                  chunks: final.chunks ?? [],
                }
              : m,
          ),
        );
      })
      .catch((error) => {
        console.log(error);
        pushTimeline({
          id: newEventId(),
          at: Date.now(),
          event: "error",
          data: { message: error instanceof Error ? error.message : String(error) },
        });
        setStreamPhase("error");
        setMessages((p) =>
          p.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "请求失败，请检查网络连接或服务是否正常运行。",
                }
              : m,
          ),
        );
      })
      .finally(() => {
        setIsStreaming(false);
        setStreamPhase(null);
        setLastPingAt(null);
        setStreamStartedAt(null);
      });
  };

  if (!isOpen) return null;

  const canSend = inputValue.trim().length > 0 && !isStreaming;
  const hasMessages = renderMessages.length > 0;

  const timelineLabel = debugEnabled ? "调试已开启" : "调试已关闭";
  const elapsedSec = streamStartedAt ? Math.max(0, Math.floor((nowMs - streamStartedAt) / 1000)) : 0;
  const pingAgeSec = lastPingAt ? Math.max(0, Math.floor((nowMs - lastPingAt) / 1000)) : null;

  function phaseText(phase: typeof streamPhase) {
    if (!phase) return "就绪";
    if (phase === "connecting") return "连接中…";
    if (phase === "connected") return "已连接，处理中…";
    if (phase === "routing") return "正在理解你的意图…";
    if (phase === "chat") return "正在生成回复…";
    if (phase === "drafting") return "正在生成保存草稿…";
    if (phase === "need_clarify") return "需要你补充信息…";
    if (phase === "await_confirm") return "草稿已生成，等待确认";
    if (phase === "error") return "发生错误";
    return "处理中…";
  }

  const statusLine = isStreaming
    ? `${phaseText(streamPhase)}${elapsedSec ? ` · 已等待 ${elapsedSec}s` : ""}${pingAgeSec !== null ? ` · 心跳 ${pingAgeSec}s 前` : ""}`
    : "就绪";

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div
        className="absolute inset-0 bg-overlay/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[420px] h-full bg-popover/95 text-popover-foreground backdrop-blur-xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-border/70">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-[color:var(--chart-4)] flex items-center justify-center shadow-lg">
                <Bot className="text-primary-foreground" size={20} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-foreground tracking-tight">AI 助手</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-semibold">
                    <Sparkles size={12} />
                    流式
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {statusLine}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDebugEnabled((v) => !v)}
                className={`h-8 px-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors ${
                  debugEnabled
                    ? "bg-foreground text-background border-border"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
                aria-pressed={debugEnabled}
                title={timelineLabel}
              >
                <Bug size={14} />
                调试
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setTimeline([]);
                  setSaveDraft(null);
                  setSaveTitle("");
                }}
                className="h-8 px-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border border-border bg-background text-foreground hover:bg-muted transition-colors"
                title="清空对话"
              >
                <Trash2 size={14} />
                清空
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
        >
          {!hasMessages ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-sm rounded-3xl border border-border/70 bg-card/80 backdrop-blur px-5 py-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-foreground">从一个问题开始</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      例如：解释 FSRS、总结文章、生成复习卡片
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    "帮我解释一下 FSRS",
                    "把这段内容总结成要点",
                    "给我 5 道自测题",
                    "把它变成复习卡片",
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setInputValue(q);
                      }}
                      className="text-left rounded-2xl border border-border/70 bg-background px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-[11px] text-muted-foreground">
                  {debugEnabled ? "调试已开启：将展示 trace/tool/error 时间线" : "可在右上角开启调试"}
                </div>
              </div>
            </div>
          ) : null}

          {renderMessages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser ? (
                  <div className="mt-0.5 w-8 h-8 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-sm shrink-0">
                    <Bot size={16} />
                  </div>
                ) : null}

                <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed break-words ${
                      isUser
                        ? "bg-primary text-primary-foreground shadow-lg rounded-br-md whitespace-pre-wrap"
                        : "bg-card text-card-foreground border border-border/70 shadow-sm rounded-bl-md"
                    }`}
                  >
                    {isUser ? (
                      m.content
                    ) : (
                      <Markdown
                        content={m.content || (isStreaming && !isUser ? " " : "")}
                        className=""
                      />
                    )}
                    {isStreaming && !isUser && m.id === renderMessages[renderMessages.length - 1]?.id ? (
                      <span className="inline-block w-2 h-4 align-text-bottom ml-1 bg-muted-foreground/70 animate-pulse rounded-sm" />
                    ) : null}
                  </div>

                  {!isUser && m.chunks && m.chunks.length ? (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground">
                        参考内容（{m.chunks.length}）
                      </summary>
                      <div className="mt-2 space-y-2">
                        {m.chunks.map((c, idx) => (
                          <div
                            key={c.id || String(idx)}
                            className="text-xs text-muted-foreground bg-card/70 border border-border/60 rounded-xl px-3 py-2 leading-relaxed"
                          >
                            {c.content}
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>

                {isUser ? (
                  <div className="mt-0.5 w-8 h-8 rounded-2xl bg-muted border border-border text-muted-foreground flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-xs font-bold">你</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-2">
          <details
            open={debugOpen}
            onToggle={(e) => setDebugOpen((e.target as HTMLDetailsElement).open)}
            className={`rounded-2xl border ${
              debugEnabled ? "border-border/70 bg-card/70" : "border-border/50 bg-card/40"
            }`}
          >
            <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug size={16} className={debugEnabled ? "text-foreground" : "text-muted-foreground"} />
                <span className={`text-sm font-semibold ${debugEnabled ? "text-foreground" : "text-muted-foreground"}`}>
                  调试时间线
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {timelineLabel} · {renderTimeline.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">展开</span>
            </summary>
            <div className="px-4 pb-4">
              <div
                ref={debugScrollRef}
                className="max-h-[180px] overflow-y-auto rounded-xl border border-border/70 bg-background"
              >
                {renderTimeline.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-muted-foreground">
                    暂无事件。开启调试并发送消息后，将看到 trace/tool/error。
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {renderTimeline.map((evt) => {
                      const badge =
                        evt.event === "tool"
                          ? "bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]"
                          : evt.event === "trace"
                            ? "bg-[color:var(--chart-1)]/12 text-[color:var(--chart-1)]"
                            : evt.event === "error"
                              ? "bg-destructive/10 text-destructive"
                              : evt.event === "meta"
                                ? "bg-muted text-foreground"
                                : evt.event === "done"
                                  ? "bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]"
                                  : "bg-muted text-foreground";

                      const time = new Date(evt.at).toLocaleTimeString();
                      return (
                        <div key={evt.id} className="px-3 py-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge}`}>
                                {evt.event}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{time}</span>
                            </div>
                          </div>
                          <pre className="mt-2 overflow-x-auto rounded-lg bg-foreground text-background p-2 text-[11px] leading-relaxed">
                            {JSON.stringify(evt.data, null, 2)}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>

        <Dialog
          open={Boolean(saveDraft)}
          onOpenChange={(open) => {
            if (open) return;
            if (isSaving) return;
            setSaveDraft(null);
            setSaveTitle("");
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>确认保存草稿</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-foreground">标题</div>
                <Input
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="请输入标题"
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-foreground">预览</div>
                <div className="max-h-[320px] overflow-y-auto rounded-xl border border-border bg-background p-3">
                  <div
                    className="text-sm leading-relaxed text-foreground [&_h1]:text-base [&_h1]:font-extrabold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_pre]:my-2 [&_pre]:rounded-xl [&_pre]:bg-foreground [&_pre]:p-3 [&_pre]:text-background [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_a]:underline [&_a]:underline-offset-4"
                    dangerouslySetInnerHTML={{ __html: safeDraftHtml }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">
                trace_id：{saveDraft?.trace_id || "-"}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={isSaving}
                onClick={() => {
                  setSaveDraft(null);
                  setSaveTitle("");
                }}
              >
                取消
              </Button>
              <Button
                disabled={!saveDraft || !saveTitle.trim() || isSaving}
                onClick={async () => {
                  if (!saveDraft) return;
                  const title = saveTitle.trim();
                  if (!title) return;
                  setIsSaving(true);
                  try {
                    const res = await confirmAssistantSave({
                      trace_id: saveDraft.trace_id,
                      title,
                      content_html: saveDraft.content_html,
                    });
                    toast.success("已保存到内容库");
                    setSaveDraft(null);
                    setSaveTitle("");
                    const maybeId = (res.content as Record<string, unknown> | undefined)?.id;
                    if (typeof maybeId === "string" && maybeId.length > 0) {
                      navigate(`/item/${maybeId}`);
                    }
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "保存失败");
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                {isSaving ? "保存中..." : "确认保存"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="px-5 py-4 border-t border-border/70 bg-background/80 backdrop-blur-xl">
          <div className="rounded-2xl border border-border/70 bg-background shadow-sm overflow-hidden">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(inputValue);
                }
              }}
              rows={3}
              placeholder="输入你的问题…（Enter 发送，Shift+Enter 换行）"
              className="w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-border/60 bg-muted/60">
              <div className="text-[11px] text-muted-foreground">
                {isStreaming ? "AI 正在生成…" : "提示：提问越具体，回答越精准"}
              </div>
              <button
                onClick={() => handleSubmit(inputValue)}
                disabled={!canSend}
                className={`h-8 px-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-all ${
                  canSend
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Send size={16} />
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
