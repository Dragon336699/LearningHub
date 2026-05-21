import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { URL_ROUTES } from "../configs/url_routes";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }:Props) {
  const user = useSelector((state: any) => state.user.user);

  if (!user) {
    return <Navigate to={URL_ROUTES.LOGIN} replace />;
  }

  return children;
}