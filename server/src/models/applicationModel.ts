import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    coverLetter: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
