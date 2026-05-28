import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  DollarSign,
  Award,
  Briefcase,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchUserById,
  updateUserProfile,
} from "../../../store/thunks/userThunks";
import { Experience } from "../../../types/experience";
import { FormState } from "../types";
import { EditProfileModal } from "../components/EditProfileModal";

type TabType = "about" | "experience" | "certificates";

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = useAppSelector((state) => state.user.profileUser);
  const loading = useAppSelector((state) => state.user.loading);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
    selectedExpertiseIds: [] as string[],
    experiences: [] as Experience[],
  });

  const resetFormState = () => {
    if (!user) return;
    setFormState({
      firstName: user.firstName || (user as any).FirstName || "",
      lastName: user.lastName || (user as any).LastName || "",
      bio: user.bio || (user as any).Bio || "",
      skills: user.skills || (user as any).Skills || "",
      selectedExpertiseIds:
        user.expertises?.map((e) => e.id) ||
        (user as any).Expertises?.map((e: any) => e.Id) ||
        [],
      experiences: user.experiences || (user as any).Experiences || [],
    });
  };

  useEffect(() => {
    if (id) dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) resetFormState();
  }, [user]);

  const handleCancel = () => {
    resetFormState();
    setIsEditOpen(false);
  };

  const handleSaveModal = (updatedForm: FormState) => {
    if (!user) return;

    const commandExperiences =
      updatedForm.experiences.length > 0
        ? updatedForm.experiences.map((exp) => ({
            id: exp.id ? exp.id : null,
            title: exp.title,
            description: exp.description || "Updated via Web Profile Portal",
            startDate: exp.startDate
              ? new Date(exp.startDate).toISOString()
              : new Date().toISOString(),
            endDate: exp.endDate
              ? new Date(exp.endDate).toISOString()
              : new Date().toISOString(),
          }))
        : [];

    const apiPayload = {
      userAvatar: null,
      firstName: updatedForm.firstName,
      lastName: updatedForm.lastName,
      coachCost: user.coachCost || 0,
      bio: updatedForm.bio,
      skills: updatedForm.skills,
      expertises: updatedForm.selectedExpertiseIds,
      experiences: commandExperiences,
    };

    dispatch(updateUserProfile({ id: id || "", payload: apiPayload }));

    setFormState(updatedForm);
    setIsEditOpen(false);
  };

  const formatTimelineDate = (
    dateStr: string | null | undefined,
    isEnd = false,
  ) => {
    if (!dateStr) return isEnd ? "Present" : "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return isEnd ? "Present" : "";
    if (isEnd && d.getFullYear() >= 2026) return "Present";
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const isCurrentUser = user?.id == currentUser?.id;
  const isMentor = user?.roleName==='Mentor';

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 animate-spin text-orange-500"
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
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const currentTitle =
    user.experiences?.length > 0 ? user.experiences[0].title : "Expert";
  const avatarUrl =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=f97316&color=fff`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold">Mentor Profile</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* Navigation Bar */}
          <nav className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Browse
              </button>
            </div>
          </nav>

          {/* Profile Header Card */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row mb-8 gap-6">
              <div className="flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {fullName}
                    </h2>
                    <p className="text-gray-400 text-lg mt-1">{currentTitle}</p>

                    <div className="flex items-center space-x-6 mt-4">
                      <div className="flex items-center text-gray-300">
                        <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                        <span className="font-medium">
                          ${user.coachCost} / hour
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 flex gap-3">
                    {!isCurrentUser && isMentor &&(
                      <>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium transition duration-200 shadow-lg shadow-orange-500/20">
                      Book a Session
                    </button>
                    
                      </>
                    )}
                    {!isCurrentUser &&(
                      <>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-md font-medium transition duration-200 border border-gray-600">
                      Message
                    </button>
                      </>
                    )}
                    {isCurrentUser&&(
                      <>
                      <button
                      onClick={() => setIsEditOpen(true)}
                      className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Edit Profile
                    </button>
                      </>
                    )}
                  </div>
                </div>

                {user.expertises && user.expertises.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                      Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.expertises.map((exp) => (
                        <span
                          key={exp.id}
                          className="bg-gray-700/50 border border-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm"
                        >
                          {exp.expertiseName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-8 mb-6 border-b border-gray-800">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "about" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-200"}`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "experience" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-200"}`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "certificates" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-200"}`}
            >
              Certificates
            </button>
          </nav>
        </div>

        {/* Tabs Content */}
        <div className="mb-12">
          {activeTab === "about" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">
                About {fullName}
              </h3>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 leading-relaxed text-gray-300 whitespace-pre-wrap">
                {user.bio || "No bio provided yet."}
              </div>

              {user.skills && (
                <div className="mt-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-500" /> Additional
                    Skills
                  </h4>
                  <p className="text-gray-300">{user.skills}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {user.experiences && user.experiences.length > 0 ? (
                user.experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-orange-500" />{" "}
                        {exp.title}
                      </h4>
                      <p className="text-gray-400 mt-2">
                        {exp.description || "No description provided."}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-400 flex items-center gap-2 shrink-0 sm:items-start">
                      <Calendar className="h-4 w-4" />
                      {formatTimelineDate(exp.startDate)} -{" "}
                      {formatTimelineDate(exp.endDate, true)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
                  <p className="text-gray-400 italic">
                    No experience records found.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {user.certificates && user.certificates.length > 0 ? (
                user.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {cert.certificateName}
                      </h4>
                      <p className="text-orange-400 font-medium text-sm mt-1">
                        {cert.organization}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-3">
                      <span className="text-xs text-gray-400">
                        Issued: {formatTimelineDate(cert.issueDate)}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          View Credential ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
                  <p className="text-gray-400 italic">
                    No certificate records found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          initialFormState={formState}
          onCancel={handleCancel}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};
