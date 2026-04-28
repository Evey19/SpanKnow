import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface ReviewCardItem {
  card_id: string;
  knowledge_content: string;
}

export interface AddReviewCardsPayload {
  content_id: string;
  cards: ReviewCardItem[];
}

export interface AddReviewCardsResponse {
  message: string;
  data: {
    added_count: number;
  };
}

export function useAddReviewCardsMutation() {
  return useMutation({
    mutationFn: async (payload: AddReviewCardsPayload) => {
      return fetchApi<AddReviewCardsResponse>("v1/review/cards", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      toast.success(`成功加入复习库 (${data.data.added_count} 张卡片)`);
    },
    onError: (error: any) => {
      toast.error(error.message || "加入复习库失败");
    },
  });
}
