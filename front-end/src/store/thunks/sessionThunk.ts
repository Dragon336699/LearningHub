import { createAsyncThunk } from "@reduxjs/toolkit";
import { AvailableSlotsRequest, AvailableSlotsResponse, CreateBookingSessionRequest, GetSessionsRequest, SessionResponse } from "../../types/session";
import { Result } from "../../types/result";
import { HttpClient } from "../../lib/client";
import { API_ROUTES } from "../../configs/api_routes";

export const createBookingSession = createAsyncThunk<any, CreateBookingSessionRequest, { rejectValue: string }>(
  "booking/createSession",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post<Result<any>>(API_ROUTES.SESSIONS.DEFAULT, payload);
      
      if (!response.isSuccess) {
        return rejectWithValue(response.errors?.[0] || "Failed to create booking session");
      }
      
      return response.data;
    } catch (error: any) {
        console.log("Error creating booking session:", error);
      return rejectWithValue(error || "Connection failed");
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk<
  AvailableSlotsResponse[],
  AvailableSlotsRequest,  
  { rejectValue: string }  
>(
  "session/getAvailableSlots",
  async (requestData, { rejectWithValue }) => {
    
    try {
        const response = await HttpClient.get<Result<AvailableSlotsResponse[]>>(API_ROUTES.SESSIONS.AVAILABLE_SLOTS, { params: requestData });
        if (!response.isSuccess) {
          return rejectWithValue(response.errors?.[0] || "Failed to fetch available slots");
        }
        return response.data;
      }
    catch (error: any) {
        return rejectWithValue(error || "Connection failed");
    }
  }
);

export const fetchUserSessions = createAsyncThunk<
  SessionResponse[],
  GetSessionsRequest,
  { rejectValue: string }
>(
  "session/fetchUserSessions",
  async ({ userId, date, sessionStatus }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get<any>(API_ROUTES.SESSIONS.DEFAULT, {
        params: { UserId: userId, Date: date, Status: sessionStatus }
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Connection failed");
    }
  }
);

// Thunk Approve Session
export const approveSession = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "session/approveSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await HttpClient.put<Result<any>>(`${API_ROUTES.SESSIONS.APPROVE}/${sessionId}`,{});
      if (!response.isSuccess) {
        return rejectWithValue(response.errors?.[0] || "Failed to approve session");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Connection failed");
    }
  }
);

// Thunk Cancel Session
export const cancelSession = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "session/cancelSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await HttpClient.put<Result<any>>(`${API_ROUTES.SESSIONS.CANCEL}/${sessionId}`,{});
      if (!response.isSuccess) {
        return rejectWithValue(response.errors?.[0] || "Failed to cancel session");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Connection failed");
    }
  }
);
     