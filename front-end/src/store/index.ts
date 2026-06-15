import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import roleReducer from "./slices/roleSlice";
import sessionReducer from "./slices/sessionSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    role: roleReducer,
    session: sessionReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;