import { createBrowserRouter, Outlet } from "react-router-dom";
import AuthBootstrap from "../providers/AuthBootstrap";
// import { UserProfilePage } from "../features/users/components/UserProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import { URL_ROUTES } from "../configs/url_routes";
// import CreateProfilePage from "../features/users/components/CreateProfilePage";
import { RegisterPage } from "../features/auth/components/RegisterPage";
import { VerifyOtpPage } from "../features/auth/components/VerifyOtpPage";
import { LoginPage } from "../features/auth/components/LoginPage";
import { UserProfilePage } from "../features/users/pages/UserProfilePage";
import { CheckEmailPage } from "../features/auth/components/CheckEmailPage";
import { VerifyEmailPage } from "../features/auth/components/VerifyEmailPage";
// import { DashboardPage } from "../features/dashboard/components/DashboardPage";

export const router = createBrowserRouter([
  {
    element: (
      <AuthBootstrap>
        <Outlet />
      </AuthBootstrap>
    ),
    children: [
      {
        path: URL_ROUTES.LOGIN,
        element:<LoginPage/>
      },
      {
        path: URL_ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: URL_ROUTES.CHECK_EMAIL,
        element: <CheckEmailPage />
      },
      {
        path: URL_ROUTES.VERIFY_EMAIL,
        element: < VerifyEmailPage />
      },

      {
        path: "/profile/:id",
        element: <UserProfilePage />,
      },
      // {
      //   path: URL_ROUTES.LOGIN,
      //   element: <Login />,
      // },

      {
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
            path:URL_ROUTES.HOME,
            // element:<DashboardPage/>
          },
          // {
          //   path: "profile/create",
          //   element: <CreateProfilePage />,
          // },
          // {
          //   path: "/profile/:id",
          //   element: <UserProfilePage />,
          // },
          // {
          //   path: "/",
          //   element: <Home />,
          // }
        ]
      }
    ],
  },
]);