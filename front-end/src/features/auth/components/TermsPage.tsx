import React from "react";
import { Link } from "react-router-dom";

export const TermsPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 selection:bg-orange-500/30">
      <div className="card w-full max-w-2xl slide-up p-8 border border-border bg-card text-slate-300">
        
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Terms of Service
          </h2>
          <p className="text-xs text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="space-y-5 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <section>
            <h3 className="text-base font-semibold text-white mb-2">1. Acceptance of Terms</h3>
            <p>
              By creating an account or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">2. Account Responsibility</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">3. User Roles (Mentor & Trainee)</h3>
            <p>
              Users registering as <strong>Mentors</strong> agree to provide accurate expertise information. Users registering as <strong>Trainees</strong> agree to respect the mentors' schedule and commit to scheduled sessions. Abuse of scheduling or no-shows may result in account restriction.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">4. Prohibited Conduct</h3>
            <p>
              You agree not to misuse the platform, including uploading malicious code, harassing other users, or using the session system for spam or commercial advertisements outside the platform's intent.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">5. Limitation of Liability</h3>
            <p>
              Our platform acts as a connector between Mentors and Trainees. We are not liable for any direct or indirect damages resulting from behavior, scheduling conflicts, or quality of mentorship received during sessions.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-xs">
          <span className="text-slate-500">Please read carefully before continuing.</span>
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