import { useEffect, useState } from "react";
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
import { CommonPageSizeOptions } from "../../../shared/types/pageSizeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "../../../shared/hooks/Common.hook";

const statusColors = {
    "Published": "text-success bg-success-background",
    "Draft": "text-primary bg-warning-background",
    "Archived": "text-info bg-info-background"
};

export const AdminCoursesPage = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isConfirmChangeStatusOpen, setIsConfirmChangeStatusOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const debounceQuery = useDebounce(searchQuery, 500);
    const { data: pagedCourses } = useAdminCourses(page, pageSize, debounceQuery);

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
            queryClient.setQueryData(["admin-courses", page, pageSize, debounceQuery], (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    items: oldData.items.map((item: Course) => item.id === updatedCourse?.id ? updatedCourse : item)
                };
            });

            toast.success("Change course status successfully");
        } catch (error: Result<any> | any) {
            if (error) {
                error.forEach((err: string) => toast.error(err));
                return;
            }

            toast.error("Failed to change course status");
        }
    }

    const handleChangePageSize = (newPageSize: number) => {
        const firstItemIndex = (page - 1) * pageSize + 1;
        const newPage = Math.ceil(firstItemIndex / newPageSize);
        setPage(newPage);
        setPageSize(newPageSize);
    }

    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        }
    }, [debounceQuery]);

    return (
        <div className="p-12 rounded-lg bg-card text-white min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Course Management</h1>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search courses by name or code"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    maxLength={100}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
            {pagedCourses && pagedCourses.totalCount > 0 ? (
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
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <FontAwesomeIcon icon={faBook} className="text-4xl mb-3 text-gray-400" />
                    <p className="text-lg font-medium">
                        No course found
                    </p>
                </div>
            )}
            {pagedCourses && pagedCourses.totalCount > 0 && (
                <div className="mt-6 mb-4">
                    <Pagination
                        pageSizeOptions={CommonPageSizeOptions.map(size => ({ label: size, value: size }))}
                        currentPage={page}
                        currentPageSize={pageSize}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onPageSizeChange={handleChangePageSize}
                    />
                </div>
            )}
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