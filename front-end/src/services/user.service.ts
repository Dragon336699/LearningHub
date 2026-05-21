import { http } from "../lib/axios";
import { HttpClient } from "../lib/client";

export const userService = {
  getById: (id: string) => {
    HttpClient.get(`/users/${id}`)
  },
  getAll: () =>{
    HttpClient.get(`/users`)
    },
};