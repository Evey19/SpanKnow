import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export interface ContentTagsResponse {
  message: string;
  data: string[];
}

export function useContentTagsQuery() {
  return useQuery({
    queryKey: ["content-tags"],
    queryFn: async () => {
      const response = await fetchApi<ContentTagsResponse>("v1/user/contents/tags", { method: "GET" });
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
}

