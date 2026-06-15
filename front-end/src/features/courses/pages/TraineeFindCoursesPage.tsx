import { useState } from "react";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { Course } from "../types/Course.types";
import { ViewCourseDetailModal } from "../components/ViewCourseDetailModal";
import { useTraineeCourses } from "../hooks/Course.hook";
import { CommonPageSizeOptions } from "../../../shared/types/pageSizeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "../../../shared/hooks/Common.hook";

export const TraineeFindCoursesPage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const debounceQuery = useDebounce(searchQuery, 500);
    const { data: pagedCourses } = useTraineeCourses(page, pageSize, debounceQuery);

    const totalPages = Math.ceil(
        (pagedCourses?.totalCount ?? 0) / pageSize
    );

    const handleChangePageSize = (newPageSize: number) => {
        const firstItemIndex = (page - 1) * pageSize + 1;
        const newPage = Math.ceil(firstItemIndex / newPageSize);
        setPage(newPage);
        setPageSize(newPageSize);
    }

    return (
        <div className="p-12 rounded-lg bg-card text-white min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Find courses</h1>
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
            {isViewModalOpen && selectedCourse && (
                <ViewCourseDetailModal
                    course={selectedCourse}
                    userRole="Trainee"
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
        </div>
    )
}