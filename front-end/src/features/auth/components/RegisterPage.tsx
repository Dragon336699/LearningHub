import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod"; // 1. Import Zod
import { AppDispatch, RootState } from "../../../store";
import { registerUser } from "../../../store/thunks/authThunks";
import { fetchRoles } from "../../../store/thunks/roleThunks"; 
import { clearAuthMessages } from "../../../store/slices/authSlice";
import { CustomSelect } from "../../../components/common/CustomSelect";
import { API_ROUTES } from "../../../configs/api_routes";
import { URL_ROUTES } from "../../../configs/url_routes";
import { registerSchema } from "../types";

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading: authLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const { roles, loading: rolesLoading } = useSelector(
    (state: RootState) => state.role
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    roleName: "", 
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localValidationError, setLocalValidationError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthMessages());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (roles.length > 0 && !formData.roleName) {
      setFormData((prev) => ({ ...prev, roleName: roles[0].name }));
    }
  }, [roles, formData.roleName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localValidationError) setLocalValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = registerSchema.safeParse({
      ...formData,
      agreeTerms,
    });

    if (!validationResult.success) {
      const firstErrorMessage = validationResult.error.issues[0].message;
      setLocalValidationError(firstErrorMessage);
      return;
    }

    setLocalValidationError(null);
    
    try {
      await dispatch(registerUser(formData)).unwrap();
      dispatch(clearAuthMessages());
      navigate(`${URL_ROUTES.CHECK_EMAIL}`, { state: { email: formData.email } });
    } catch (err) {
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 selection:bg-orange-500/30">
      <div className="card w-full max-w-md slide-up p-8 border border-border bg-card">
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create Your Account
          </h2>
        </div>

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
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              disabled={authLoading}
            />
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Password must be at least 8 characters with a mix of letters, numbers, and symbols.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={authLoading}
            />
          </div>

          <div>
            <label htmlFor="roleId" className="label">
              I want to join as
            </label>
            <CustomSelect
                options={roles}                             
                value={formData.roleName}                   
                placeholder="I want to join as..."
                getLabel={(role) => role.name}             
                getValue={(role) => role.name}               
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, roleName: value }));
                  if (localValidationError) setLocalValidationError(null);
                }}
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="flex h-5 items-center">
              <input
                id="agreeTerms"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-input text-primary accent-orange-500 focus:ring-primary focus:ring-offset-0"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (localValidationError) setLocalValidationError(null);
                }}
                disabled={authLoading}
              />
            </div>
            <label htmlFor="agreeTerms" className="text-xs leading-normal text-slate-300 select-none">
              I agree to the{" "}
              <Link to="/terms" className="text-orange-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-orange-400 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-11 mt-2 text-sm font-semibold tracking-wide shadow-lg shadow-orange-500/10"
            disabled={authLoading || rolesLoading}
          >
            {authLoading ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </div>
            ) : (
              "Continue to Profile Setup"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline transition-colors duration-150">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};