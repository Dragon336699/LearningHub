import { AxiosRequestConfig } from "axios";
import { http } from "./axios";

export class HttpClient {
  static get<T>(url: string, config?: AxiosRequestConfig) {
    return http.get<T>(url, config).then(res => res.data);
  }

  static post<T>(url: string, body: any) {
    return http.post<T>(url, body).then(res => res.data);
  }

  static put<T>(url: string, body: any) {
    return http.put<T>(url, body).then(res => res.data);
  }

  static delete<T>(url: string) {
    return http.delete<T>(url).then(res => res.data);
  }
}