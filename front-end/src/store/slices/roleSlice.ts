import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "../../types/role";
import { fetchRoles } from "../thunks/roleThunks";

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.loading = false;
        console.log("roles:", action.payload)
        state.roles = action.payload; 
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;