import { useState } from "react";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { useQueryClient } from "@tanstack/react-query";
import { Result } from "../../../types/result";
import { toast } from "sonner";
import { courseService } from "../services/Course.service";
import { useAdminCourses } from "../hooks/Course.hook";
import { CustomSelect } from "../../../shared/ui/components/CustomSelect";
import { Course, CourseStatus } from "../types/Course.types";
import { ViewCourseDetailModal } from "../components/ViewCourseDetailModal";
import { ConfirmModal } from "../../../shared/ui/components/ConfirmModal";

const statusColors = {
    "Published": "text-success bg-success-background",
    "Draft": "text-primary bg-warning-background",
    "Archived": "text-info bg-info-background"
};

export const AdminCoursesPage = () => {
    const queryClient = useQueryClient();
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const { data: pagedCourses } = useAdminCourses(page, pageSize);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isConfirmChangeStatusOpen, setIsConfirmChangeStatusOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const totalPages = Math.ceil(
        (pagedCourses?.totalCount ?? 0) / pageSize
    );

    const openConfirmChangeStatus = (course: Course, newStatus: string) => {
        if (course.status === newStatus) {
            toast.error(`Course is already in "${newStatus}" status`);
            return;
        }

        setSelectedCourse(course);
        setPendingStatus(newStatus);
        setIsConfirmChangeStatusOpen(true);
    }

    const handleChangeStatus = async (course: Course, status: string) => {
        try {
            const updatedCourse = await courseService.updateCourseStatus({ id: course.id, status: status as CourseStatus });

            queryClient.setQueryData(["admin-courses", page, pageSize], (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    items: oldData.items.map((item: Course) => item.id === updatedCourse?.id ? updatedCourse : item)
                };
            });

            toast.success("Change course status successfully");
        } catch (error: Result<any> | any) {
            if (error?.errors) {
                error.errors.forEach((err: string) => toast.error(err));
                return;
            }

            toast.error("Failed to change course status");
        }
    }

    return (
        <div className="p-12 rounded-lg bg-card text-white h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Course Management</h1>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-table-header">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Code
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Title
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Description
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                Action
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold">

                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {pagedCourses?.items.map((course: Course) => (
                            <tr
                                key={course.id}
                                className="border-b border-gray-200 bg-table-content"
                            >
                                <td className="px-6 py-4 text-sm font-medium">
                                    <p className="max-w-xs truncate text-muted-foreground">
                                        {course.courseCode}
                                    </p>
                                </td>

                                <td className="px-6 py-4 text-sm font-medium">
                                    <p className="w-56 max-w-xs truncate">
                                        {course.title}
                                    </p>
                                </td>

                                <td className="max-w-md px-6 py-4 text-sm">
                                    <p className="w-56 line-clamp-2 truncate">
                                        {course.description}
                                    </p>
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold min-w-[82px] justify-center
                            ${statusColors[course.status] || 'text-white'}`}
                                    >
                                        {course.status}
                                    </span>
                                </td>
                                <td>
                                    <CustomSelect
                                        options={Object.values(CourseStatus).map((status) => ({ label: status, value: status }))}
                                        value={course.status} onChange={(value: string) => openConfirmChangeStatus(course, value)}
                                        getLabel={(status) => status.label}
                                        getValue={(status) => status.value} />
                                </td>
                                <td className="flex justify-center px-6 py-4 text-center space-x-2">


                                    <button
                                        onClick={() => {
                                            setSelectedCourse(course);
                                            setIsViewModalOpen(true);
                                        }}
                                        className="
                                            cursor-pointer rounded-xl bg-info px-4 py-2
                                            text-sm font-medium text-white
                                            transition hover:bg-info-hover
                                            active:scale-95
                                        "
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 mb-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            {isViewModalOpen && (
                <ViewCourseDetailModal
                    course={selectedCourse!}
                    userRole="Admin"
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}

            {isConfirmChangeStatusOpen && (
                <ConfirmModal
                    title="Confirm Change Status"
                    description={`Are you sure you want to change course status to "${pendingStatus}"?`}
                    onConfirm={() => {
                        handleChangeStatus(selectedCourse!, pendingStatus!);

                        setIsConfirmChangeStatusOpen(false);
                        setPendingStatus(null);
                    }}
                    onCancel={() => {
                        setIsConfirmChangeStatusOpen(false);
                        setPendingStatus(null);
                    }}
                />
            )}
        </div>
    )
}