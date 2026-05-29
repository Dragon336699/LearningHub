import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "Please enter your email.").email("Invalid email format."),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password."),
  roleName: z.string().min(1, "Please select role."),
  agreeTerms: z.literal(true, {
    message: "You must agree with our term of services and policies.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirmation password does not match.",
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

export const verifyOtpSchema = z.object({
  otpCode: z
    .string()
    .length(6, { message: "OTP must be 6 characters." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
});