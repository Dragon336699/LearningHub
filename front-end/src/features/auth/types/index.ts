import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email.")
    .max(50, "Email must not exceed 50 characters.")
    .email("Invalid email format."),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "The length of Password should be 8-50 characters.") 
    .max(50, "The length of Password should be 8-50 characters.") 
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Passwords must include uppercase letters, lowercase letters, numbers, and special characters."
    ),
  confirmPassword: z.string().min(1, "Please confirm your password."),
  roleName: z.string().min(1, "Please select role."),
  agreeTerms: z.literal(true, {
    message: "Please read and agree to our terms of service and privacy policies.", 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "The password and confirmation do not match.",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email." })
    .email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(1, { message: "Please enter your password." }),
});