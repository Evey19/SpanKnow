import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export type ContentStatus = "draft" | "published";

export interface ContentListItem {
  id: string;
  title: string;
  tags: string[];
  status: ContentStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentListResponse {
  data: ContentListItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface ContentListParams {
  page?: number;
  page_size?: number;
  status?: ContentStatus;
  keyword?: string;
  tag?: string;
  tags?: string[];
}

export function useContentsQuery(params: ContentListParams) {
  return useQuery({
    queryKey: ["contents", params],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<ContentListResponse>("v1/user/contents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          page: params.page,
          page_size: params.page_size,
          status: params.status,
          keyword: params.keyword || undefined,
          tag: params.tag || undefined,
          tags:
            params.tags && params.tags.length > 0 ? params.tags.join(",") : undefined,
        },
      });

      return response;
    },
  });
}

