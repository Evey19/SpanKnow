import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export interface ReviewCard {
  id: string;
  user_id: string;
  content_id: string;
  card_id: string;
  knowledge_content: string;
  status: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewDueResponse {
  message: string;
  data: {
    total_due: number;
    new: number;
    learning: number;
    review: number;
    cards: ReviewCard[];
  };
}

export function useReviewDueQuery() {
  return useQuery({
    queryKey: ["review", "due"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<ReviewDueResponse>("v1/review/due", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
}
