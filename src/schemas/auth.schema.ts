import { z } from "zod";

// Schema for signup
export const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    address: z.string().min(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords not match",
    path: ["confirmPassword"],
  });

// Schema for login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});