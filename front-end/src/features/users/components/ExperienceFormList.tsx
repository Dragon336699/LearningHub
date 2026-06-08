import { memo } from "react";
import { Experience } from "../../../types/experience";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

interface ExperienceFormListProps {
  experiences: Experience[];
  onChange: (updated: Experience[]) => void;
  errors?: Record<number, { title?: string; date?: string }>;
}

// Format date to ISO String yyyy-MM-dd for display in input HTML5
const formatDateForInput = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};

export const ExperienceFormList = memo(({ experiences, onChange, errors = {} }: ExperienceFormListProps) => {

  const handleAdd = () => {
    const newExp: Experience = {
      id: "",
      title: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    };
    onChange([...experiences, newExp]);
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = experiences.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  const handleFieldChange = (index: number, field: keyof Experience, value: string) => {
    const updated = experiences.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updated);
  };

  const sortedExperiences = [...experiences]
    .map((exp, originalIndex) => ({ exp, originalIndex }));

  return (
    <div className="border-t border-slate-900 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Experiences</h3>
        <button
          title="Add New Experience"
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 px-4 py-2 text-xs font-bold text-white transition"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-6">
        {sortedExperiences.map(({ exp, originalIndex }, displayIndex) => {
          const isTitleEmpty = exp.title?.trim() === "";
          const rowErrors = errors[originalIndex] || {};
          return (
            <div
              key={exp.id || originalIndex}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience {displayIndex + 1}</span>
                <button
                  title="Remove Experience"
                  type="button"
                  onClick={() => handleRemove(originalIndex)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition font-medium"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`title-${originalIndex}`}>Title<span className="text-danger ml-1">*</span></label>
                  <input
                    id={`title-${originalIndex}`}
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleFieldChange(originalIndex, "title", e.target.value.slice(0, 100))}
                    className={`w-full bg-slate-900 border text-white rounded-xl text-sm px-3 py-2 focus:outline-none ${isTitleEmpty || rowErrors.title ? "border-red-500/80 focus:border-red-500" : "border-slate-800 focus:border-orange-500/50"
                      }`}
                    placeholder="e.g. Frontend Dev"
                    maxLength={100}
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    {(isTitleEmpty || rowErrors.title) ? (
                      <p className="text-[11px] text-red-400 font-medium flex items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 shrink-0" /> {rowErrors.title || "Experience title is required."}
                      </p>
                    ) : <div />}
                    <span className={`text-[10px] font-medium tracking-wide ${(exp.title || "").length >= 100 ? "text-red-400 font-bold" : "text-slate-500"}`}>
                      {(exp.title || "").length} / 100
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`desc-${originalIndex}`}>Description</label>
                  <input
                    id={`desc-${originalIndex}`}
                    type="text"
                    value={exp.description || ""}
                    onChange={(e) => handleFieldChange(originalIndex, "description", e.target.value.slice(0, 500))}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm px-3 py-2 focus:outline-none focus:border-orange-500/50"
                    placeholder="e.g. React project"
                    maxLength={500}
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-[10px] font-medium tracking-wide ${(exp.description || "").length >= 500 ? "text-red-400 font-bold" : "text-slate-500"}`}>
                      {(exp.description || "").length} / 500
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`start-${originalIndex}`}>Start Date<span className="text-danger ml-1">*</span></label>
                  <input
                    id={`start-${originalIndex}`}
                    type="date"
                    min="1900-01-01"
                    max="2100-12-31"
                    value={formatDateForInput(exp.startDate)}
                    onChange={(e) => handleFieldChange(originalIndex, "startDate", e.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`end-${originalIndex}`}>End Date</label>
                  <input
                    id={`end-${originalIndex}`}
                    type="date"
                    min="0001-01-01"
                    max="9999-12-31"
                    value={formatDateForInput(exp.endDate)}
                    onChange={(e) => handleFieldChange(originalIndex, "endDate", e.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  />
                </div>
              </div>

              {rowErrors.date && (
                <p className="text-[11px] text-red-400 font-medium flex items-center mt-2 animate-in fade-in duration-100">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1.5 shrink-0" />
                  {rowErrors.date}
                </p>
              )}
            </div>
          );

        })}

        {experiences.length === 0 && (
          <p className="text-xs text-slate-500 italic text-center py-4">No experience specified yet.</p>
        )}
      </div>
    </div>
  );
});

ExperienceFormList.displayName = "ExperienceFormList";