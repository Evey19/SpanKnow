import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/api/client";

export interface DashboardAccuracyPoint {
  date: string;
  accuracy: number;
  total: number;
  correct: number;
}

export interface DashboardStats {
  total_learning_days: number;
  today_review_count: number;
  today_time_spent_ms: number;
  yesterday_time_spent_ms: number;
  today_accuracy_percent: number;
  accuracy_chart_7_days: DashboardAccuracyPoint[];
}

export interface DashboardResponse {
  message: string;
  data: DashboardStats;
}

export function useDashboardQuery() {
  return useQuery({
    queryKey: ["progressDashboard"],
    queryFn: async () => {
      return fetchApi<DashboardResponse>("v1/progress/dashboard");
    },
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 60 * 1000,
  });
}

