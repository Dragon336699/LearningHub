import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import roleReducer from "./slices/roleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    role: roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;