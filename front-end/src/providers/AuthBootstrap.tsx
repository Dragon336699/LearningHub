import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface Props {
  children: ReactNode;
}

export default function AuthBootstrap({ children }: Props) {
  const dispatch = useDispatch();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (userRaw) {
      try {
        JSON.parse(userRaw);
      } catch (e) {
        localStorage.removeItem("user");
        
        window.location.reload(); 
      }
    }

    setIsValidating(false);
  }, [dispatch]);

  if (isValidating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}