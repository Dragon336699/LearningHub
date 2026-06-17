import { API_ROUTES } from "../configs/api_routes";
import { HttpClient } from "../lib/client";
import { DashboardFilterParams, DashboardSummary, ZenQuote } from "../types/dashboard";

export const dashboardService = {
  getDashboardSummary: async (params: DashboardFilterParams): Promise<DashboardSummary[]> => {
    try {
      const response = await HttpClient.get<DashboardSummary[]>(API_ROUTES.DASHBOARD.SUMMARY, { params });
      return response;
    } catch (error) {
      console.error("Error when calling API getDashboardSummary:", error);
      throw error;
    }
  },

  getDailyQuote: async (): Promise<ZenQuote> => {
    try {
      const response = await HttpClient.get<ZenQuote>(API_ROUTES.DASHBOARD.DAILY_QUOTE);
      return response;
    } catch (error) {
      console.error("Error when calling API getDailyQuote:", error);
      throw error;
    }
  }
};