export interface AiChatRequest {
  message: string;
  topK: number;
}

export interface AiChatSource {
  title: string;
  url: string;
  snippet: string;
}

export interface AiChatResponse {
  answer: string;
  sessionId: string;
  usedTools: string[];
  sources: AiChatSource[];
}

const AI_CHAT_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/ai/chat/stream`
  : "/api/ai/chat/stream";

export async function chatWithAi(
  payload: AiChatRequest,
): Promise<AiChatResponse> {
  const response = await fetch(AI_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = `AI chat request failed: ${response.status}`;
    throw new Error(message);
  }

  return (await response.json()) as AiChatResponse;
}
