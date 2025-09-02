import { z } from "zod";

export const postJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  salary: z.number().positive("Salary must be positive"),
  location: z.string().min(1, "Location is required"),
});

export const applyJobSchema = z.object({
  coverLetter: z.string().optional(),
});
