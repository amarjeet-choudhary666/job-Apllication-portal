"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.loginUser = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
// Schema for user registration
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be less than 50 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    role: zod_1.z.enum(["admin", "employer", "developer"]).default("developer"),
    phone: zod_1.z.number().optional(),
    avatar: zod_1.z.string().url("Avatar must be a valid URL").optional(),
});
// Schema for user login
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.loginUser = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string()
        .min(6, "password must be atlest 6 character long")
});
// Export the main user schema for backward compatibility
exports.userSchema = exports.registerUserSchema;
