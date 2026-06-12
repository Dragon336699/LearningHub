import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardSummary } from "../../types/dashboard";
import { fetchDashboardSummary } from "../thunks/dashboardThunks";

interface DashboardState {
  summaries: DashboardSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summaries: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardSummary[]>) => {
        state.loading = false;
        state.summaries = action.payload; 
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;