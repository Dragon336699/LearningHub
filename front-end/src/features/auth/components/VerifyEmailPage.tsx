import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { verifyEmail } from "../../../store/thunks/authThunks";
import { URL_ROUTES } from "../../../configs/url_routes";

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      dispatch(verifyEmail({ email, token }));
    }
  }, [searchParams, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card w-full max-w-sm p-8 border border-border bg-card text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mb-4" />
            <h2 className="text-xl font-bold text-white">Verifying...</h2>
            <p className="text-slate-400 mt-2">Please wait while we confirm your email.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-400">Verification Failed</h2>
            <p className="text-slate-400 mt-2 mb-6">{error}</p>
            <Link to={URL_ROUTES.REGISTER} className="btn btn-primary w-full">
              Back to Register
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-white">Verified Successfully!</h2>
            <p className="text-slate-400 mt-2 mb-6">{"Your email has been confirmed."}</p>
            <Link to={URL_ROUTES.LOGIN} className="btn btn-primary w-full">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};