import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DialogShell } from "../../../shared/ui/components/DialogShell";
import { courseService, CourseTraineeDto } from "../../../features/courses/services/Course.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCheckCircle, faUsers, faUserPlus, faClock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useGetTraineesStatusByCourse } from "../hooks/Course.hook";

interface AssignTraineesModalProps {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignTraineesModal = ({ courseId, courseTitle, onClose, onSuccess }: AssignTraineesModalProps) => {
  const [activeTab, setActiveTab] = useState<"current" | "assign">("current");
  const [searchQueryDisplay, setSearchQueryDisplay] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<{ traineeIds: string[] }>({
    defaultValues: { traineeIds: [] }
  });

  const watchedTraineeIds = watch("traineeIds") || [];
  const { data: traineeList } = useGetTraineesStatusByCourse(courseId, searchQuery);

  const trainees = traineeList?.data ?? [];
  const currentEnrolled = trainees.filter((t: { isEnrolled: any; }) => t.isEnrolled);
  const nonEnrolled = trainees.filter((t: { isEnrolled: any; }) => !t.isEnrolled);

  const onSubmitForm = async (data: { traineeIds: string[] }) => {
    if (data.traineeIds.length === 0) return;
    setIsSubmitting(true);
    try {
      const response = await courseService.assignTrainees({
        courseId,
        traineeIds: data.traineeIds
      });

      if (response?.isSuccess) {
        toast.success(`Successfully assigned ${data.traineeIds.length} trainees to this course!`);
        reset({ traineeIds: [] });
        onSuccess();
      }
    } catch {
      toast.error("Failed to assign trainees. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchQueryDisplay);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQueryDisplay]);

  return (
    <DialogShell open={true} title="Manage Course Trainees" isLoading={isSubmitting} onClose={onClose}>
      <div className="space-y-4 py-1 text-white">

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Course</span>
          <h4 className="text-sm font-bold text-orange-500 mt-0.5 truncate">{courseTitle}</h4>
        </div>

        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("current")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === "current" ? "border-orange-500 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
          >
            <FontAwesomeIcon icon={faUsers} />
            Enrolled Trainees ({currentEnrolled.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assign")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === "assign" ? "border-orange-500 text-orange-500" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Assign New Trainees
          </button>
        </div>

        {activeTab === "current" && (
          <div className="border border-slate-900 bg-slate-950/20 rounded-xl max-h-[35vh] overflow-y-auto divide-y divide-slate-900 scrollbar-thin">
            {currentEnrolled.map((t: CourseTraineeDto) => (
              <div key={t.id} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={t.avatarUrl || t.firstName.charAt(0) || "U"} className="w-8 h-8 rounded-full border border-slate-800 object-cover" alt="" />
                  <div className="text-sm min-w-0">
                    <p className="font-bold text-gray-200 truncate">{`${t.firstName || ""} ${t.lastName || ""}`}</p>
                    <p className="text-slate-500 text-[11px] truncate mt-0.5">{t.bio || "LearningHub member"}</p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  <FontAwesomeIcon icon={faClock} className="text-[9px]" />
                  {t.trainingStatus || "Incomplete"}
                </span>
              </div>
            ))}
            {currentEnrolled.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-12">No trainees enrolled in this course yet.</p>
            )}
          </div>
        )}

        {activeTab === "assign" && (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3.5 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Search new trainees to add..."
                value={searchQueryDisplay}
                onChange={(e) => {
                  setSearchQueryDisplay(e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl text-sm pl-11 pr-4 py-2.5 focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="border border-slate-900 bg-slate-950/20 rounded-xl max-h-[30vh] overflow-y-auto divide-y divide-slate-900 scrollbar-thin">
              {nonEnrolled.map((t: CourseTraineeDto) => {
                const isChecked = watchedTraineeIds.includes(t.id);
                return (
                  <label key={t.id} className={`flex items-center justify-between p-3 hover:bg-slate-900/30 transition-colors cursor-pointer select-none ${isChecked ? "bg-orange-500/5" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <input type="checkbox" value={t.id} {...register("traineeIds")} className="rounded border-slate-800 bg-slate-950 text-orange-600 focus:ring-0 w-4 h-4" />
                      <img src={t.avatarUrl || t.firstName.charAt(0) || "U"} className="w-7 h-7 rounded-full object-cover" alt="" />
                      <div className="text-sm min-w-0">
                        <p className="font-bold text-gray-200 truncate">{`${t.firstName || ""} ${t.lastName || ""}`}</p>
                        <p className="text-slate-500 text-[11px] truncate mt-0.5">{t.bio || "LearningHub member"}</p>
                      </div>
                    </div>
                    {isChecked && <FontAwesomeIcon icon={faCheckCircle} className="text-orange-500 text-xs shrink-0 animate-in fade-in zoom-in duration-100" />}
                  </label>
                );
              })}
              {nonEnrolled.length === 0 && (
                <p className="text-xs text-slate-500 italic text-center py-12">No new trainees available to assign.</p>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-900 pt-4">
              <span className="text-xs text-slate-400">Selected: <strong className="text-orange-500">{watchedTraineeIds.length}</strong></span>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition">Cancel</button>
                <button type="submit" disabled={watchedTraineeIds.length === 0 || isSubmitting} className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs px-5 font-bold transition">Assign Selected</button>
              </div>
            </div>
          </form>
        )}

        {activeTab === "current" && (
          <div className="flex justify-end border-t border-slate-900 pt-3">
            <button type="button" onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition">Close</button>
          </div>
        )}
      </div>
    </DialogShell>
  );
};