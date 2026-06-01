import z from "zod";

export const UpdateCourseForm = z.object({
    id: z.string(),
    title: z.string().trim().min(1, "Title is required").max(100, "Title must not exceed 100 characters"),
    description: z.string().trim().min(1, "Description is required").max(500, "Description must not exceed 500 characters"),
    learningObjectives: z.string().trim().max(200, "Learning objectives must not exceed 200 characters").optional(),
})

export type UpdateCourseForm = z.infer<typeof UpdateCourseForm>