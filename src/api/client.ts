const API_BASE_URL = "/api";

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
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return `${url.pathname}${url.search}`;
}

export async function fetchApi<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { query, headers, ...restConfig } = config;
  const response = await fetch(buildUrl(endpoint, query), {
    ...restConfig,
    headers: {
      "Content-Type": "application/json",
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
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
