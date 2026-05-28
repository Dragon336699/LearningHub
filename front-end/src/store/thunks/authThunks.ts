import { HttpClient } from "../../lib/client";
import { API_ROUTES } from "../../configs/api_routes";
import { LoginResponse } from "../../types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { Result } from "../../types/result";


export const registerUser = createAsyncThunk<string, any, { rejectValue: string }>(
  "auth/register",
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post<Result<string>>(`${API_ROUTES.AUTH.REGISTER}`, registerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Login failed");
    }
  }
);

export const verifyOtp = createAsyncThunk<string, { email: string; otpCode: string }, { rejectValue: string }>(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post<Result<string>>(`${API_ROUTES.AUTH.VERIFY_OTP}`, otpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Verify");
    }
  }
);

export const resendOtp = createAsyncThunk<string, string, { rejectValue: string }>(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post<Result<string>>(`${API_ROUTES.AUTH.RESEND_OTP}`, { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Resend failed");
    }
  }
);

export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post<Result<LoginResponse>>(`${API_ROUTES.AUTH.LOGIN}`, loginData);
      
      const profileResponse = await HttpClient.get<Result<User>>(`${API_ROUTES.USER.PROFILE}?testUserId=${response.data.userId}`);
      
      return profileResponse.data; 
    } catch (error: any) {
      return rejectWithValue(error || "Login failed");
    }
  }
);

export const refreshUserToken = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      await HttpClient.post(`${API_ROUTES.AUTH.REFRESH_TOKEN}`,{});
    }  catch (error: any) {
      return rejectWithValue(error || "Refresh failed");
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await HttpClient.post(`${API_ROUTES.AUTH.LOGOUT}`, {});
    } catch (error: any) {
      return rejectWithValue(error || "Logout failed");
    }
  }
);