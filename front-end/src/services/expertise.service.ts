import { HttpClient } from "../lib/client";

export interface ExpertiseResponse {
  id: string;
  expertiseName: string;
}

interface ApiResult<T> {
  isSuccess: boolean;
  data: T;
  errors: string[] | null;
}

export const expertiseService = {
  getAll: async () => {
    const response = await HttpClient.get<ApiResult<ExpertiseResponse[]>>("/expertise");
    
    // Bóc tách trả về duy nhất mảng data sạch bên trong nếu thành công
    if (response?.isSuccess) {
      return response.data;
    }
    
    throw new Error("Backend result returned failure status"); 
  }
};