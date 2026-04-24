import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface CreateContentPayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateContentResponse {
  message: string;
  data: {
    id: string;
    title: string;
    content: string;
    tags: string[];
  };
}

export function useCreateContent() {
  return useMutation({
    mutationFn: async (payload: CreateContentPayload) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<CreateContentResponse>("v1/user/contents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("添加成功");
      // TODO: Invalidate content list query when implemented
      // queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "添加失败");
    },
  });
}
