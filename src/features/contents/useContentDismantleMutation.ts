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
  is_in_user_cards?: boolean;
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
    mutationFn: async (payload: { contentId: string; text: string; force_refresh?: boolean }) => {
      return fetchApi<ParseResponse>(`v1/dismantle/parse`, {
        method: "POST",
        body: JSON.stringify({
          text: payload.text,
          content_id: payload.contentId,
          force_refresh: payload.force_refresh,
        }),
      });
    },
  });
}
