import { useMutation } from "@tanstack/react-query";
import { chatWithAi, type AiChatRequest } from "../../api/ai";

export function useAiChatMutation() {
  return useMutation({
    mutationFn: (payload: AiChatRequest) => chatWithAi(payload),
  });
}
