import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchUserById,
  updateUserProfile,
} from "../../../store/thunks/userThunks";
import { Experience } from "../../../types/experience";
import { FormState } from "../types";
import { EditProfileModal } from "../components/EditProfileModal";
import { AvatarUploadModal } from "../components/AvatarUploadModal";
import { Certificate } from "../../../types/certificate";
import { updateAvatarSuccess } from "../../../store/slices/userSlice";
import { userService } from "../../../services/user.service";
import { certificateService } from "../../../services/certificate.service";
import { BookSessionModal } from "../../sessions/components/BookingSessionModal";
import { ConfirmModal } from "../../../shared/ui/components/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faAward, faBriefcase, faCalendar, faCamera, faChevronLeft, faDollarSign, faExclamationCircle, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";

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
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [liveAvatar, setLiveAvatar] = useState("");

  const [uiFeedback, setUiFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [certificateFiles, setCertificateFiles] = useState<Record<string | number, File>>({});

  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    avatarUrl: "",
    coachCost: 0,
    roleName: "",
    bio: "",
    skills: "",
    selectedExpertiseIds: [] as string[],
    experiences: [] as Experience[],
    certificates: [] as Certificate[],
  });

  const resetFormState = () => {
    if (!user) return;
    setFormState({
      firstName: user.firstName || (user as any).FirstName || "",
      lastName: user.lastName || (user as any).LastName || "",
      avatarUrl: user.avatarUrl || (user as any).AvatarUrl || "",
      coachCost: user.coachCost || (user as any).CoachCost || 0,
      roleName: user.roleName || (user as any).RoleName || "",
      bio: user.bio || (user as any).Bio || "",
      skills: user.skills || (user as any).Skills || "",
      selectedExpertiseIds:
        user.expertises?.map((e) => e.id) ||
        (user as any).Expertises?.map((e: any) => e.Id) ||
        [],
      experiences: user.experiences || (user as any).Experiences || [],
      certificates: user.certificates || (user as any).Certificates || [],
    });
    setLiveAvatar(user.avatarUrl || "");
  };

  useEffect(() => {
    if (id) dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) resetFormState();
  }, [user]);

  useEffect(() => {
    if (user) {
      setLiveAvatar(user.avatarUrl || "");
    }
  }, [user?.avatarUrl, user]);

  useEffect(() => {
    if (!uiFeedback) return;
    const timer = setTimeout(() => {
      setUiFeedback(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [uiFeedback]);

  const handleRefresh = () => {
    if (id) dispatch(fetchUserById(id));
  };

  const handleCancel = () => {
    resetFormState();
    setIsEditOpen(false);
  };

  const handleAvatarSuccess = (newAvatarUrl: string) => {
    setFormState((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
    setLiveAvatar(newAvatarUrl);
    dispatch(updateAvatarSuccess(newAvatarUrl));
  }

  const handleSaveModal = async (updatedForm: FormState, filesMap: Record<string | number, File>) => {
    if (!user) return;

    try {
      setUiFeedback(null);

      // Handle certificate deletions first before any profile updates to avoid foreign key conflicts in DB
      const originalCertIds = user.certificates?.map(c => c.id) || [];
      const currentCertIds = new Set((updatedForm.certificates || []).map(c => c.id));
      const deletedCertIds = originalCertIds.filter(certId => !currentCertIds.has(certId));

      if (deletedCertIds.length > 0) {
        const deletePromises = deletedCertIds.map(certId => certificateService.delete(certId)); 
        await Promise.all(deletePromises);
      }

      // Profile and Experience updates
      const commandExperiences =
        updatedForm.experiences.length > 0
          ? updatedForm.experiences.map((exp) => ({
              id: exp.id ? exp.id : null,
              title: exp.title,
              description: exp.description || "Updated via Web Profile Portal",
              startDate: exp.startDate ? new Date(exp.startDate).toISOString() : new Date().toISOString(),
              endDate: exp.endDate ? new Date(exp.endDate).toISOString() : new Date().toISOString(),
            }))
          : [];

      const apiPayload = {
        userAvatar: updatedForm.avatarUrl || null,
        firstName: updatedForm.firstName,
        lastName: updatedForm.lastName,
        coachCost: Number(updatedForm.coachCost) || 0,
        bio: updatedForm.bio,
        skills: updatedForm.skills,
        expertises: updatedForm.selectedExpertiseIds,
        experiences: commandExperiences,
        currentCertificateIds: Array.from(currentCertIds),
      };

      await dispatch(updateUserProfile({ id: id || "", payload: apiPayload })).unwrap();

      // Certificates update
      if (updatedForm.certificates && updatedForm.certificates.length > 0) {
  
        const certPromises = updatedForm.certificates.map((cert, index) => {
          const formData = new FormData();
          formData.append("CertificateName", cert.certificateName.trim());
          formData.append("Organization", cert.organization.trim());
          formData.append("IssueDate", cert.issueDate ? cert.issueDate.split("T")[0] : "");
          
          if (cert.expirationDate) {
            formData.append("ExpirationDate", cert.expirationDate.split("T")[0]);
          }

          const fileKey = cert.id ? cert.id : index;
          const attachedFile = certificateFiles[fileKey];
          if (attachedFile) {
            formData.append("CredentialFile", attachedFile);
          }

          if (cert.id) {
            formData.append("Id", cert.id);
            return certificateService.update(formData); 
          } else {
            return certificateService.create(formData); 
          }
        });

        await Promise.all(certPromises);
      }

      // Transaction successful
      setFormState(updatedForm);
      setIsEditOpen(false);
      
      // Refresh page
      handleRefresh(); 
      setUiFeedback({ type: "success", msg: "Profile information and professional certificates saved successfully!" });

    } catch (err: any) {
      console.error("Double API synchronization failed:", err);
      const serverMsg = err?.response?.data?.errors?.[0] || err?.message || "Unknown communication error.";
      setUiFeedback({ type: "error", msg: `Failed to save changes: ${serverMsg}` });
    }
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

  const currentUserRole = String(currentUser?.roleName || (currentUser as any)?.RoleName || "").toLowerCase();
  const currentIsAdmin = currentUserRole === "admin";
  const currentIsMentor = currentUserRole === "mentor";

  const profileUserRole = String(user?.roleName || (user as any)?.RoleName || "").toLowerCase();
  const profileIsMentor = profileUserRole === "mentor";
  const profileIsTrainee = profileUserRole === "trainee";

  const canEditProfile = isCurrentUser || (currentIsAdmin && (profileIsMentor || profileIsTrainee));

  const canViewCoachCost = profileIsMentor && (currentIsAdmin || currentIsMentor);

  const handleToggleUserStatus = async () => {
    setIsStatusModalOpen(true);
  };

  const handleExecuteStatusChange = async () => {
    if (!user || !id) return;

    const rawStatus = String(user.status ?? (user as any).Status ?? "").toLowerCase();    
    const isActive = rawStatus === "active" || rawStatus === "0";    
    const targetStatusNumber = isActive ? 1 : 0; 
    const targetStatusText = isActive ? "deactivate" : "activate";

    try {
      setUiFeedback(null);
      await userService.changeUserStatus(id, targetStatusNumber);
      handleRefresh(); 
      setUiFeedback({ type: "success", msg: `Successfully ${targetStatusText}d user account.` });
    } catch (err: any) {
      const extractMsg = err.response?.data?.errors?.[0] || err.message || "Unknown error";
      setUiFeedback({ type: "error", msg: `Failed to update user status: ${extractMsg}` });
    } finally {
      setIsStatusModalOpen(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-200">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="h-5 w-5 animate-spin text-orange-500" 
          />
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const currentTitle =
    user.experiences?.length > 0 ? user.experiences[0].title : "";
  const avatarUrl =
    liveAvatar || user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=f97316&color=fff`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <main className="container mx-auto p-4">
        {/* UI Feedback */}
        {uiFeedback && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold 
            animate-in fade-in slide-in-from-top-2 duration-300 transition-all ${
            uiFeedback.type === "success" 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            <FontAwesomeIcon icon={faExclamationCircle} className="h-4 w-4 shrink-0" />
            <p className="flex-grow">{uiFeedback.msg}</p>
            <button 
              type="button" 
              onClick={() => setUiFeedback(null)} 
              className="text-gray-400 hover:text-white text-sm pl-2 select-none focus:outline-none"
            >
              ✕
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* Navigation Bar */}
          <nav className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4 mr-1" />
                Back
              </button>
            </div>
          </nav>

          {/* Profile Header Card */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row mb-8 gap-6">
              {/* Avatar */}
              <button 
                type="button"
                disabled={!canEditProfile}
                onClick={() => canEditProfile && setIsAvatarPopupOpen(true)}
                className={`group relative w-32 h-32 shrink-0 rounded-full border-4 border-orange-500 overflow-hidden bg-gray-900 flex items-center justify-center text-3xl font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${canEditProfile ? "cursor-pointer" : "cursor-default"}`}
                aria-label="Change profile avatar"
              >
                {liveAvatar || user.avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <span>{(user.firstName || "U").charAt(0)}</span>
                )}

                {canEditProfile && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 select-none">
                    <FontAwesomeIcon icon={faCamera} className="h-5 w-5 text-white" />
                    <span className="text-[10px] font-bold text-gray-200 uppercase">Change</span>
                  </div>
                )}
              </button>

              {/* Details */}
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Full Name Display */}
                      <h2 className="text-2xl font-bold text-white">
                        {fullName}
                      </h2>

                      {/* Role Display */}
                      {user.roleName && (
                        <span className="bg-gray-700 text-gray-300 border border-gray-600 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                          {user.roleName}
                        </span>
                      )}

                      {/* Status Display */}
                      <span className={`font-bold px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wider ${
                        (Number(user.status) === 0 || String(user.status).toLowerCase() === "active")
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {(Number(user.status) === 0 || String(user.status).toLowerCase() === "active") ? "● Active" : "● Deactivated"}
                      </span>
                    </div>

                    <p className="text-gray-400 text-lg mt-1">{currentTitle}</p>

                    {/* {canViewCoachCost && ( */}
                      <div className="flex items-center space-x-6 mt-4">
                        <div className="flex items-center text-gray-300">
                          <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 mr-1 text-green-400" />
                          <span className="font-medium">
                            {user.coachCost && user.coachCost > 0 ? `$${user.coachCost} / hour` : "Free Mentorship"}
                          </span>
                        </div>
                      </div>
                    {/* )} */}
                    
                  </div>

                  <div className="mt-6 md:mt-0 flex gap-3">
                    
                    {!isCurrentUser && profileIsMentor && (
                      <button 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium transition duration-200 shadow-lg shadow-orange-500/20"
                      onClick={() => setIsBookModalOpen(true)}>
                        Book a Session
                      </button>
                    )}

                    {!isCurrentUser && (
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-md font-medium transition duration-200 border border-gray-600">
                        Message
                      </button>
                    )}

                    {canEditProfile && isCurrentUser && (
                      <button
                        onClick={() => setIsEditOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Edit Profile
                      </button>
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
              Experiences
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
              
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                <h4 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-orange-500" /> About {fullName}
                </h4>
                {user.bio || "No bio provided yet."}
              </div>

              {user.skills && (
                <div className="mt-6 bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faAward} className="h-5 w-5 text-orange-500" /> Professional Skills
                  </h4>
                  <p className="text-gray-300">{user.skills}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab Experience */}
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
                        <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5 text-orange-500" />{" "}
                        {exp.title}
                      </h4>
                      <p className="text-gray-400 mt-2">
                        {exp.description || "No description provided."}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-400 flex items-center gap-2 shrink-0 sm:items-start">
                      <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
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

          {/* Tab Certificates */}
          {activeTab === "certificates" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="mb-3 font-semibold text-white text-xl">Certificates</h3>
              </div>        
              
              {/* Display certificates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.certificates && user.certificates.length > 0 ? (
                  user.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col justify-between relative group hover:border-gray-600 transition-all duration-200"
                    >
                      {/* General View for all accounts */}
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
                            className="text-xs text-blue-400 hover:underline flex items-center gap-1 transition-colors"
                          >
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-4 w-4" /> <span>View Credential</span> 
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

      {/* Avatar Upload Modal */}
      {isAvatarPopupOpen && (
        <AvatarUploadModal
          userId={id || ""}
          currentAvatar={avatarUrl}
          userLetter={(user.firstName || "U").charAt(0)}
          onClose={() => setIsAvatarPopupOpen(false)}
          onSuccess={handleAvatarSuccess}
        />
      )}

      {isBookModalOpen && (
        <BookSessionModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          mentorId={id || ""}
          traineeId={currentUser?.id || ""}
        />
      )}
      
    
      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && (
        <ConfirmModal
          title={String(user?.status).toLowerCase() === "active" || String(user?.status).toLowerCase() === "0" ? "Are you sure you want to deactivate this user?" : "Are you sure you want to activate this user?"}
          description={`Do you want to change the platform status operation for ${fullName}? This process will alter their platform rights.`}
          onCancel={() => setIsStatusModalOpen(false)}
          onConfirm={handleExecuteStatusChange}
        />
      )}
    </div>
  );
};
