import { useState, useEffect } from "react";
import { ExpertiseResponse, expertiseService } from "../../../services/expertise.service";
import { FormState } from "../types";
import { ExperienceFormList } from "./ExperienceFormList";
import { CertificateFormList } from "./CertificateFormList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";

interface EditProfileModalProps {
  initialFormState: FormState;
  onCancel: () => void;
  onSave: (updatedForm: FormState, filesMap: Record<string | number, File>) => void; 
}

export const EditProfileModal = ({
  initialFormState,
  onCancel,
  onSave,
}: EditProfileModalProps) => {
  const [localForm, setLocalForm] = useState<FormState>({ ...initialFormState });

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [coachCostError, setCoachCostError] = useState<string | null>(null);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);

  const [expertises, setExpertises] = useState<ExpertiseResponse[]>([]);
  const [isLoadingExpertises, setIsLoadingExpertises] = useState(false);


  const [certificateFiles, setCertificateFiles] = useState<Record<string | number, File>>({});

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
    if (field === "firstName" && value.trim()) {
      setFirstNameError(null);
    }
  };

  const handleSubmit = () => {
    setFirstNameError(null);
    setLastNameError(null);
    setBioError(null);
    setSkillsError(null);
    setExpertiseError(null);
    setCoachCostError(null);

    console.log("Map file chuẩn bị gửi lên trang mẹ:", certificateFiles);

    if (!localForm.firstName.trim()) {
      setFirstNameError("First name is required.");
      const inputElement = document.getElementById("firstName") as HTMLInputElement | null;
      if (inputElement) {
        inputElement.focus();
      }
      return;
    }

    if (localForm.lastName && localForm.lastName.length > 50) {
      setFirstNameError("Last name must not exceed 50 characters.");
      return;
    }

    if (localForm.roleName === "Mentor" && localForm.selectedExpertiseIds.length === 0) {
      setExpertiseError("Please select at least one specialty capability.");
      return;
    }

    if (localForm.roleName === "Mentor" && (Number.isNaN(localForm.coachCost) || localForm.coachCost < 0)) {
      setCoachCostError("Coach cost must be a non-negative number.");
      const inputElement = document.getElementById("coachCost") as HTMLInputElement | null;
      if (inputElement) {
        inputElement.focus();
      }
      return;
    }

    if (localForm.experiences && localForm.experiences.length > 0) {
      for (let i = 0; i < localForm.experiences.length; i++) {
        const exp = localForm.experiences[i];
        if (!exp.title?.trim()) {
          setExpertiseError(`Experience #${i + 1} Title cannot be empty.`);
          return;
        }
      }
    }

    if (localForm.certificates && localForm.certificates.length > 0) {
      for (let i = 0; i < localForm.certificates.length; i++) {
        const cert = localForm.certificates[i];
        if (!cert.certificateName?.trim()) {
          setExpertiseError(`Certificate #${i + 1} Name cannot be empty.`);
          return;
        }
        if (!cert.organization?.trim()) {
          setExpertiseError(`Issuing Organization for "${cert.certificateName || i + 1}" cannot be empty.`);
          return;
        }
      }
    }

    let cleanedSkills = "";
    if (localForm.skills?.trim()) {
      const rawSkillsArray = localForm.skills.split(",");
      const processedSkills: string[] = [];
      
      rawSkillsArray.forEach((skill) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill !== "") {
          const isDuplicate = processedSkills.some(
            (s) => s.toLowerCase() === trimmedSkill.toLowerCase()
          );
          if (!isDuplicate) {
            processedSkills.push(trimmedSkill);
          }
        }
      });

      cleanedSkills = processedSkills.join(", ");
    } else {
      cleanedSkills = localForm.skills || ""; // Giữ nguyên chuỗi rỗng nếu ban đầu không nhập
    }

    const finalizedForm: FormState = {
      ...localForm,
      firstName: localForm.firstName.trim(),
      lastName: localForm.lastName?.trim() || "",
      coachCost: Number(localForm.coachCost) || 0,
      skills: cleanedSkills,
    };

    onSave(finalizedForm, certificateFiles);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12">
      <div className="w-full max-w-4xl rounded-[28px] border border-border bg-slate-950 p-8 shadow-2xl shadow-black/50">
        
        {/* Modal Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-4">
          <div>
            <button type="button" onClick={onCancel} className="mb-2 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" /> Back
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
                  {localForm.avatarUrl ? (
                    <img src={localForm.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{(localForm.firstName || "U").charAt(0)}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="label text-xs font-semibold text-slate-300" htmlFor="firstName">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={localForm.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                    placeholder="John"
                    maxLength={50}
                    required
                  />
                  {firstNameError && (
                    <p className="text-red-400 text-xs mt-1">{firstNameError}</p>
                  )}
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
                    maxLength={50}
                  />
                </div>

                {localForm.roleName === "Mentor" && (
                  <div className="sm:col-span-2 animate-in fade-in duration-200">
                    <label className="label text-xs font-semibold text-orange-400" htmlFor="coachCost">
                      Coach Cost ($ / hour) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="coachCost"
                      type="number"
                      min="0"
                      value={localForm.coachCost}
                      onChange={(event) => updateField("coachCost", Number(event.target.value))}
                      className="input w-full bg-gray-900 border-orange-500/30 text-white rounded-xl text-sm focus:border-orange-500"
                      placeholder="e.g. 50"
                    />
                    {coachCostError && (
                      <p className="text-red-400 text-xs mt-1">{coachCostError}</p>
                    )}
                  </div>
                )}
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
                maxLength={500}
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
                maxLength={200}
              />
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <p className="label text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
              Areas of Expertise
              {localForm.roleName === "Mentor" && (<span className="text-red-400">*</span>)}
            </p>
            {isLoadingExpertises && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin text-primary" />
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

            {localForm.roleName === "Mentor" && localForm.selectedExpertiseIds.length === 0 && (
              <p className="text-[11px] text-red-400 font-medium flex items-center mt-2 animate-in fade-in duration-150">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1.5 shrink-0" />
                As a Mentor, you must select at least one Area of Expertise option.
              </p>
            )}

          </div>
          
          {/* Experience */}
          <ExperienceFormList 
            experiences={localForm.experiences} 
            onChange={(updatedExperiences) => updateField("experiences", updatedExperiences)}
          />

          {/* Certificate */}
          <CertificateFormList
            certificates={localForm.certificates}
            onChange={(updatedCerts) => updateField("certificates", updatedCerts)}
            onFileChange={(key, file) => setCertificateFiles(prev => ({ ...prev, [key]: file }))}
            selectedFilesMap={certificateFiles} 
            onError={function (errorMsg: string): void {
              throw new Error("Function not implemented.");
            }}
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
}