import { HttpClient } from "../lib/client";

export interface ExpertiseResponse {
  id: string;
  expertiseName: string;
}

export const expertiseService = {
  getAll: () => {
    return HttpClient.get<ExpertiseResponse[]>("/user/expertises"); 
  }
};