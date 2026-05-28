import { ChevronLeft } from "lucide-react";
import { Experience } from "../../../types/experience";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserById, updateUserProfile } from "../../../store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { ProfileHeader } from "../components/ProfileHeader";
import { EditProfileModal } from "../components/EditProfileModal";
import { FormState } from "../types";

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  console.log("=== THỰC THỂ USER TỪ API STORE ===", user);

  const loading = useAppSelector((state) => state.user.loading);
  const { id } = useParams();

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
      selectedExpertiseIds: user.expertises?.map((e) => e.id) || (user as any).Expertises?.map((e: any) => e.Id) || [], 
      experiences: user.experiences || (user as any).Experiences || [],
    });
  };

  useEffect(() => {
    if (id) dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!user) return;
    resetFormState();
  }, [user]);

  const handleCancel = () => {
    resetFormState();
    setIsEditOpen(false);
  };

  const handleSaveModal = (updatedForm: FormState) => {
    if (!user) return;

    // Format Experiences according to UpdateExperienceCommand DTO
    const commandExperiences = updatedForm.experiences.length > 0
      ? updatedForm.experiences.map((exp) => ({
          id: exp.id ? exp.id : null, 
          title: exp.title,
          description: exp.description || "Updated via Web Profile Portal",
          startDate: exp.startDate ? new Date(exp.startDate).toISOString() : new Date().toISOString(),
          endDate: exp.endDate ? new Date(exp.endDate).toISOString() : new Date().toISOString()
        }))
      : [];

    // API Payload
    const apiPayload = {
      userAvatar: null, 
      firstName: updatedForm.firstName,
      lastName: updatedForm.lastName,
      coachCost: user.coachCost || 0,
      bio: updatedForm.bio,
      skills: updatedForm.skills,
      expertises: updatedForm.selectedExpertiseIds,
      experiences: commandExperiences
    };

    console.log("=== [TEST PACKET] HTTP PUT /user/profile ===");
    console.log("Body Request Object:", apiPayload);

    dispatch(updateUserProfile({ id: id || "", payload: apiPayload }));

    setFormState(updatedForm);
    setIsEditOpen(false);
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>Loading user profile...</p>
      </div>
    );
  }

  const fName = user.firstName || (user as any).FirstName || "";
  const lName = user.lastName || (user as any).LastName || "";
  const fullName = `${fName} ${lName}`.trim();
  const currentTitle = user.experiences?.length > 0 
    ? user.experiences[0].title 
    : ((user as any).Experiences?.length > 0 ? (user as any).Experiences[0].Title : "Expert");

  return (
    <div className="main-content min-h-screen bg-background text-foreground">
      <div className="mb-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ChevronLeft className="h-4 w-4" /> Back to Browse
        </button>
      </div>

      <ProfileHeader
        user={user}
        fullName={fullName}
        currentTitle={currentTitle}
        onOpenEdit={() => setIsEditOpen(true)}
      />


      <div className="flex flex-col gap-8 mt-6">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">About {fullName}</h2>
          <p className="text-sm text-slate-300 leading-relaxed bg-card p-5 rounded-2xl border border-border">
            {user.bio || "My bio"}
          </p>
        </section>

        <section>
            <h2 className="text-lg font-bold text-white mb-4">Experience</h2>
            <div className="flex flex-col gap-3">
              {formState.experiences && formState.experiences.length > 0 ? (
                formState.experiences.map((exp, idx) => {
                  const formatTimelineDate = (dateStr: string | null | undefined, isEnd = false) => {
                    if (!dateStr) return isEnd ? "Present" : "";
                    const d = new Date(dateStr);
                    if (Number.isNaN(d.getTime())) return isEnd ? "Present" : "";
                    if (isEnd && d.getFullYear() >= 2026) return "Present";
                    return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                  };
                  return (
                    <div key={exp.id || idx} className="flex items-center justify-between rounded-xl bg-card p-5 border border-border">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{exp.title}</span>
                        <span className="text-sm text-slate-400">{exp.description || "Tech Company"}</span>
                      </div>
                      <div className="text-sm text-slate-400 font-medium shrink-0">
                        {formatTimelineDate(exp.startDate)} - {formatTimelineDate(exp.endDate, true)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 italic">No experience records found.</p>
              )}
            </div>
          </section>
      </div>

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