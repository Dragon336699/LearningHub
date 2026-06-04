import { API_ROUTES } from "../configs/api_routes";
import { HttpClient } from "../lib/client";
import { PagedResult } from "../shared/types/pagedResult";
import { Result } from "../types/result";
import { User } from "../types/user";

export const userService = {
  // GET: /user/profile?userId={id}
  getById: (id: string) => {
    return HttpClient.get<User>(`${API_ROUTES.USER.PROFILE}?userId=${id}`);
  },
  
  // GET: /user/admin/users (for Admin management)
  getAll: (page: number, pageSize: number, keyword?: string) => {
    return HttpClient.get<Result<PagedResult<User>>>(`${API_ROUTES.USER.ADMIN_GET_ALL}?page=${page}&pageSize=${pageSize}${keyword ? `&keyword=${keyword}` : ''}`); 
  },

  // POST: /user/profile/status?userId={id}
  changeUserStatus: (userId: string, targetStatus: number) => {
    return HttpClient.post<any>(`${API_ROUTES.USER.UPDATE}/status?userId=${userId}`, {
      userStatus: targetStatus
    });
  },

  // PUT: /user/profile
  updateProfile: (id: string, payload: any) => {
    return HttpClient.put<User>(`${API_ROUTES.USER.UPDATE}`, payload);
  },

  // POST: /user/profile/avatar
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("AvatarFile", file);
    
    return HttpClient.post<{ isSuccess: boolean; data: { avatarUrl: string } }>(
      `${API_ROUTES.USER.UPDATE}/avatar`, 
      formData
    );
  },

};