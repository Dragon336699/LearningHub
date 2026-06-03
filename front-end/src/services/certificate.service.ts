import { HttpClient } from "../lib/client";
import { Certificate } from "../types/certificate";

interface ApiResult<T> {
  isSuccess: boolean;
  data: T;
  errors: string[] | null;
}

export const certificateService = {
  create: async (formData: FormData) => {
    return HttpClient.post<ApiResult<Certificate>>(`/certificate`, formData);
  },

  update: async (formData: FormData) => {
    return HttpClient.put<ApiResult<Certificate>>(`/certificate`, formData);
  },

  delete: async (certId: string) => {
    return HttpClient.delete<void>(`/certificate/${certId}`);
  }
};