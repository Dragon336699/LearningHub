import { memo } from "react";
import { Experience } from "../../../types/experience";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

interface ExperienceFormListProps {
  experiences: Experience[];
  onChange: (updated: Experience[]) => void;
}

// Format date to ISO String yyyy-MM-dd for display in input HTML5
const formatDateForInput = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};

export const ExperienceFormList = memo(({ experiences, onChange }: ExperienceFormListProps) => {
  
  const handleAdd = () => {
    const newExp: Experience = {
      id: "", // Empty string for new Insert in Backend
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
        {experiences.map((exp, index) => (
          <div 
            key={exp.id || index} 
            className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 space-y-4 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience {index + 1}</span>
              <button
                title="Remove Experience"
                type="button"
                onClick={() => handleRemove(index)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition font-medium"
              >
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`title-${index}`}>Title</label>
                <input
                  id={`title-${index}`}
                  type="text"
                  value={exp.title}
                  onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                  className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  placeholder="e.g. Frontend Dev"
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`desc-${index}`}>Description</label>
                <input
                  id={`desc-${index}`}
                  type="text"
                  value={exp.description || ""}
                  onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                  className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                  placeholder="e.g. React project"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`start-${index}`}>Start Date</label>
                <input
                  id={`start-${index}`}
                  type="date"
                  value={formatDateForInput(exp.startDate)}
                  onChange={(e) => handleFieldChange(index, "startDate", e.target.value)}
                  className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`end-${index}`}>End Date</label>
                <input
                  id={`end-${index}`}
                  type="date"
                  value={formatDateForInput(exp.endDate)}
                  onChange={(e) => handleFieldChange(index, "endDate", e.target.value)}
                  className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-xs text-slate-500 italic text-center py-4">No experience specified yet.</p>
        )}
      </div>
    </div>
  );
});

ExperienceFormList.displayName = "ExperienceFormList";