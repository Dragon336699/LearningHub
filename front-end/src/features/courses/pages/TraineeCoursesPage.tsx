import { useState } from "react";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { Course } from "../types/Course.types";
import { ViewCourseDetailModal } from "../components/ViewCourseDetailModal";
import { useTraineeCourses } from "../hooks/Course.hook";

export const TraineeCoursesPage = () => {
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const { data: pagedCourses } = useTraineeCourses(page, pageSize);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const totalPages = Math.ceil(
        (pagedCourses?.totalCount ?? 0) / pageSize
    );

    return (
        <div className="p-12 rounded-lg bg-card text-white h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Find courses</h1>
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
                                    <p className="w-64 max-w-xs truncate">
                                        {course.title}
                                    </p>
                                </td>

                                <td className="max-w-md px-6 py-4 text-sm">
                                    <p className="w-64 line-clamp-2 truncate">
                                        {course.description}
                                    </p>
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
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
        </div>
    )
}