import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { URL_ROUTES } from "../configs/url_routes";

interface Props {
  children: ReactNode;
}

export default function AuthBootstrap({ children }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      dispatch(clearUser());
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      dispatch(setUser(user));
    } catch (e) {
      dispatch(clearUser());
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return children;
}