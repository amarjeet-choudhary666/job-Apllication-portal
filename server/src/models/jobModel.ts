import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  skills: string[];
  salary: number;
  location: string;
  employer: mongoose.Types.ObjectId;
  applicants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [{
      type: String,
      required: true,
    }],
    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
