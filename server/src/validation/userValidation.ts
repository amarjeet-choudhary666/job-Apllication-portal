import { z } from "zod";

// Schema for user registration
export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "employer", "developer"]).default("developer"),
  phone: z.number().optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

// Schema for user login
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});


export const loginUser = z.object({
  email: z.string().email("Invalid email"),
  password: z.string()
  .min(6, "password must be atlest 6 character long")
})

// Export the main user schema for backward compatibility
export const userSchema = registerUserSchema;