import { API_ROUTES } from "../configs/api_routes";
import { http } from "../lib/axios";
import { HttpClient } from "../lib/client";
import { User } from "../types/user";

export const userService = {
  getById: (id: string) => {
    return HttpClient.get<User>(`${API_ROUTES.USER.PROFILE}?testUserId=${id}`);
  },
  
  getAll: () => {
    return HttpClient.get<User[]>(API_ROUTES.USER.GET_ALL); 
  },
};