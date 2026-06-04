import { createBrowserRouter, Outlet } from "react-router-dom";
import AuthBootstrap from "../providers/AuthBootstrap";
import ProtectedRoute from "./ProtectedRoute";
import { URL_ROUTES } from "../configs/url_routes";
import { RegisterPage } from "../features/auth/components/RegisterPage";
import { LoginPage } from "../features/auth/components/LoginPage";
import { UserProfilePage } from "../features/users/pages/UserProfilePage";
import { CheckEmailPage } from "../features/auth/components/CheckEmailPage";
import { VerifyEmailPage } from "../features/auth/components/VerifyEmailPage";
import { AppLayout } from "../shared/ui/layout/AppLayout";
import { MentorCoursesPage } from "../features/courses/pages/MentorCoursesPage";
import { AdminCoursesPage } from "../features/courses/pages/AdminCoursesPage";
import { TraineeCoursesPage } from "../features/courses/pages/TraineeCoursesPage";
import { DashboardPage } from "../features/dashboard/components/DashboardPage";
import ProtectedLoginRoute from "./ProtectedAuthRoute";
import { MentorAvailabilityPage } from "../features/mentor-availability/pages/MentorAvailabilityPage";
import FindMentorPage from "../features/users/pages/FindMentorPage";

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
        element:
          <ProtectedLoginRoute><LoginPage /></ProtectedLoginRoute>
      },
      {
        path: URL_ROUTES.REGISTER,
        element:
          <ProtectedLoginRoute><RegisterPage /></ProtectedLoginRoute>,
      },
      {
        path: URL_ROUTES.CHECK_EMAIL,
        element: <CheckEmailPage />
      },
      {
        path: URL_ROUTES.VERIFY_EMAIL,
        element: <VerifyEmailPage />
      },

      {
        element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
        children: [
          {
            path: URL_ROUTES.HOME,
            element: <DashboardPage />
          },
          {
            path: URL_ROUTES.PROFILE,
            element: <UserProfilePage />,
          },
          {
            path: URL_ROUTES.FIND_MENTOR,
            element: <ProtectedRoute allowedRoles={["Trainee"]}><FindMentorPage /></ProtectedRoute>,
          },
          {
            path: URL_ROUTES.MENTOR_COURSE,
            element: (
              <ProtectedRoute allowedRoles={["Mentor"]}><MentorCoursesPage /></ProtectedRoute>
            ),
          },
          {
            path: URL_ROUTES.MENTOR_AVAILABILITY,
            element: (
              <ProtectedRoute allowedRoles={["Mentor"]}><MentorAvailabilityPage /></ProtectedRoute>
            ),
          },
          {
            path: URL_ROUTES.All_COURSES,
            element: (
              <ProtectedRoute allowedRoles={["Admin"]}><AdminCoursesPage /></ProtectedRoute>
            ),
          },
          {
            path: URL_ROUTES.TRAINEE_COURSES,
            element: (
              <ProtectedRoute allowedRoles={["Trainee"]}><TraineeCoursesPage /></ProtectedRoute>
            ),
          },
        ]
      }
    ],
  }
]);