import { createSlice } from '@reduxjs/toolkit';
import { createBookingSession, fetchAvailableSlots, fetchUserSessions } from '../thunks/sessionThunk';
import { AvailableSlotsResponse, SessionResponse } from '../../types/session';

interface BookingState {
  slots: AvailableSlotsResponse[];
  sessions: SessionResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  slots: [],
  sessions: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload; 
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createBookingSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingSession.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(createBookingSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched sessions:", action.payload);
        state.sessions = action.payload; 
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bookingSlice.reducer;