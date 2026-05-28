import { ChevronLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ExpertiseResponse, expertiseService } from "../../../services/expertise.service";
import { FormState } from "../types";
import { ExperienceFormList } from "./ExperienceFormList";

interface EditProfileModalProps {
  initialFormState: FormState;
  onCancel: () => void;
  onSave: (updatedForm: FormState) => void; // Bỏ tham số settings thừa
}

export const EditProfileModal = ({
  initialFormState,
  onCancel,
  onSave,
}: EditProfileModalProps) => {
  const [localForm, setLocalForm] = useState<FormState>({ ...initialFormState });

  const [expertises, setExpertises] = useState<ExpertiseResponse[]>([]);
  const [isLoadingExpertises, setIsLoadingExpertises] = useState(false);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);

  useEffect(() => {
    const loadExpertises = async () => {
      setIsLoadingExpertises(true);
      setExpertiseError(null);
      try {
        const data = await expertiseService.getAll();
        setExpertises(data);
      } catch (err: any) {
        setExpertiseError("Cannot fetch expertises.");
        console.error("Error fetching expertises:", err);
      } finally {
        setIsLoadingExpertises(false);
      }
    };

    loadExpertises();
  }, []);

  const updateField = (field: keyof FormState, value: any) => {
    setLocalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!localForm.firstName.trim()) {
      alert("First Name is required!");
      return;
    }
    onSave(localForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12">
      <div className="w-full max-w-4xl rounded-[28px] border border-border bg-slate-950 p-8 shadow-2xl shadow-black/50">
        
        {/* Modal Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-4">
          <div>
            <button type="button" onClick={onCancel} className="mb-2 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-2xl font-bold text-white">Edit Your Profile</h2>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 text-center h-[200px]">
                <div className="relative mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-slate-600 bg-slate-900 text-slate-500">
                  <span className="text-3xl font-bold">{(localForm.firstName || "U").charAt(0)}</span>
                </div>
                <p className="text-xs font-medium text-slate-300">Profile Photo</p>
                <p className="text-[10px] text-amber-500 mt-1">Managed via Avatar API</p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="firstName">First Name <span className="text-red-500 text-xs font-medium">*</span></label>
                  <input
                    id="firstName"
                    type="text"
                    value={localForm.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={localForm.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Skills */}
          <div className="grid gap-4">
            <div>
              <label className="label text-xs font-semibold text-slate-300" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={localForm.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="textarea w-full h-24 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="label text-xs font-semibold text-slate-300" htmlFor="skills">Professional Skills</label>
              <input
                id="skills"
                value={localForm.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                placeholder="React, .NET, C#"
              />
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <p className="label text-xs font-semibold text-slate-300 mb-2">Areas of Expertise <span className="text-red-500 text-xs font-medium">*</span></p>
            {isLoadingExpertises && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Loading expertise capabilities from database...</span>
              </div>
            )}

            {expertiseError && <p className="text-xs text-red-400 py-1">{expertiseError}</p>}

            <div className="flex flex-wrap gap-2">
              {!isLoadingExpertises && Array.isArray(expertises) && expertises.map((option) => {
                const selected = localForm.selectedExpertiseIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      const isSelected = localForm.selectedExpertiseIds.includes(option.id);
                      updateField(
                        "selectedExpertiseIds",
                        isSelected
                          ? localForm.selectedExpertiseIds.filter((id) => id !== option.id)
                          : [...localForm.selectedExpertiseIds, option.id]
                      );
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition ${selected ? "bg-primary text-white" : "bg-slate-900 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"}`}
                  >
                    {option.expertiseName}
                  </button>
                );
              })}
            </div>

          </div>
          
          {/* Experience */}
          <ExperienceFormList 
            experiences={localForm.experiences} 
            onChange={(updatedExperiences) => updateField("experiences", updatedExperiences)}
          />

          {/* Modal Actions */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-900 pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} className="btn btn-outline border-slate-800 text-slate-300 rounded-xl text-sm w-full sm:w-auto">Cancel</button>
            <button type="button" onClick={handleSubmit} className="btn btn-primary bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm w-full sm:w-auto px-6">Save Changes</button>
          </div>

        </div>
      </div>
    </div>
  );
};