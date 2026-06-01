import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { URL_ROUTES } from "../configs/url_routes";
import { useAppSelector } from "../store/hooks";

interface Props {
  allowedRoles?: string[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const user = useAppSelector((state: any) => state.auth.currentUser);

  const role = user?.roleName;
  
  if (!user) {
    return <Navigate to={URL_ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to={URL_ROUTES.LOGIN} replace />;
  }

  return children;
}