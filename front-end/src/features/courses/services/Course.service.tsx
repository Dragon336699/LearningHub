import { API_ROUTES } from "../../../configs/api_routes";
import { HttpClient } from "../../../lib/client";
import { PagedResult } from "../../../shared/types/pagedResult";
import { Result } from "../../../types/result";
import { CreateCourseForm } from "../schemas/CreateCourseSchema";
import { UpdateCourseForm } from "../schemas/UpdateCourseSchema";
import { ChangeCourseStatusRequest, Course } from "../types/Course.types";

export const courseService = {
    createCourse: async (course: CreateCourseForm) => {
        const response = await HttpClient.post<Result<Course>>(`${API_ROUTES.COURSE.COMMON}`, course);
        return response.data;
    },
    updateCourse: async (course: UpdateCourseForm) => {
        const response = await HttpClient.put<Result<Course>>(`${API_ROUTES.COURSE.COMMON}`, course);
        return response.data;
    },
    updateCourseStatus: async (request: ChangeCourseStatusRequest) => {
        const response = await HttpClient.put<Result<Course>>(`${API_ROUTES.COURSE.CHANGE_STATUS}`, request);
        return response.data;
    },
    getCoursesByMentor: async (page: number = 1, pageSize: number = 5, keyword ?: string) => {
        const response = await HttpClient.get<Result<PagedResult<Course>>>(`${API_ROUTES.COURSE.MENTOR}?page=${page}&pageSize=${pageSize}${keyword ? `&keyword=${keyword}` : ''}`);
        return response.data;
    },
    getCoursesByTrainee: async (page: number = 1, pageSize: number = 5) => {
        const response = await HttpClient.get<Result<PagedResult<Course>>>(`${API_ROUTES.COURSE.TRAINEE}?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },
    getAllCourses: async (page: number = 1, pageSize: number = 5) => {
        const response = await HttpClient.get<Result<PagedResult<Course>>>(`${API_ROUTES.COURSE.COMMON}?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },
    deleteCourse: async (courseId: string) => {
        const response = await HttpClient.delete<Result<void>>(`${API_ROUTES.COURSE.COMMON}/${courseId}?testUserId=019E7253-728A-7FDD-87C0-8C4A2D081CF6`);
        return response;
    },
}