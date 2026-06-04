import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/user.service";
import { SearchUserProfileCommand, User } from "../../types/user";
import { HttpClient } from "../../lib/client";
import { API_ROUTES } from "../../configs/api_routes";
import { Result } from "../../types/result";
import { Expertise } from "../../types/expertise";
import { PagedResult } from "../../shared/types/pagedResult";

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
      const response: any = await userService.updateProfile(id, payload);
      
      if (response?.isSuccess === false) {
        return rejectWithValue(response.errors || ["Update failed"]);
      }
      
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || ["Connection failed"]);
    }
  }
);

export const fetchExpertises = createAsyncThunk<Expertise[], void, { rejectValue: string }>(
  "user/fetchExpertises",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get<Result<Expertise[]>>(`${API_ROUTES.USER.EXPERTISE}` );
      
      if (!response.isSuccess) {
        return rejectWithValue(response.errors?.[0] || "Find expertises failed");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.errors || "Find expertises failed");
    }
  }
);

export const searchMentors = createAsyncThunk<User[], SearchUserProfileCommand, { rejectValue: string }>(
  "user/searchMentors",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.keyword) {
        queryParams.append("Keyword", params.keyword);
      }
      
      if (params.expertiseIds && params.expertiseIds.length > 0) {
        params.expertiseIds.forEach(id => queryParams.append("ExpertiseIds", id));
      }

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${API_ROUTES.USER.PROFILE}/filter?${queryString}` 
        : `${API_ROUTES.USER.PROFILE}/filter`;

      const response = await HttpClient.get<Result<User[]>>(endpoint);

      if (!response.isSuccess) {
         return rejectWithValue(response.errors?.[0] || "Find mentors failed");
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || "Find mentors failed");
    }
  }
);

export const fetchAllUsersForAdmin = createAsyncThunk(
  "user/fetchAllUsersForAdmin",
  async ({page, pageSize, keyword}: {page: number, pageSize: number, keyword?: string}, { rejectWithValue }) => {
    try {
      const response = await userService.getAll(page, pageSize, keyword);
      return (response as Result<PagedResult<User>>).data ?? response; 
    } catch (err: any) {
      console.error("Fetch admin list error:", err);
      return rejectWithValue(err.response?.data?.errors?.[0] || err.message || "Forbidden Access");
    }
  }
);