import { useQuery } from "@tanstack/react-query"
import { courseService } from "../services/Course.service"

export const useMentorCourses = (page: number = 1, pageSize: number = 5) => {
    return useQuery({
        queryKey: ["mentor-courses", page, pageSize],
        queryFn: async () => await courseService.getCoursesByMentor(page, pageSize)
    })
}

export const useAdminCourses = (page: number = 1, pageSize: number = 5) => {
    return useQuery({
        queryKey: ["admin-courses", page, pageSize],
        queryFn: async () => await courseService.getAllCourses(page, pageSize)
    })
}

export const useTraineeCourses = (page: number = 1, pageSize: number = 5) => {
    return useQuery({
        queryKey: ["trainee-courses", page, pageSize],
        queryFn: async () => await courseService.getCoursesByTrainee(page, pageSize)
    })
}