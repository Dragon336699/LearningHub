import { useEffect, useState } from "react";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "../../../shared/ui/components/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";
import { Result } from "../../../types/result";
import { toast } from "sonner";
import { ViewCourseDetailModal } from "../components/ViewCourseDetailModal";
import { CreateCourseModal } from "../components/CreateCourseModal";
import { CreateCourseForm } from "../schemas/CreateCourseSchema";
import { UpdateCourseModal } from "../components/UpdateCourseModal";
import { UpdateCourseForm } from "../schemas/UpdateCourseSchema";
import { useCreateCourse, useDeleteCourse, useMentorCourses, useUpdateCourse } from "../hooks/Course.hook";
import { Course } from "../types/Course.types";

const statusColors = {
    "Published": "text-success bg-success-background",
    "Draft": "text-primary bg-warning-background",
    "Archived": "text-info bg-info-background"
};

export const MentorCoursesPage = () => {
    const queryClient = useQueryClient();
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const { data: pagedCourses } = useMentorCourses(page, pageSize);

    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();
    const deleteCourseMutation = useDeleteCourse();

    const totalPages = Math.ceil(
        (pagedCourses?.totalCount ?? 0) / pageSize
    );

    //Create course
    const handleCreateCourse = async (course: CreateCourseForm) => {
        try {
            await createCourseMutation.mutateAsync(course);
            toast.success(`Course ${course.title} was created successfully`);
            setIsCreateModalOpen(false);
        } catch (errors: Result<any> | any) {
            if (errors) {
                errors.forEach((err: string) => toast.error(err));
                return;
            }

            toast.error("Failed to create course");
        }
    }

    //Update course
    const handleUpdateCourse = async (course: UpdateCourseForm) => {
        try {
            await updateCourseMutation.mutateAsync(course);
            toast.success(`Course ${course.title} was updated successfully`);
            setIsUpdateModalOpen(false);
        } catch (error: Result<any> | any) {
            if (error?.errors) {
                error.errors.forEach((err: string) => toast.error(err));
                return;
            }

            toast.error("Failed to update course");
        }
    }

    // Delete course
    const handleDeleteCourse = async (course: Course) => {
        try {
            await deleteCourseMutation.mutateAsync(course.id);
            toast.success(`Course ${course.title} was deleted successfully`);
            setIsConfirmDeleteModalOpen(false);

            if (pagedCourses?.items.length === 1 && page > 1) {
                setPage(page - 1);
            }
            await queryClient.invalidateQueries({ queryKey: ["mentor-courses"] });
        } catch (error: Result<any> | any) {
            if (error?.errors) {
                error.errors.forEach((err: string) => toast.error(err));
                return;
            }

            toast.error("Failed to delete course");
        }
    }

    return (
        <div className="p-12 rounded-lg bg-card text-white h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Course Management</h1>
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover active:scale-95" onClick={() => setIsCreateModalOpen(true)}>
                    Create New Course
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-table-header">
                        <tr>
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
                                Actions
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
                                    {course.title}
                                </td>

                                <td className="max-w-md px-6 py-4 text-sm">
                                    <p className="line-clamp-2">
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

                                    <button
                                        className="
                                            cursor-pointer rounded-xl bg-primary px-4 py-2
                                            text-sm font-medium text-white
                                            transition hover:bg-primary-hover
                                            active:scale-95
                                        "
                                        onClick={() => {
                                            setIsUpdateModalOpen(true);
                                            setSelectedCourse(course);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="
                                            cursor-pointer rounded-xl bg-danger px-4 py-2
                                            text-sm font-medium text-white
                                            transition hover:bg-danger-hover
                                            active:scale-95
                                        "
                                        onClick={() => {
                                            setIsConfirmDeleteModalOpen(true);
                                            setSelectedCourse(course);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
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

            {isCreateModalOpen && (
                <CreateCourseModal
                    isLoading={createCourseMutation.isPending}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={((data: CreateCourseForm) => handleCreateCourse(data))}
                />
            )}

            {isViewModalOpen && (
                <ViewCourseDetailModal
                    course={selectedCourse!}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}

            {isUpdateModalOpen && (
                <UpdateCourseModal
                    isLoading={updateCourseMutation.isPending}
                    data={selectedCourse!}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={(data: UpdateCourseForm) => handleUpdateCourse(data)}
                />
            )}

            {isConfirmDeleteModalOpen && (
                <ConfirmModal
                    isLoading={deleteCourseMutation.isPending}
                    onConfirm={() => handleDeleteCourse(selectedCourse!)}
                    onCancel={() => {
                        setIsConfirmDeleteModalOpen(false);
                    }}
                />
            )}
        </div>
    )
}