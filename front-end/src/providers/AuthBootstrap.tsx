import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { refreshUserToken } from "../store/thunks/authThunks";

interface Props {
  children: ReactNode;
}

export default function AuthBootstrap({ children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    if (!currentUser) return;

    const TEN_MINUTES = 10 * 60 * 1000; 
    console.log("[AuthBootstrap] ⏱️ Refresh Token interval triggered");

    const intervalId = setInterval(() => {
      console.log("[AuthBootstrap] Refreshing token");
      
      dispatch(refreshUserToken())
        .unwrap()
        .catch((error) => {
          console.error("[AuthBootstrap] Refresh Token failed", error);
        });
    }, TEN_MINUTES);

    return () => {
      console.log("[AuthBootstrap] Discard refresh token interval");
      clearInterval(intervalId);
    };
  }, [currentUser, dispatch]);

  return <>{children}</>;
}