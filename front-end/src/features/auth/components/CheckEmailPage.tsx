import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { resendVerify } from "../../../store/thunks/authThunks";
import { URL_ROUTES } from "../../../configs/url_routes";

export const CheckEmailPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading: authLoading, error } = useSelector((state: RootState) => state.auth);
  
  const email = location.state?.email;

  const handleResend = async () => {
    try {
      await dispatch(resendVerify( email )).unwrap();
      alert("Verification link has been sent to your email!");
    } catch (err) {
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card w-full max-w-md p-8 border border-border bg-card text-center">
        <div className="mb-4 text-4xl">📧</div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-slate-400 text-sm mb-6">
          We've sent a verification link to <strong>{email}</strong>. Please click the link to verify your account and continue.
        </p>

        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

        <button
          onClick={handleResend}
          disabled={authLoading}
          className="btn btn-outline w-full mb-4"
        >
          {authLoading ? "Sending..." : "Resend Verification Email"}
        </button>

        <button 
          onClick={() => navigate(URL_ROUTES.LOGIN)}
          className="text-sm text-orange-400 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};