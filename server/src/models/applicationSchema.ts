import { Schema, model, Document, Types } from "mongoose";

export type ApplicationStatus = "applied" | "reviewing" | "interview" | "rejected" | "hired";

export interface IApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    coverLetter: String,
    resumeUrl: String,
    status: { type: String, enum: ["applied", "reviewing", "interview", "rejected", "hired"], default: "applied" },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = model<IApplication>("Application", ApplicationSchema);
