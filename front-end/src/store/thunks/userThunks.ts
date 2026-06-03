import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/user.service";
import { User } from "../../types/user";
import { HttpClient } from "../../lib/client";
import { API_ROUTES } from "../../configs/api_routes";
import { Result } from "../../types/result";

export const fetchUserById = createAsyncThunk<User, string, { rejectValue: string }>(
  "user/fetchById",
  async (id: string, { rejectWithValue }) => {
    
    try {
          const response = await HttpClient.get<Result<User>>(`${API_ROUTES.USER.PROFILE}?userId=${id}`);
          return response.data;
          
        } catch (error: any) {
          return rejectWithValue(error || "Get user failed");
        }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfileApi",
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      // Backend returns Result<UserDto> with Ok(updateResult)
      const response: any = await userService.updateProfile(id, payload);
      
      if (response?.isSuccess === false) {
        return rejectWithValue(response.errors || ["Update failed"]);
      }
      
      return response.data || response; // Returns clean UserDto for ExtraReducer
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || ["Connection failed"]);
    }
  }
);

export const fetchAllUsersForAdmin = createAsyncThunk(
  "user/fetchAllUsersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAll();
      return (response as any).data ?? response; 
    } catch (err: any) {
      console.error("Fetch admin list error:", err);
      return rejectWithValue(err.response?.data?.errors?.[0] || err.message || "Forbidden Access");
    }
  }
);