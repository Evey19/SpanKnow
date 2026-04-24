import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useDeleteContentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("请先登录");
      }

      const response = await fetchApi<{ message: string; data: any }>(`v1/user/contents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    onSuccess: (_, deletedId) => {
      toast.success("删除成功");
      // 移除被删除条目的详情缓存
      queryClient.removeQueries({ queryKey: ["content", deletedId] });
      // 刷新列表缓存
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      // 返回首页/列表页
      navigate("/");
    },
    onError: (error: any) => {
      if (error.message === "请先登录") {
        navigate("/auth");
      } else {
        toast.error(error.message || "删除失败");
      }
    },
  });
}
