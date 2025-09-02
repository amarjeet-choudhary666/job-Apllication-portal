import { Router } from "express";
import {
  postJob,
  updateJob,
  deleteJob,
  getJobs,
  applyForJob,
  getApplicantsForJob,
  getMyJobs,
  getAppliedJobs,
} from "../controllers/jobController";
import { verifyJWT, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", getJobs);

// Protected routes
router.use(verifyJWT);

// Employer routes
router.post("/", authorizeRoles("employer"), postJob);
router.put("/:id", authorizeRoles("employer"), updateJob);
router.delete("/:id", authorizeRoles("employer"), deleteJob);
router.get("/my-jobs", authorizeRoles("employer"), getMyJobs);
router.get("/:id/applicants", authorizeRoles("employer"), getApplicantsForJob);

// Developer routes
router.post("/:id/apply", authorizeRoles("developer"), applyForJob);
router.get("/applied", authorizeRoles("developer"), getAppliedJobs);

export default router;
