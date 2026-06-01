import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/Course.service";
import { CreateCourseForm } from "../schemas/CreateCourseSchema";
import { UpdateCourseForm } from "../schemas/UpdateCourseSchema";

export const useMentorCourses = (page: number = 1, pageSize: number = 5) => {
  return useQuery({
    queryKey: ["mentor-courses", page, pageSize],
    queryFn: async () => await courseService.getCoursesByMentor(page, pageSize),
  });
};

export const useAdminCourses = (page: number = 1, pageSize: number = 5) => {
  return useQuery({
    queryKey: ["admin-courses", page, pageSize],
    queryFn: async () => await courseService.getAllCourses(page, pageSize),
  });
};

export const useTraineeCourses = (page: number = 1, pageSize: number = 5) => {
  return useQuery({
    queryKey: ["trainee-courses", page, pageSize],
    queryFn: async () =>
      await courseService.getCoursesByTrainee(page, pageSize),
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseForm) =>
      await courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateCourseForm) =>
      await courseService.updateCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: async (courseId: string) =>
      await courseService.deleteCourse(courseId),
  });
};
