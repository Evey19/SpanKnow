import { useState } from "react";
import { X, Bot } from "lucide-react";
import { Bubble, Sender } from "@ant-design/x";
import { useAiChatMutation } from "../features/ai/useAiChatMutation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function buildAssistantContent(
  answer: string,
  usedTools: string[],
  sources: { title: string; url: string }[],
) {
  const toolsText = usedTools.length
    ? `\n\n使用工具：${usedTools.join("、")}`
    : "";
  const sourcesText = sources.length
    ? `\n\n参考来源：\n${sources.map((s, i) => `${i + 1}. ${s.title} ${s.url}`).join("\n")}`
    : "";
  return `${answer}${toolsText}${sourcesText}`;
}

export function AIChatDrawer({ isOpen, onClose }: AIChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是你的 AI 助手，有什么可以帮你的吗？",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState(`session-${Date.now()}`);
  const chatMutation = useAiChatMutation();

  const handleSubmit = (value: string) => {
    const message = value.trim();
    if (!message || chatMutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: message },
    ]);
    setInputValue("");

    chatMutation.mutate(
      { message, topK: 10 },
      {
        onSuccess: (data) => {
          setSessionId(data.sessionId || sessionId);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: buildAssistantContent(
                data.answer,
                data.usedTools ?? [],
                data.sources ?? [],
              ),
            },
          ]);
        },
        onError: (error) => {
          console.log(error);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content:
                "请求失败，请检查网络连接或服务是否正常运行。",
            },
          ]);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bot className="text-indigo-600" size={20} />
            </div>
            <span className="font-bold text-slate-800">AI 助手</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
          <Bubble.List
            items={messages.map(({ id, role, content }) => ({
              key: id,
              role,
              content,
            }))}
          />
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <Sender
            loading={chatMutation.isPending}
            value={inputValue}
            onChange={(v) => setInputValue(v)}
            onSubmit={() => handleSubmit(inputValue)}
            placeholder="输入你的问题..."
          />
        </div>
      </div>
    </div>
  );
}
