import { useState } from "react";
import { DialogShell } from "../../../shared/ui/components/DialogShell"
import { Course } from "../types/Course.types";
import { AssignTraineesModal } from "./AssignTraineesModal";

type ViewCourseDetailModalProps = {
    course: Course;
    userRole: string;
    onClose: () => void;
}

const statusColors = {
    "Published": "text-success",
    "Draft": "text-primary",
    "Archived": "text-info"
};

export const ViewCourseDetailModal = ({ course, userRole, onClose }: ViewCourseDetailModalProps) => {
    const [showAssignModal, setShowAssignModal] = useState(false);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    }
    
    return (
        <DialogShell open={true} title={course.title} onClose={onClose}>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-title-information">Code</p>
                    <p>{course.courseCode}</p>
                </div>

                <div>
                    <p className="text-sm text-title-information">Status</p>
                    <p className={statusColors[course.status]}>
                        {course.status}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-title-information">Created At</p>
                    <p>{formatDate(course.createdAt)}</p>
                </div>

                <div>
                    <p className="text-sm text-title-information">Last Updated</p>
                    <p>{formatDate(course.updatedAt)}</p>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-sm text-title-information">Description</p>
                <p className="mt-1 break-words">
                    {course.description}
                </p>
            </div>

            <div className="mt-6">
                <p className="text-sm text-title-information">Learning Objectives</p>
                <p className="mt-1 break-words">
                    {course.learningObjectives}
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">                
                {/* Only allow assigns if Published */}
                {course.status === "Published" && userRole == "Mentor" && (
                    <button
                        type="button"
                        onClick={() => setShowAssignModal(true)}
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all duration-200"
                    >
                    Assign Trainees
                    </button>
                )}
            </div>

            {showAssignModal && (
                <AssignTraineesModal
                    courseId={course.id}
                    courseTitle={course.title}
                    onClose={() => setShowAssignModal(false)} 
                    onSuccess={() => {
                        setShowAssignModal(false);
                    }}
                />
            )}
        </DialogShell>
    )
}