import { Briefcase, Calendar, Clock, Code, CreditCard, Star } from "lucide-react";
import { User } from "../../../types/user";

interface ProfileHeaderProps {
  user: User;
  fullName: string;
  currentTitle: string;
  onOpenEdit: () => void;
}

export const ProfileHeader = ({ user, fullName, currentTitle, onOpenEdit }: ProfileHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-slate-900 flex items-center justify-center text-white text-3xl font-bold">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{(user.firstName || "U").charAt(0)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">{fullName}</h1>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-slate-500" />
            {currentTitle || "IT"}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-4 string text-xs">
            {/* COACH COST */}
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <CreditCard className="h-3.5 w-3.5" /> 
              {user.coachCost && user.coachCost > 0 ? `$${user.coachCost} / hour` : "Free Mentorship"}
            </span>
            
            {/* Skillset (if available) */}
            {user.skills && (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-slate-500" />
                Skills: <span className="text-slate-300 font-medium">{user.skills}</span>
              </span>
            )}
          </div>

          {/* Expertises */}
          {user.expertises && user.expertises.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expertise Areas</span>
              <div className="flex flex-wrap gap-1.5">
                {user.expertises.map((exp) => (
                  <span 
                    key={exp.id} 
                    className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-medium text-orange-400 shadow-sm"
                  >
                    {exp.expertiseName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full gap-3 sm:w-auto">
        <button className="btn btn-primary flex-1 sm:flex-none">
          Book a Session
        </button>
        <button className="btn btn-secondary flex-1 sm:flex-none">
          Message
        </button>
        <button className="btn btn-outline text-sm" onClick={onOpenEdit}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};