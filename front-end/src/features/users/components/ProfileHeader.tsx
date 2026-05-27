import { Calendar, Clock, CreditCard, Star } from "lucide-react";
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
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary">
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${fullName}`}
            alt={fullName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">{fullName}</h1>
          <p className="text-sm text-slate-400">{currentTitle}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current opacity-50" />
            </div>
            <span className="font-medium text-slate-200">4.9</span>
            <span className="text-slate-400">(27 reviews)</span>
          </div>

          {/* Meta tags */}
          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Mon, Tue, Wed, Thu
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> 10+ years
            </span>
            <span className="flex items-center gap-1.5 text-green-400">
              <CreditCard className="h-3.5 w-3.5" /> ${user.coachCost} / hour
            </span>
          </div>

          {/* Expertises */}
          {user.expertises && user.expertises.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-xs text-slate-400">Areas of Expertise</span>
              <div className="flex flex-wrap gap-2">
                {user.expertises.map((exp) => (
                  <span key={exp.id} className="badge bg-secondary text-secondary-foreground">
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