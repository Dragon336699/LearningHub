import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { verifyOtp, resendOtp } from "../../../store/thunks/authThunks";
import { clearAuthMessages } from "../../../store/slices/authSlice";
import { URL_ROUTES } from "../../../configs/url_routes";

export const VerifyOtpPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const { loading: authLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [countdown, setCountdown] = useState<number>(60);
  const [localValidationError, setLocalValidationError] = useState<string | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (!email) {
      navigate(URL_ROUTES.REGISTER);
    }
    dispatch(clearAuthMessages());
  }, [email, navigate, dispatch]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (localValidationError) setLocalValidationError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (target: HTMLInputElement, index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; 

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus(); 
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLocalValidationError(null);

    try {
      await dispatch(resendOtp(email)).unwrap();
      setCountdown(60); 
      setOtp(new Array(6).fill("")); 
      inputRefs.current[0]?.focus();
    } catch (err: any) {
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtpCode = otp.join("");

    if (fullOtpCode.length < 6) {
      setLocalValidationError("Please enter 6 numbers.");
      return;
    }

    setLocalValidationError(null);

    try {
      await dispatch(verifyOtp({ email, otpCode: fullOtpCode })).unwrap();
      dispatch(clearAuthMessages());
      
      navigate(URL_ROUTES.LOGIN);
    } catch (err) {
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 selection:bg-orange-500/30">
      <div className="card w-full max-w-md slide-up p-8 border border-border bg-card">
        
        <div className="mb-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            We sent an OTP to email: <br />
            <span className="font-semibold text-slate-200">{email}</span>
          </p>
        </div>

        {localValidationError && (
          <div className="mb-4 mt-4 text-xs font-medium text-red-400 border border-red-500/20 bg-red-500/10 p-3 rounded-xl fade-in">
             {localValidationError}
          </div>
        )}

        {error && (
          <div className="mb-4 mt-4 text-xs font-medium text-red-400 border border-red-500/20 bg-red-500/10 p-3 rounded-xl fade-in">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                disabled={authLoading}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e.currentTarget, index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-12 rounded-xl border border-border bg-input text-center text-lg font-bold text-white outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
              />
            ))}
          </div>

          <div className="text-center text-xs">
            <span className="text-slate-400">Didn't receive the code? </span>
            {countdown > 0 ? (
              <span className="font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
                Resend in <strong className="text-orange-400 font-mono">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer transition-colors"
              >
                Resend Code
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-11 text-sm font-semibold tracking-wide shadow-lg shadow-orange-500/10"
            disabled={authLoading}
          >
            {authLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify & Activate"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <Link to={URL_ROUTES.REGISTER} className="font-medium text-slate-400 hover:text-white hover:underline transition-colors duration-150">
            Back to Registration
          </Link>
        </div>

      </div>
    </div>
  );
};