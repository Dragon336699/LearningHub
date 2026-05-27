import { ChevronLeft, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Experience } from "../../../types/experience";

export interface FormState {
  firstName: string;
  lastName: string;
  bio: string;
  skills: string;
  industryExperience: string;
  selectedExpertiseIds: string[];
  experiences: Experience[];
}

interface EditProfileModalProps {
  initialFormState: FormState;
  onCancel: () => void;
  onSave: (updatedForm: FormState) => void; // Bỏ tham số settings thừa
}

const expertiseDatabaseOptions = [
  { id: "4a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d", name: "Programming" },
  { id: "5b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e", name: "Design" },
  { id: "6c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f", name: "Leadership" },
  { id: "7d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a", name: "Data Science" },
  { id: "8e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b", name: "Project Management" },
  { id: "9f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c", name: "Marketing" },
  { id: "0a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d", name: "Business" },
  { id: "1b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e", name: "Communication" },
];

export const EditProfileModal = ({
  initialFormState,
  onCancel,
  onSave,
}: EditProfileModalProps) => {
  const [localForm, setLocalForm] = useState<FormState>({ ...initialFormState });
  const [nameInputValue, setNameInputValue] = useState("");

  useEffect(() => {
    const fName = initialFormState.firstName || "";
    const lName = initialFormState.lastName || "";
    setNameInputValue(lName ? `${fName} ${lName}` : fName);
  }, [initialFormState.firstName, initialFormState.lastName]);

  const updateField = (field: keyof FormState, value: any) => {
    setLocalForm((prev) => ({ ...prev, [field]: value }));
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
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-amber-400">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">100% Backend Connected</span>
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
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    value={nameInputValue}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === " ") return;
                      setNameInputValue(value);

                      if (value === "") {
                        setLocalForm((prev) => ({ ...prev, firstName: "", lastName: "" }));
                        return;
                      }

                      const firstSpaceIndex = value.indexOf(" ");
                      if (firstSpaceIndex === -1) {
                        setLocalForm((prev) => ({ ...prev, firstName: value, lastName: "" }));
                      } else {
                        const firstName = value.substring(0, firstSpaceIndex);
                        const lastName = value.substring(firstSpaceIndex + 1);
                        setLocalForm((prev) => ({ ...prev, firstName, lastName }));
                      }
                    }}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="Trương Trịnh Văn"
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

            <div>
              <label className="label text-xs font-semibold text-slate-300" htmlFor="industryExperience">
                Industry Experience <span className="text-blue-500 font-normal text-[11px] ml-1">[For Mentor]</span>
              </label>
              <input
                id="industryExperience"
                value={localForm.industryExperience}
                onChange={(event) => updateField("industryExperience", event.target.value)}
                className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                placeholder="e.g. 5 years in SE"
              />
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <p className="label text-xs font-semibold text-slate-300 mb-2">Areas of Expertise / Interest *</p>
            <div className="flex flex-wrap gap-2">
              {expertiseDatabaseOptions.map((option) => {
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
                    {option.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-900 pt-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn btn-outline border-slate-800 text-slate-300 rounded-xl text-sm w-full sm:w-auto">Cancel</button>
          <button type="button" onClick={() => onSave(localForm)} className="btn btn-primary bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm w-full sm:w-auto px-6">Save Changes</button>
        </div>

      </div>
    </div>
  );
};