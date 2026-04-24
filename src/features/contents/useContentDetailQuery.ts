import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export type ContentStatus = "draft" | "published";

export interface ContentDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  status: ContentStatus;
  published_at?: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_dismantled?: boolean;
}

export interface ContentDetailResponse {
  message: string;
  data: ContentDetail;
}

export function useContentDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["content", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<ContentDetailResponse>(`v1/user/contents/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
}

