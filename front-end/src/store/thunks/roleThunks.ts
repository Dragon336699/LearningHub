import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpClient } from "../../lib/client";
import { API_ROUTES } from "../../configs/api_routes";
import { Role } from "../../types/role";
import { Result } from "../../types/result";

export const fetchRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  "role/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get<Result<Role[]>>(`${API_ROUTES.ROLES.ALL}`);
      return response.data;
      
    } catch (error: any) {
      return rejectWithValue(error || "Get role failed");
    }
  }
);