import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface AuthPayload {
  phone: string;
  password: string;
  isLogin: boolean;
}

export function useAuthMutation() {
  return useMutation({
    mutationFn: async ({ phone, password, isLogin }: AuthPayload) => {
      const endpoint = isLogin ? "v1/auth/login" : "v1/auth/register";
      return fetchApi<any>(endpoint, {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });
    },
    onSuccess: (data, variables) => {
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        toast.success(variables.isLogin ? "登录成功" : "注册成功");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "请求失败，请稍后重试");
    },
  });
}
