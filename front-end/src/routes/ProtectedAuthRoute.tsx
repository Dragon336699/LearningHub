import { URL_ROUTES } from "../configs/url_routes";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";

type ProtectedAuthRouteProps = {
    children: React.ReactNode;
}

export default function ProtectedAuthRoute({ children }: ProtectedAuthRouteProps) {
    const user = useAppSelector((state: any) => state.auth.currentUser);

    if (user) {
        return <Navigate to={URL_ROUTES.HOME} replace />;
    } else {
        return children;
    }
}