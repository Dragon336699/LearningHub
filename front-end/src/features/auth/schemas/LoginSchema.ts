import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email." })
    .email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(1, { message: "Please enter your password." }),
});