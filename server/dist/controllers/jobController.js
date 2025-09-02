"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppliedJobs = exports.getMyJobs = exports.getApplicantsForJob = exports.applyForJob = exports.getJobs = exports.deleteJob = exports.updateJob = exports.postJob = void 0;
const jobModel_1 = require("../models/jobModel");
const applicationModel_1 = require("../models/applicationModel");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jobValidation_1 = require("../validation/jobValidation");
// Employer posts a new job
exports.postJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = jobValidation_1.postJobSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const { title, description, skills, salary, location } = result.data;
    const employerId = req.user._id;
    const job = await jobModel_1.Job.create({
        title,
        description,
        skills,
        salary,
        location,
        employer: employerId,
    });
    return res.status(201).json(new apiResponse_1.ApiResponse(201, job, "Job posted successfully"));
});
// Employer edits a job
exports.updateJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const jobId = req.params.id;
    const employerId = req.user._id;
    const job = await jobModel_1.Job.findOne({ _id: jobId, employer: employerId });
    if (!job) {
        throw new apiError_1.ApiError(404, "Job not found or you do not have permission to edit");
    }
    Object.assign(job, req.body);
    await job.save();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, job, "Job updated successfully"));
});
// Employer deletes a job
exports.deleteJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const jobId = req.params.id;
    const employerId = req.user._id;
    const job = await jobModel_1.Job.findOneAndDelete({ _id: jobId, employer: employerId });
    if (!job) {
        throw new apiError_1.ApiError(404, "Job not found or you do not have permission to delete");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, "Job deleted successfully"));
});
// Developer browses jobs with filters and pagination
exports.getJobs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { skills, salaryMin, salaryMax, location, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (skills) {
        const skillsArray = skills.split(",").map(s => s.trim());
        filter.skills = { $all: skillsArray };
    }
    if (salaryMin || salaryMax) {
        filter.salary = {};
        if (salaryMin)
            filter.salary.$gte = Number(salaryMin);
        if (salaryMax)
            filter.salary.$lte = Number(salaryMax);
    }
    if (location) {
        filter.location = { $regex: new RegExp(location, "i") };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const jobs = await jobModel_1.Job.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("employer", "name email");
    const total = await jobModel_1.Job.countDocuments(filter);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {
        jobs,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
    }));
});
// Developer applies for a job
exports.applyForJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = jobValidation_1.applyJobSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const jobId = req.params.id;
    const applicantId = req.user._id;
    const { coverLetter } = result.data;
    const job = await jobModel_1.Job.findById(jobId);
    if (!job) {
        throw new apiError_1.ApiError(404, "Job not found");
    }
    // Check if already applied
    const existingApplication = await applicationModel_1.Application.findOne({ job: jobId, applicant: applicantId });
    if (existingApplication) {
        throw new apiError_1.ApiError(400, "You have already applied for this job");
    }
    const application = await applicationModel_1.Application.create({
        job: jobId,
        applicant: applicantId,
        coverLetter,
    });
    // Add applicant to job's applicants array
    job.applicants.push(applicantId);
    await job.save();
    return res.status(201).json(new apiResponse_1.ApiResponse(201, application, "Applied successfully"));
});
// Employer views applicants for a job
exports.getApplicantsForJob = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const jobId = req.params.id;
    const employerId = req.user._id;
    const job = await jobModel_1.Job.findOne({ _id: jobId, employer: employerId }).populate({
        path: "applicants",
        select: "name email phone avatar",
    });
    if (!job) {
        throw new apiError_1.ApiError(404, "Job not found or you do not have permission to view applicants");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, job.applicants, "Applicants retrieved successfully"));
});
// Employer views their own jobs
exports.getMyJobs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const employerId = req.user._id;
    const jobs = await jobModel_1.Job.find({ employer: employerId }).populate("employer", "name email");
    return res.status(200).json(new apiResponse_1.ApiResponse(200, jobs, "My jobs retrieved successfully"));
});
// Developer views their applied jobs
exports.getAppliedJobs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const applicantId = req.user._id;
    const applications = await applicationModel_1.Application.find({ applicant: applicantId }).populate({
        path: "job",
        populate: { path: "employer", select: "name email" },
    });
    return res.status(200).json(new apiResponse_1.ApiResponse(200, applications, "Applied jobs retrieved successfully"));
});
