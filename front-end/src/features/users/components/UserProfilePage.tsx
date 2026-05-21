import { 
  ChevronLeft, 
  Star, 
  Calendar, 
  Clock, 
  CreditCard,
  MessageSquare
} from "lucide-react";
// Import RootState từ file store của bạn
// import { RootState } from "../../store"; 
import { User } from "../../../types/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../../../store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const { id } = useParams();


  const [activeTab, setActiveTab] = useState("About");

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>Loading user profile...</p>
      </div>
    );
  }

  const currentTitle = user.experiences?.length > 0 
    ? user.experiences[0].title 
    : "Chuyên gia";

  const fullName = `${user.firstName} ${user.lastName || ""}`.trim();

  return (
    <div className="main-content min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Back to Browse
        </button>
        <div className="flex gap-3">
          <button className="btn btn-outline text-sm">Share Profile</button>
          <button className="btn btn-outline text-sm">Save</button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary">
            <img
              src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + fullName}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">{fullName}</h1>
            <p className="text-sm text-slate-400">{currentTitle}</p>
            
            {/* Rating (Mocked UI) */}
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
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-border">
        {["About", "Experience", "Testimonials", "Availability"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: ABOUT & EXPERIENCE combined to match UI context */}
      <div className="flex flex-col gap-8">
        {/* ABOUT SECTION */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">About {fullName}</h2>
          <p className="mb-6 text-sm text-slate-300 leading-relaxed">
            {user.description || 
              "This user has not provided a description yet. They are a highly skilled professional ready to help you achieve your goals."}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Mentorship Style (Mocked) */}
            <div className="stats-card">
              <h3 className="mb-3 font-semibold text-white">Mentorship Style</h3>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Practical, hands-on learning approach
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Focus on real-world projects and examples
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Personalized guidance based on individual goals
                </li>
              </ul>
            </div>

            {/* Languages (Mocked) */}
            <div className="stats-card">
              <h3 className="mb-3 font-semibold text-white">Languages</h3>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  English (Native)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Spanish (Conversational)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section>
          <h2 className="mb-2 text-lg font-bold text-white">Experience</h2>
          <p className="mb-4 text-xs text-slate-400 uppercase tracking-wider">Work History</p>
          
          <div className="flex flex-col gap-3">
            {user.experiences && user.experiences.length > 0 ? (
              user.experiences.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between rounded-xl bg-card p-5 border border-border">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{exp.title}</span>
                    {/* Giả sử description lưu tên công ty như thiết kế */}
                    <span className="text-sm text-slate-400">{exp.description || "Tech Company"}</span> 
                  </div>
                  <div className="text-sm text-slate-400">
                    {/* Format date dựa theo cấu trúc ngày của bạn (ví dụ: YYYY hoặc YYYY - Present) */}
                    {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Chưa có thông tin kinh nghiệm làm việc.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}