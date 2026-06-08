import React from "react";
import { Link } from "react-router-dom";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 selection:bg-orange-500/30">
      <div className="card w-full max-w-2xl slide-up p-8 border border-border bg-card text-slate-300">
        
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Privacy Policy
          </h2>
          <p className="text-xs text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="space-y-5 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <section>
            <h3 className="text-base font-semibold text-white mb-2">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us when creating an account, such as your email address, password hash, and the role you choose (Mentor or Trainee).
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">2. How We Use Your Information</h3>
            <p>
              Your data is utilized to facilitate mentorship sessions, personalize your profile layout, manage roles, and communicate updates or safety alerts regarding your sessions.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">3. Information Sharing</h3>
            <p>
              We do not sell your personal data. To enable the core scheduling functions, your display name and role will be visible to other registered users when booking or conducting mentoring sessions.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">4. Data Retention and Security</h3>
            <p>
              We store your data securely and use industry-standard encryption practices to safeguard your credentials. You can request account deletion at any time via your profile settings.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">5. Cookies and Analytics</h3>
            <p>
              We use necessary local storage or sessions to maintain your logged-in state and preferences. No invasive tracking third-party cookies are deployed without your consent.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-xs">
          <span className="text-slate-500">Your privacy matters to us.</span>
          <Link 
            to="/register" 
            className="font-semibold text-orange-400 hover:text-orange-300 hover:underline transition-colors duration-150"
          >
            Back to Register
          </Link>
        </div>

      </div>
    </div>
  );
};