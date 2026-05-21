import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import { URL_ROUTES } from "../configs/url_routes";
import { UserProfilePage } from "../features/users/components/UserProfilePage";

export default function Router() {
  return (
    <Routes>
      {/* <Route path={URL_ROUTES.LOGIN} element={<Login />} /> */}

      {/* <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}