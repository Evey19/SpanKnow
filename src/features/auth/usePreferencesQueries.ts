import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface UserPreferences {
  font_family?: string;
  font_size?: string;
  dark_mode?: boolean;
  review_reminders?: boolean;
}

export interface UserResponse {
  message: string;
  data: {
    id?: string;
    phone?: string;
    preferences?: UserPreferences;
  };
}

// 获取当前用户信息及偏好设置
export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetchApi<UserResponse>("v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    // 如果没有 token 则不发送请求
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
  });
}

// 更新用户偏好设置
export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetchApi<any>("v1/auth/preferences", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // 乐观更新缓存中的用户偏好设置
      queryClient.setQueryData<UserResponse["data"]>(["currentUser"], (old) => {
        if (!old) return old;
        return {
          ...old,
          preferences: {
            ...old.preferences,
            ...variables,
          },
        };
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "保存偏好设置失败");
    },
  });
}
