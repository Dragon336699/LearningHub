import { useState } from "react";
import { Pagination } from "../../../shared/ui/components/Pagination";
import { Course } from "../types/Course.types";
import { ViewCourseDetailModal } from "../components/ViewCourseDetailModal";
import { useTraineeEnrolledCourses } from "../hooks/Course.hook"; // Hook mới anh em mình vừa thống nhất
import { CommonPageSizeOptions } from "../../../shared/types/pageSizeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

export const TraineeEnrolledCoursesPage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6); 
    const { data: pagedCourses, isLoading, isError } = useTraineeEnrolledCourses(page, pageSize);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const totalPages = Math.ceil((pagedCourses?.totalCount ?? 0) / pageSize) || 1;

    const handleChangePageSize = (newPageSize: number) => {
        const firstItemIndex = (page - 1) * pageSize + 1;
        const newPage = Math.ceil(firstItemIndex / newPageSize);
        setPage(newPage);
        setPageSize(newPageSize);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-full py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-info"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-12 text-center text-red-500 bg-card rounded-lg">
                Failed to load your enrolled courses. Please refresh the page.
            </div>
        );
    }

    return (
        <div className="p-12 rounded-lg bg-card text-white min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Enrolled Courses</h1>
            </div>

            {pagedCourses && pagedCourses.totalCount > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pagedCourses?.items?.map((course: Course) => (
                        <div 
                            key={course.id} 
                            className="flex flex-col justify-between p-6 rounded-2xl border border-gray-700 bg-table-content shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-info text-white">
                                        {course.courseCode}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold mb-2 line-clamp-1 text-white" title={course.title}>
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                                    {course.description}
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={() => {
                                        setSelectedCourse(course);
                                        setIsViewModalOpen(true);
                                    }}
                                    className="w-full cursor-pointer rounded-xl bg-info px-4 py-2.5 text-sm font-medium text-white transition hover:bg-info-hover active:scale-95 flex items-center justify-center space-x-2"
                                >
                                    <FontAwesomeIcon icon={faGraduationCap} />
                                    <span>Learn Now</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <FontAwesomeIcon icon={faBook} className="text-4xl mb-3 text-gray-400" />
                    <p className="text-lg font-medium">
                        You are not assigned to any courses yet.
                    </p>
                </div>
            )}

            {pagedCourses && pagedCourses.totalCount > 0 && (
                <div className="mt-8 mb-4">
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

            {/* 📋 MODAL POPUP */}
            {isViewModalOpen && selectedCourse && (
                <ViewCourseDetailModal
                    course={selectedCourse}
                    userRole="Trainee"
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
        </div>
    );
};