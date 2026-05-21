import { createBrowserRouter, Outlet } from "react-router-dom";
import AuthBootstrap from "../providers/AuthBootstrap";
import { UserProfilePage } from "../features/users/components/UserProfilePage";
import ProtectedRoute from "./ProtectedRoute"; 
import { URL_ROUTES } from "../configs/url_routes";

export const router = createBrowserRouter([
  {
    element: (
      <AuthBootstrap>
        <Outlet /> 
      </AuthBootstrap>
    ),
    children: [
      {
        path: "/profile/:id",
        element: (
          // <ProtectedRoute>
            <UserProfilePage />
          // </ProtectedRoute>
        ),
      },
      // {
      //   path: "/",
      //   element: <ProtectedRoute><Home /></ProtectedRoute>,
      // },
      // {
      //   path: URL_ROUTES.LOGIN,
      //   element: <Login />,
      // }
    ],
  },
]);