import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface UpdateContentPayload {
  title?: string;
  content?: string;
  tags?: string[];
}

export function useUpdateContentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateContentPayload) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<{ message: string; data: any }>(`v1/user/contents/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("更新成功");
      // 更新该条内容的详情缓存
      queryClient.setQueryData(["content", id], data);
      // 刷新列表缓存
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "更新失败");
    },
  });
}
