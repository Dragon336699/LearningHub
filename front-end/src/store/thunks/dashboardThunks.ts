// src/redux/thunks/dashboardThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpClient } from "../../lib/client";
import { API_ROUTES } from "../../configs/api_routes";
import { DashboardSummary, DashboardFilterParams } from "../../types/dashboard";

export const fetchDashboardSummary = createAsyncThunk<DashboardSummary[], DashboardFilterParams, { rejectValue: string }>(
  "dashboard/fetchSummary",
  async (params, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get<DashboardSummary[]>(API_ROUTES.DASHBOARD.SUMMARY, { params });
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Get dashboard summary failed");
    }
  }
);