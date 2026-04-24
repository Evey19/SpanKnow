import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export interface KnowledgeCard {
  cardId: number;
  content: string;
  question: string;
  keywords: string[];
  summary: string;
  analogy: string;
  mnemonic: string;
}

export interface ConfusableGroup {
  nameA: string;
  descA: string;
  nameB: string;
  descB: string;
  diffPoints: string[];
}

export interface ParseData {
  knowledge_card_list: KnowledgeCard[];
  confusable_group_list: ConfusableGroup[];
}

export interface ParseResponse {
  message: string;
  data: ParseData;
}

export function useContentDismantleMutation() {
  return useMutation({
    mutationFn: async (payload: { text: string }) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      return fetchApi<ParseResponse>(`v1/dismantle/parse`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    },
  });
}
