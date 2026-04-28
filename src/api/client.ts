// 根据环境变量决定 API 基础路径
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestConfig extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(endpoint: string, query?: RequestConfig["query"]) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // 如果 API_BASE_URL 是绝对路径（如 http 开头），则直接使用
  // 否则（如 /api）拼接当前域名
  const url = API_BASE_URL.startsWith("http") 
    ? new URL(`${API_BASE_URL}${normalizedEndpoint}`)
    : new URL(`${API_BASE_URL}${normalizedEndpoint}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return API_BASE_URL.startsWith("http")
    ? url.toString()
    : `${url.pathname}${url.search}`;
}

export async function fetchApi<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { query, headers, ...restConfig } = config;
  
  // 自动附加 token
  const token = localStorage.getItem("access_token");
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(endpoint, query), {
    ...restConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  if (!response.ok) {
    let message = `API error: ${response.status} ${response.statusText}`;
    try {
      const payload = await response.json();
      if (payload && typeof payload.message === "string") {
        message = payload.message;
      }
    } catch {}
    
    // 全局处理 401
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      const baseUrl = import.meta.env.BASE_URL || "/";
      const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      window.location.href = `${base}#/auth`;
    }
    
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
