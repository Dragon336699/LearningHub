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
    return (
        <DialogShell open={true} title={course.title} onClose={onClose}>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm text-title-information">Status</p>
                    <p className={`text-md ${statusColors[course.status] || 'text-white'}`}>
                        {course.status}
                    </p>
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm text-title-information">Description</p>
                    <p className="text-md">{course.description}</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm text-title-information">Learning Objectives</p>
                    <p className="text-md">{course.learningObjectives}</p>
                </div>
                <div className="flex">
                    <div className="flex-1">
                        <p className="text-sm text-title-information">Created At</p>
                        <p className="text-md">{new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-title-information">Last Updated</p>
                        <p className="text-md">{new Date(course.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

            </div>
        </DialogShell>
    )
}