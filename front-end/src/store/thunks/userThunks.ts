import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/user.service";
import { User } from "../../types/user";

export const fetchUserById = createAsyncThunk<User, string>(
  "user/fetchById",
  async (id: string) => {
    return await userService.getById(id);
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