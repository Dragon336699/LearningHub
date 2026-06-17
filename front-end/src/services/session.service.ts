import { API_ROUTES } from "../configs/api_routes";
import { HttpClient } from "../lib/client";
import { GetSessionsRequest, SessionResponse } from "../types/session";


export const sessionService = {

    getUserSessions: async ({ date, sessionStatus }: GetSessionsRequest): Promise<SessionResponse[]> => {
    try {
      const response = await HttpClient.get<any>(API_ROUTES.SESSIONS.DEFAULT, {
        params: { Date: date, Status: sessionStatus }
      });
      return response;
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw error;
    }
  },
}