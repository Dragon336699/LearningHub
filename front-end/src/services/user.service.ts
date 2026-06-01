import { API_ROUTES } from "../configs/api_routes";
import { HttpClient } from "../lib/client";
import { User } from "../types/user";

export const userService = {
  // GET: /user/profile?testUserId={id}
  getById: (id: string) => {
    return HttpClient.get<User>(`${API_ROUTES.USER.PROFILE}?testUserId=${id}`);
  },
  
  getAll: () => {
    return HttpClient.get<User[]>(API_ROUTES.USER.GET_ALL); 
  },

  // PUT: /user/profile?testUserId={id}
  updateProfile: (id: string, payload: any) => {
    return HttpClient.put<User>(`/user/profile?testUserId=${id}`, payload);
  },

  // POST: /user/profile/avatar?testUserId={id}
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("AvatarFile", file);
    
    return HttpClient.post<{ isSuccess: boolean; data: { avatarUrl: string } }>(
      `/user/profile/avatar?testUserId=${id}`, 
      formData
    );
  }
};