import { DialogShell } from "../../../shared/ui/components/DialogShell"
import { Course } from "../types/Course.types";

type ViewCourseDetailModalProps = {
    course: Course;
    onClose: () => void;
}

const statusColors = {
    "Published": "text-success",
    "Draft": "text-primary",
    "Archived": "text-info"
};

export const ViewCourseDetailModal = ({ course, onClose }: ViewCourseDetailModalProps) => {
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
        </DialogShell>
    )
}