import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { fetchUserById } from "../thunks/userThunks"; 

interface UserState {
  profileUser: User | null; 
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profileUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profileUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;      
        state.profileUser = action.payload; 
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;     
        state.error = action.payload as string || "Can not fetch user data";
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;