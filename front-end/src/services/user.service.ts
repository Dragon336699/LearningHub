import { http } from "../lib/axios";
import { HttpClient } from "../lib/client";
import { User } from "../types/user";

export const userService = {
  getById: (id: string) => {
    return HttpClient.get<User>(`/users/${id}`)
  },
  getAll: () =>{
    HttpClient.get(`/users`)
    },
};