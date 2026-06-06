import { useState, useEffect, useMemo } from "react";
import { ExpertiseResponse, expertiseService } from "../../../services/expertise.service";
import { FormState } from "../types";
import { ExperienceFormList } from "./ExperienceFormList";
import { CertificateFormList } from "./CertificateFormList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { DialogShell } from "../../../shared/ui/components/DialogShell";

interface EditProfileModalProps {
  initialFormState: FormState;
  onCancel: () => void;
  onSave: (updatedForm: FormState, filesMap: Record<string | number, File>) => void;
  isSaving?: boolean;
}

export const EditProfileModal = ({
  initialFormState,
  onCancel,
  onSave,
  isSaving = false,
}: EditProfileModalProps) => {

  const [localForm, setLocalForm] = useState<FormState>({ ...initialFormState });

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [coachCostError, setCoachCostError] = useState<string | null>(null);
  const [expertiseError, setExpertiseError] = useState<string | null>(null);
  const [expErrors, setExpErrors] = useState<Record<number, { title?: string; date?: string }>>({});
  const [certErrors, setCertErrors] = useState<Record<number, { name?: string; org?: string; date?: string }>>({});

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
    setExpErrors({});
    setCertErrors({});


    if (!localForm.firstName.trim()) {
      setFirstNameError("First name is required.");
      const inputElement = document.getElementById("firstName") as HTMLInputElement | null;
      if (inputElement) {
        inputElement.focus();
      }
      return;
    }

    if (localForm.lastName && localForm.lastName.length > 50) {
      setLastNameError("Last name must not exceed 50 characters.");
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
      // Validate experience entries before submitting
      const newExpErrors: Record<number, { title?: string; date?: string }> = {};
      let hasError = false;

      const tzOffset = new Date().getTimezoneOffset() * 60000; // Miliseconds offset for local timezone
      const localTodayStr = new Date(Date.now() - tzOffset).toISOString().split("T")[0]; // Get local date in yyyy-MM-dd format
      const errorsForRows: { title?: string; date?: string } = {};

      let errorFlag = false;
      for (let i = 0; i < localForm.experiences.length; i++) {
        errorFlag = false;
        const exp = localForm.experiences[i];
        // Validate title
        if (!exp.title?.trim()) {
          errorsForRows.title = "Experience title cannot be left empty.";
          hasError = true;
          errorFlag = true;
        }

        if (exp.startDate) {
          const startStr = exp.startDate.split("T")[0];
          // Start date cannot be in the future
          if (startStr > localTodayStr) {
            errorsForRows.date = "Start date cannot be a date in the future.";
            hasError = true;
            errorFlag = true;
          }

          if (exp.endDate && !errorsForRows.date) {
            const endStr = exp.endDate.split("T")[0];
            // End date cannot be before start date
            if (endStr < startStr) {
              errorsForRows.date = "End date must be after Start date";
              hasError = true;
              errorFlag = true;
            }
          }
        }
        if (Object.keys(errorsForRows).length > 0 && errorFlag) {
          newExpErrors[i] = errorsForRows;
        }
      }
      if (hasError) {
        setExpErrors(newExpErrors);
        return;
      }
    }

    if (localForm.certificates && localForm.certificates.length > 0) {
      let hasCertError = false;

      // Get local date in yyyy-MM-dd format for comparison
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const localTodayStr = new Date(Date.now() - tzOffset).toISOString().split("T")[0];
      const newCertErrors: Record<number, { name?: string; org?: string; date?: string }> = {};

      for (let i = 0; i < localForm.certificates.length; i++) {
        const cert = localForm.certificates[i];
        const currentErrors: { name?: string; org?: string; date?: string } = {};
        // Validate certificate name
        if (!cert.certificateName?.trim()) {
          currentErrors.name = "Certificate name is required.";
          hasCertError = true;
        }
        // Validate issuing organization
        if (!cert.organization?.trim()) {
          currentErrors.org = "Issuing organization is required.";
          hasCertError = true;
        }

        if (cert.issueDate) {
          const issueStr = cert.issueDate.split("T")[0];
          // Issue date cannot be in the future
          if (issueStr > localTodayStr) {
            currentErrors.date = "Issue date cannot be in the future";
            hasCertError = true;
          }
          // If expiration date exists, it must be after issue date
          if (cert.expirationDate && !currentErrors.date) {
            const expStr = cert.expirationDate.split("T")[0];

            if (expStr <= issueStr) {
              currentErrors.date = "Expiration Date must be after Issue date";
              hasCertError = true;
            }
          }
        }
        if (Object.keys(currentErrors).length > 0) {
          newCertErrors[i] = currentErrors;
        }
      }

      if (hasCertError) {
        setCertErrors(newCertErrors);
        return;
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

  const isFormUnchanged = useMemo(() => {
    const jsonInitial = JSON.stringify(initialFormState);
    const jsonCurrent = JSON.stringify(localForm);

    if (jsonInitial !== jsonCurrent) return false;

    const hasNewFilesSelected = Object.keys(certificateFiles).length > 0;
    if (hasNewFilesSelected) return false;

    return true;
  }, [initialFormState, localForm, certificateFiles]);

  return (
    <DialogShell
      open={true}
      title="Edit Your Profile"
      isLoading={isSaving}
      onClose={onCancel}
    >
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
                  <span className="cursor-default">{(localForm.firstName || "U").charAt(0)}</span>
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
                <div className="flex justify-between items-center mt-1">
                  {/* Error */}
                  {firstNameError ? <p className="text-red-400 text-xs">{firstNameError}</p> : <div />}
                  {/* Character Count */}
                  <span className={`text-[10px] font-medium tracking-wide ${localForm.firstName.length >= 50 ? "text-red-400 font-bold" : "text-slate-500"}`}>
                    {localForm.firstName.length} / 50
                  </span>
                </div>
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
                <div className="flex justify-between items-center mt-1">
                  {lastNameError ? <p className="text-red-400 text-xs">{lastNameError}</p> : <div />}
                  <span className={`text-[10px] font-medium tracking-wide ${(localForm.lastName || "").length >= 50 ? "text-red-400 font-bold" : "text-slate-500"}`}>
                    {(localForm.lastName || "").length} / 50
                  </span>
                </div>
              </div>

              {localForm.roleName === "Mentor" && (
                <div className="sm:col-span-2 animate-in fade-in duration-200">
                  <label className="label text-xs font-semibold text-orange-400" htmlFor="coachCost">
                    Coach Cost ($/hour)
                  </label>
                  <input
                    id="coachCost"
                    type="text"
                    min="0"
                    value={localForm.coachCost === 0 ? "" : localForm.coachCost}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      if (rawValue.length > 18) return;
                      if (rawValue === "") {
                        updateField("coachCost", 0);
                        return;
                      }
                      const parsedValue = Number(rawValue);
                      if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
                        updateField("coachCost", parsedValue);
                      }
                    }}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
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
              className="textarea w-full h-24 bg-slate-900 border-slate-800 text-white rounded-xl text-sm whitespace-pre-wrap overflow-y-auto resize-y"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <div className="flex justify-end mt-1">
              {bioError ? (
                <p className="text-red-400 text-xs mr-auto">{bioError}</p>
              ) : <div />}
              <span className={`text-[10px] font-medium tracking-wide ${(localForm.bio || "").length >= 500 ? "text-red-400 font-bold" : "text-slate-500"}`}>
                {(localForm.bio || "").length} / 500
              </span>
            </div>
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
            <div className="flex justify-end mt-1">
              {skillsError ? (
                <p className="text-red-400 text-xs mr-auto">{skillsError}</p>
              ) : <div />}
              <span className={`text-[10px] font-medium tracking-wide ${(localForm.skills || "").length >= 200 ? "text-red-400 font-bold" : "text-slate-500"}`}>
                {(localForm.skills || "").length} / 200
              </span>
            </div>
          </div>
        </div>

        {/* Areas of Expertise */}
        <div>
          <p className="label text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
            Areas of Expertise
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

        </div>

        {/* Experience */}
        <ExperienceFormList
          experiences={localForm.experiences}
          onChange={(updatedExperiences) => updateField("experiences", updatedExperiences)}
          errors={expErrors}
        />


        {/* Certificate */}
        <CertificateFormList
          certificates={localForm.certificates}
          onChange={(updatedCerts) => updateField("certificates", updatedCerts)}
          onFileChange={(key, file) => {
            setCertificateFiles((prev) => {
              const updatedMap = { ...prev };
              if (file === null) {
                delete updatedMap[key]; // Gọt sạch key rỗng để giải phóng bộ nhớ RAM
              } else {
                updatedMap[key] = file; // Nạp file xịn mới được chọn
              }
              return updatedMap;
            });
          }}
          onFileRemove={(key) => {
            setCertificateFiles((prev) => {
              const updatedMap = { ...prev };
              delete updatedMap[key];
              return updatedMap;
            });
          }}
          selectedFilesMap={certificateFiles}
          errors={certErrors}
        />

        {/* Modal Actions */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-900 pt-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn btn-outline border-slate-800 text-slate-300 rounded-xl text-sm w-full sm:w-auto">Cancel</button>
          <button
            disabled={isFormUnchanged}
            type="button"
            onClick={handleSubmit}
            className={`btn rounded-xl text-sm w-full sm:w-auto px-6 font-bold transition-all duration-200 ${isFormUnchanged
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40 opacity-50" // Trạng thái khóa mờ khi chưa update
              : "bg-orange-600 hover:bg-orange-400 text-white shadow-lg shadow-orange-600/10" // Trạng thái sáng rực khi có thay đổi
              }`}
          >Save Changes</button>
        </div>

      </div>
    </DialogShell>

  );
}