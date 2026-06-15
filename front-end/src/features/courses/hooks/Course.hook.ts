import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { courseService } from "../services/Course.service";
import { CreateCourseForm } from "../schemas/CreateCourseSchema";
import { UpdateCourseForm } from "../schemas/UpdateCourseSchema";
import { CourseOption } from "../../resources/modals/CreateResourceModal";
import { GroupBase, OptionsOrGroups } from "react-select";

export const useMentorCourses = (page: number = 1, pageSize: number = 5, keyword ?: string) => {
  return useQuery({
    queryKey: ["mentor-courses", page, pageSize, keyword],
    queryFn: async () => await courseService.getCoursesByMentor(page, pageSize, keyword),
  });
};

export const useLoadCourseOptions = () => {
  const loadCourseOptions = async (
    search: string,
    loadedOptions: OptionsOrGroups<CourseOption, GroupBase<CourseOption>>,
    additional?: { page: number }
  ) => {
    const page = additional?.page ?? 1;
    const response = await courseService.getCoursesByMentor(page, 10, search);

    return {
      options: response.items.map((course) => ({
        value: course.id,
        label: course.title,
      })),
      hasMore: loadedOptions.length + response.items.length < response.totalCount,
      additional: { page: page + 1 },
    };
  };

  return { loadCourseOptions };
};

export const useAdminCourses = (page: number = 1, pageSize: number = 5, keyword: string) => {
  return useQuery({
    queryKey: ["admin-courses", page, pageSize, keyword],
    queryFn: async () => await courseService.getAllCourses(page, pageSize, keyword),
  });
};

export const useTraineeCourses = (page: number = 1, pageSize: number = 5, keyword: string) => {
  return useQuery({
    queryKey: ["trainee-courses", page, pageSize, keyword],
    queryFn: async () =>
      await courseService.getCoursesByTrainee(page, pageSize, keyword),
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
