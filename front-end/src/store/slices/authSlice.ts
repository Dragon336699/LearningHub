import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { loginUser, logoutUser, registerUser, verifyOtp, refreshUserToken } from "../thunks/authThunks";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null; 
}

const savedUser = localStorage.getItem("user");
const initialUser = savedUser ? JSON.parse(savedUser) : null;

const initialState: AuthState = {
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.currentUser) return;
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.currentUser));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state)=> {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload; 
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload)); 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("user"); 
      })
      .addCase(logoutUser.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })

      .addCase(refreshUserToken.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      });
  },
});

export const { clearAuthMessages, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;