import { fetchApi } from "./client";

export type AssistantRole = "system" | "user" | "assistant" | "tool";

export interface ChatToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface AssistantMessage {
  role: AssistantRole;
  content: string;
  tool_call_id?: string;
  tool_calls?: ChatToolCall[];
}

export interface AiChatRequest {
  messages: AssistantMessage[];
  rag_enabled?: boolean;
  top_k?: number;
  debug?: boolean;
}

export interface AiChatChunk {
  id: string;
  content: string;
}

export interface AiChatResponse {
  reply: string;
  chunks: AiChatChunk[];
}

export interface ConfirmSaveDraft {
  trace_id: string;
  title: string;
  content_html: string;
}

export interface ConfirmSaveRequest {
  trace_id?: string;
  title: string;
  content_html: string;
}

export interface ConfirmSaveResponse {
  trace_id?: string;
  content?: unknown;
}

export type AssistantStatusPhase =
  | "connected"
  | "routing"
  | "chat"
  | "drafting"
  | "need_clarify"
  | "await_confirm"
  | string;

export interface AssistantStatusEvent {
  phase: AssistantStatusPhase;
}

export interface AssistantPingEvent {
  t?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function buildAssistantChatUrl() {
  const endpoint = "/v1/assistant/chat";
  if (API_BASE_URL.startsWith("http")) {
    return `${API_BASE_URL.replace(/\/$/, "")}${endpoint}`;
  }
  return `${API_BASE_URL.replace(/\/$/, "")}${endpoint}`;
}

function normalizeChunk(input: unknown): AiChatChunk | undefined {
  if (!input || typeof input !== "object") return undefined;
  const v = input as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.content !== "string") return undefined;
  return { id: v.id, content: v.content };
}

export interface AiChatStreamHandlers {
  onMeta?: (data: { chunks: AiChatChunk[] }) => void;
  onReplyDelta?: (delta: string) => void;
  onConfirmSave?: (draft: ConfirmSaveDraft) => void;
  onStatus?: (data: AssistantStatusEvent) => void;
  onPing?: (data: AssistantPingEvent) => void;
  onDone?: () => void;
  onEvent?: (event: string, data: unknown) => void;
  onChunksDelta?: (chunk: AiChatChunk) => void;
  onProgress?: (snapshot: AiChatResponse) => void;
}

export async function chatWithAiStream(
  payload: AiChatRequest,
  handlers: AiChatStreamHandlers = {},
  signal?: AbortSignal,
): Promise<AiChatResponse> {
  const token = localStorage.getItem("access_token");
  const requestPayload: Record<string, unknown> = {
    messages: payload.messages,
    rag_enabled: Boolean(payload.rag_enabled),
  };
  if (Number.isFinite(payload.top_k)) {
    const topK = Math.min(20, Math.max(1, Math.floor(Number(payload.top_k))));
    requestPayload.top_k = topK;
  }
  if (payload.debug === true) {
    requestPayload.debug = true;
  }
  const response = await fetch(buildAssistantChatUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestPayload),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`AI chat request failed: ${response.status} ${text.slice(0, 200)}`);
  }

  if (!response.body) {
    throw new Error("AI chat stream is not supported by the browser");
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();

  let reply = "";
  const chunks: AiChatChunk[] = [];
  let buffer = "";

  function emitProgress() {
    handlers.onProgress?.({ reply, chunks: [...chunks] });
  }

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replace(/\r\n/g, "\n");

    while (true) {
      const boundaryIndex = buffer.indexOf("\n\n");
      if (boundaryIndex === -1) break;

      const rawEvent = buffer.slice(0, boundaryIndex);
      buffer = buffer.slice(boundaryIndex + 2);

      const lines = rawEvent
        .split("\n")
        .map((l) => l.replace(/\r$/, ""))
        .filter(Boolean);

      let eventType: string | undefined;
      const dataLines: string[] = [];
      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventType = line.slice(6).trim();
        }
        if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trimStart());
        }
      }

      const data = dataLines.join("");
      if (eventType === "done") {
        handlers.onDone?.();
        handlers.onEvent?.("done", {});
        return { reply, chunks };
      }
      if (!data) continue;
      if (data === "[DONE]") return { reply, chunks };

      let parsed: unknown = data;
      try {
        parsed = JSON.parse(data);
      } catch {}

      if (eventType === "delta" && parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        if (typeof obj.content === "string") {
          reply += obj.content;
          handlers.onReplyDelta?.(obj.content);
          handlers.onEvent?.("delta", parsed);
          emitProgress();
          continue;
        }
      }

      if (eventType === "meta" && parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        if (Array.isArray(obj.chunks)) {
          const normalized = obj.chunks.map(normalizeChunk).filter(Boolean) as AiChatChunk[];
          chunks.splice(0, chunks.length, ...normalized);
          handlers.onMeta?.({ chunks: [...chunks] });
          handlers.onEvent?.("meta", { chunks: [...chunks] });
          emitProgress();
          continue;
        }
      }

      if (eventType === "confirm_save" && parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        const traceId = typeof obj.trace_id === "string" ? obj.trace_id : undefined;
        const title = typeof obj.title === "string" ? obj.title : undefined;
        const contentHtml = typeof obj.content_html === "string" ? obj.content_html : undefined;
        if (traceId && title !== undefined && contentHtml !== undefined) {
          handlers.onConfirmSave?.({
            trace_id: traceId,
            title,
            content_html: contentHtml,
          });
          handlers.onEvent?.("confirm_save", parsed);
          continue;
        }
      }

      if (eventType === "status" && parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        if (typeof obj.phase === "string") {
          handlers.onStatus?.({ phase: obj.phase });
          handlers.onEvent?.("status", parsed);
          continue;
        }
      }

      if (eventType === "ping" && parsed && typeof parsed === "object") {
        handlers.onPing?.(parsed as AssistantPingEvent);
        handlers.onEvent?.("ping", parsed);
        continue;
      }

      if (eventType) {
        handlers.onEvent?.(eventType, parsed);
      }

      if (typeof parsed === "string") {
        reply += parsed;
        handlers.onReplyDelta?.(parsed);
        emitProgress();
        continue;
      }

      if (parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;

        if (typeof obj.reply === "string") {
          reply = obj.reply;
        }

        const delta =
          typeof obj.delta === "string"
            ? obj.delta
            : typeof obj.reply_delta === "string"
              ? obj.reply_delta
              : undefined;
        if (delta) {
          reply += delta;
          handlers.onReplyDelta?.(delta);
        }

        if (Array.isArray(obj.chunks)) {
          const normalized = obj.chunks.map(normalizeChunk).filter(Boolean) as AiChatChunk[];
          chunks.splice(0, chunks.length, ...normalized);
        }

        const chunk =
          normalizeChunk(obj.chunk) ??
          normalizeChunk(obj.source) ??
          normalizeChunk(obj.document);
        if (chunk) {
          chunks.push(chunk);
          handlers.onChunksDelta?.(chunk);
        }

        emitProgress();
        continue;
      }

      reply += data;
      handlers.onReplyDelta?.(data);
      emitProgress();
    }
  }

  return { reply, chunks };
}

export async function chatWithAi(payload: AiChatRequest): Promise<AiChatResponse> {
  return chatWithAiStream(payload);
}

export async function confirmAssistantSave(payload: ConfirmSaveRequest): Promise<ConfirmSaveResponse> {
  return fetchApi<ConfirmSaveResponse>("v1/assistant/confirm-save", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
