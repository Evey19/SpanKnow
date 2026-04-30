import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface UserPreferences {
  font_family?: string;
  font_size?: string;
  dark_mode?: boolean;
  review_reminders?: boolean;
}

// 更新用户偏好设置
export function useUpdatePreferencesMutation() {
  return useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token found");
      }
      // Note: Backend requires a PUT request with nested "preferences" object
      const response = await fetchApi<any>("v1/auth/preferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences }),
      });
      return response.data;
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "保存偏好设置失败";
      toast.error(message);
    },
  });
}
