import { ChevronLeft } from "lucide-react";
import { User } from "../../../types/user";
import { Experience } from "../../../types/experience";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../../../store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateUser } from "../../../store/slices/userSlice";
import { ProfileHeader } from "../components/ProfileHeader";
import { EditProfileModal, FormState } from "../components/EditProfileModal";

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("About");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
    industryExperience: "",
    selectedExpertiseIds: [] as string[], 
    experiences: [] as Experience[],
  });

  const getRandomId = () => {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);
  };

  const resetFormState = () => {
    if (!user) return;
    setFormState({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      bio: user.bio || "", 
      skills: user.skills || "",
      industryExperience: user.experiences?.[0]?.title || "",
      selectedExpertiseIds: user.expertises?.map((e) => e.id) || [], 
      experiences: user.experiences || [],
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

    // Chuẩn hóa mảng Experiences theo đúng UpdateExperienceCommand DTO
    const commandExperiences = updatedForm.experiences.length > 0
      ? updatedForm.experiences.map((exp, index) => ({
          id: exp.id,
          title: index === 0 ? (updatedForm.industryExperience || exp.title) : exp.title,
          description: exp.description || "Updated via Web Portal",
          startDate: exp.startDate,
          endDate: exp.endDate
        }))
      : [{
          id: undefined, 
          title: updatedForm.industryExperience || "Industry Experience",
          description: "Auto-generated placeholder context block",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        }];

    // API Payload
    const apiPayload = {
      userAvatar: null, 
      firstName: updatedForm.firstName,
      lastName: updatedForm.lastName,
      coachCost: user.coachCost,
      bio: updatedForm.bio,
      skills: updatedForm.skills,
      expertises: updatedForm.selectedExpertiseIds, // Gửi List<Guid> chuẩn chỉ
      experiences: commandExperiences
    };

    console.log("=== [TEST PACKET] HTTP PUT /user/profile ===");
    console.log("Body Request Object:", apiPayload);

    // Kích hoạt cập nhật thông qua Redux Store
    dispatch(updateUser({ 
      ...user, 
      firstName: updatedForm.firstName, 
      lastName: updatedForm.lastName, 
      bio: updatedForm.bio, 
      skills: updatedForm.skills,
      experiences: commandExperiences as any // Tránh xung đột kiểu dữ liệu tạm thời
    }));

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

  const currentTitle = formState.industryExperience || "Expert";
  const fullName = `${formState.firstName} ${formState.lastName || ""}`.trim();

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

      <div className="mb-6 flex gap-6 border-b border-border">
        {["About", "Experience", "Testimonials", "Availability"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-slate-400 hover:text-slate-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 mt-6">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">About {fullName}</h2>
          <p className="text-sm text-slate-300 leading-relaxed bg-card p-5 rounded-2xl border border-border">
            {formState.bio || "This professional hasn't written a bio description yet."}
          </p>
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