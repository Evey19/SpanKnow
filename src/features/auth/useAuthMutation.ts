import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";
import { toast } from "sonner";

export interface AuthPayload {
  phone: string;
  password: string;
  isLogin: boolean;
}

function buildApiUrl(endpoint: string) {
  const base = import.meta.env.VITE_API_BASE_URL || "/api";
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = base.startsWith("http")
    ? new URL(`${base}${normalized}`)
    : new URL(`${base}${normalized}`, window.location.origin);
  return base.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`;
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
          // If avatar_url exists, ensure we map it to avatar as well for compatibility with old UI components
          if (data.user.avatar_url && !data.user.avatar) {
            data.user.avatar = data.user.avatar_url;
          }
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

export function useAvatarMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("未登录");
      
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(buildApiUrl("v1/auth/avatar"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        let message = "上传头像失败";
        try {
          const payload = await response.json();
          if (payload && typeof payload.message === "string") message = payload.message;
        } catch {}
        throw new Error(message);
      }
      
      return response.json() as Promise<{ avatar_url: string }>;
    },
    onSuccess: (data) => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          user.avatar = data.avatar_url;
          user.avatar_url = data.avatar_url;
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {}
      }
      toast.success("头像上传成功");
    },
    onError: (error: any) => {
      toast.error(error.message || "头像上传失败");
    }
  });
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  level: number;
  experience_points: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      return fetchApi<any>("v1/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      toast.success("已退出登录");
      
      const baseUrl = import.meta.env.BASE_URL || "/";
      const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      window.location.href = `${base}#/auth`;
    },
    onError: () => {
      // 即使请求失败，也清空本地数据并跳转
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      const baseUrl = import.meta.env.BASE_URL || "/";
      const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      window.location.href = `${base}#/auth`;
    },
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: async (payload: { username?: string; bio?: string }) => {
      return fetchApi<UserProfile>("v1/auth/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (profile) => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const next = {
            ...user,
            id: profile.id,
            username: profile.username,
            bio: profile.bio,
            avatar: profile.avatar_url,
            avatar_url: profile.avatar_url,
          };
          localStorage.setItem("user", JSON.stringify(next));
        } catch {}
      }
      toast.success("资料已更新");
    },
    onError: (error: any) => {
      toast.error(error.message || "更新失败");
    },
  });
}
