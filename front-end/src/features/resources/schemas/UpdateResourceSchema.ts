import z from "zod";

const VIDEO_EXT = ["mp4", "mov"];
const TEXT_EXT = ["pdf", "doc", "docx", "txt"];

const MAX_TEXT_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

export const UpdateResourceSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(100, "Title must not exceed 100 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(500, "Description must not exceed 500 characters."),
  courseId: z.string(),
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        const ext = file.name.split(".").pop()?.toLocaleLowerCase();
        return ext && [...VIDEO_EXT, ...TEXT_EXT].includes(ext);
      },
      {
        message:
          "Invalid file type. Allowed types are: pdf, doc, docx, txt, mov, mp4.",
      },
    )
    .superRefine((file, ctx) => {
      const ext = file.name.split(".").pop()?.toLocaleLowerCase();

      if (!ext) return;

      if (TEXT_EXT.includes(ext) && file.size > MAX_TEXT_SIZE) {
        ctx.addIssue({
          code: "custom",
          message: "Text file must not exceed 5MB.",
        });
      }

      if (VIDEO_EXT.includes(ext) && file.size > MAX_VIDEO_SIZE) {
        ctx.addIssue({
          code: "custom",
          message: "Video file must not exceed 10MB.",
        });
      }

      if (file.size === 0) {
        ctx.addIssue({
          code: "custom",
          message: "File size must be larger than 0 byte.",
        });
      }
    })
    .optional(),
});

export type UpdateResourceForm = z.infer<typeof UpdateResourceSchema>;
