"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const ApplicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    applicant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    coverLetter: String,
    resumeUrl: String,
    status: { type: String, enum: ["applied", "reviewing", "interview", "rejected", "hired"], default: "applied" },
    appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
exports.Application = (0, mongoose_1.model)("Application", ApplicationSchema);
