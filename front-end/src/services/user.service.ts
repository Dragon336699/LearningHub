import { API_ROUTES } from "../configs/api_routes";
import { HttpClient } from "../lib/client";
import { User } from "../types/user";

export const userService = {
  // GET: /user/profile?userId={id}
  getById: (id: string) => {
    return HttpClient.get<User>(`${API_ROUTES.USER.PROFILE}?userId=${id}`);
  },
  
  getAll: () => {
    return HttpClient.get<User[]>(API_ROUTES.USER.GET_ALL); 
  },

  // POST: /user/profile/status?userId={id}
  changeUserStatus: (userId: string, targetStatus: number) => {
    return HttpClient.post<any>(`/user/profile/status?userId=${userId}`, {
      userStatus: targetStatus
    });
  },

  // PUT: /user/profile
  updateProfile: (id: string, payload: any) => {
    return HttpClient.put<User>(`/user/profile`, payload);
  },

  // POST: /user/profile/avatar
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("AvatarFile", file);
    
    return HttpClient.post<{ isSuccess: boolean; data: { avatarUrl: string } }>(
      `/user/profile/avatar`, 
      formData
    );
  }
};