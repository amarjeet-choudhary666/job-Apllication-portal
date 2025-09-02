"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyJobSchema = exports.postJobSchema = void 0;
const zod_1 = require("zod");
exports.postJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    skills: zod_1.z.array(zod_1.z.string()).min(1, "At least one skill is required"),
    salary: zod_1.z.number().positive("Salary must be positive"),
    location: zod_1.z.string().min(1, "Location is required"),
});
exports.applyJobSchema = zod_1.z.object({
    coverLetter: zod_1.z.string().optional(),
});
