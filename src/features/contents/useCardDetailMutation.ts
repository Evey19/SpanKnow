import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export interface CardDetailRequest {
  content: string;
  all_cards?: {
    card_id: string;
    card_name: string;
    keywords: string[];
  }[];
}

export interface CardDetailResponse {
  message: string;
  data: {
    summary: string;
    keywords: string[];
    confusable_list: {
      concept_a: string;
      concept_b: string;
      difference: string;
    }[];
    mnemonic: string;
    recommendations: string[];
  };
}

export function useCardDetailMutation(cardId: string) {
  return useMutation({
    mutationFn: async (data: CardDetailRequest) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<CardDetailResponse>(`v1/dismantle/card/${cardId}/detail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.data;
    },
  });
}
