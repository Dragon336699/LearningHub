import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/user.service";
import { User } from "../../types/user";

export const fetchUserById = createAsyncThunk<User, string>(
  "user/fetchById",
  async (id: string) => {
    return await userService.getById(id);
  }
);

