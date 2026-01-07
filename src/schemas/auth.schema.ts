import { z } from "zod";

// Schema for signup
export const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["user", "admin"]).default("user"),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


// Schema for login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});