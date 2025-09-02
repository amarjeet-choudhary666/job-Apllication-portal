import { Request, Response } from "express";
import { Job } from "../models/jobModel";
import { Application } from "../models/applicationModel";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { postJobSchema, applyJobSchema } from "../validation/jobValidation";
import mongoose from "mongoose";

// Employer posts a new job
export const postJob = asyncHandler(async (req: Request, res: Response) => {
  const result = postJobSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.format()
    });
  }

  const { title, description, skills, salary, location } = result.data;
  const employerId = (req as any).user._id;

  const job = await Job.create({
    title,
    description,
    skills,
    salary,
    location,
    employer: employerId,
  });

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});

// Employer edits a job
export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const employerId = (req as any).user._id;

  const job = await Job.findOne({ _id: jobId, employer: employerId });
  if (!job) {
    throw new ApiError(404, "Job not found or you do not have permission to edit");
  }

  Object.assign(job, req.body);
  await job.save();

  return res.status(200).json(new ApiResponse(200, job, "Job updated successfully"));
});

// Employer deletes a job
export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const employerId = (req as any).user._id;

  const job = await Job.findOneAndDelete({ _id: jobId, employer: employerId });
  if (!job) {
    throw new ApiError(404, "Job not found or you do not have permission to delete");
  }

  return res.status(200).json(new ApiResponse(200, null, "Job deleted successfully"));
});

// Developer browses jobs with filters and pagination
export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const { skills, salaryMin, salaryMax, location, page = 1, limit = 10 } = req.query;

  const filter: any = {};

  if (skills) {
    const skillsArray = (skills as string).split(",").map(s => s.trim());
    filter.skills = { $all: skillsArray };
  }

  if (salaryMin || salaryMax) {
    filter.salary = {};
    if (salaryMin) filter.salary.$gte = Number(salaryMin);
    if (salaryMax) filter.salary.$lte = Number(salaryMax);
  }

  if (location) {
    filter.location = { $regex: new RegExp(location as string, "i") };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .populate("employer", "name email");

  const total = await Job.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  );
});

// Developer applies for a job
export const applyForJob = asyncHandler(async (req: Request, res: Response) => {
  const result = applyJobSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.format()
    });
  }

  const jobId = req.params.id;
  const applicantId = (req as any).user._id;
  const { coverLetter } = result.data;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check if already applied
  const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const application = await Application.create({
    job: jobId,
    applicant: applicantId,
    coverLetter,
  });

  // Add applicant to job's applicants array
  job.applicants.push(applicantId);
  await job.save();

  return res.status(201).json(new ApiResponse(201, application, "Applied successfully"));
});

// Employer views applicants for a job
export const getApplicantsForJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const employerId = (req as any).user._id;

  const job = await Job.findOne({ _id: jobId, employer: employerId }).populate({
    path: "applicants",
    select: "name email phone avatar",
  });

  if (!job) {
    throw new ApiError(404, "Job not found or you do not have permission to view applicants");
  }

  return res.status(200).json(new ApiResponse(200, job.applicants, "Applicants retrieved successfully"));
});

// Employer views their own jobs
export const getMyJobs = asyncHandler(async (req: Request, res: Response) => {
  const employerId = (req as any).user._id;

  const jobs = await Job.find({ employer: employerId }).populate("employer", "name email");

  return res.status(200).json(new ApiResponse(200, jobs, "My jobs retrieved successfully"));
});

// Developer views their applied jobs
export const getAppliedJobs = asyncHandler(async (req: Request, res: Response) => {
  const applicantId = (req as any).user._id;

  const applications = await Application.find({ applicant: applicantId }).populate({
    path: "job",
    populate: { path: "employer", select: "name email" },
  });

  return res.status(200).json(new ApiResponse(200, applications, "Applied jobs retrieved successfully"));
});
