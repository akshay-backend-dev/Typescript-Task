"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(["user", "admin"]).default("user"),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
