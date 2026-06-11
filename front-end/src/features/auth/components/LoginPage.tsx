import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { loginUser } from "../../../store/thunks/authThunks";
import { clearAuthMessages } from "../../../store/slices/authSlice";
import { URL_ROUTES } from "../../../configs/url_routes";
import { loginSchema } from "../schemas/LoginSchema";

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message || null;
  const initialEmail = location.state?.email || "";

  const { loading: authLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: initialEmail,
    password: "",
  });

  const [localValidationError, setLocalValidationError] = useState<
    string | null
  >(null);

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localValidationError) setLocalValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = loginSchema.safeParse({
      ...formData,
    });

    if (!validationResult.success) {
      const firstErrorMessage = validationResult.error.issues[0].message;
      setLocalValidationError(firstErrorMessage);
      return;
    }

    setLocalValidationError(null);

    try {
      await dispatch(loginUser(formData)).unwrap();
      dispatch(clearAuthMessages());

      navigate("/");
    } catch (err) {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 selection:bg-orange-500/30">
      <div className="card w-full max-w-md slide-up p-8 border border-border bg-card">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Sign in to continue to your account
          </p>
        </div>

        {successMessage && !error && !localValidationError && (
          <div className="mb-4 text-xs font-medium text-green-400 border border-green-500/20 bg-green-500/10 p-3 rounded-xl fade-in">
             {successMessage}
          </div>
        )}

        {localValidationError && (
          <div className="mb-4 text-xs font-medium text-red-400 border border-red-500/20 bg-red-500/10 p-3 rounded-xl fade-in">
             {localValidationError}
          </div>
        )}

        {error && (
          <div className="mb-4 text-xs font-medium text-red-400 border border-red-500/20 bg-red-500/10 p-3 rounded-xl fade-in">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={authLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="label mb-0">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-orange-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              disabled={authLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-11 mt-2 text-sm font-semibold tracking-wide shadow-lg shadow-orange-500/10"
            disabled={authLoading}
          >
            {authLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{" "}
          <Link
            to={URL_ROUTES.REGISTER}
            className="font-semibold text-orange-400 hover:text-orange-300 hover:underline transition-colors duration-150"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
