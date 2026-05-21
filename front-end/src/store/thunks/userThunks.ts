import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/user.service";

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id: string) => {
    return await userService.getById(id);
  }
);