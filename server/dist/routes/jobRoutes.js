"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", jobController_1.getJobs);
// Protected routes
router.use(authMiddleware_1.verifyJWT);
// Employer routes
router.post("/", (0, authMiddleware_1.authorizeRoles)("employer"), jobController_1.postJob);
router.put("/:id", (0, authMiddleware_1.authorizeRoles)("employer"), jobController_1.updateJob);
router.delete("/:id", (0, authMiddleware_1.authorizeRoles)("employer"), jobController_1.deleteJob);
router.get("/my-jobs", (0, authMiddleware_1.authorizeRoles)("employer"), jobController_1.getMyJobs);
router.get("/:id/applicants", (0, authMiddleware_1.authorizeRoles)("employer"), jobController_1.getApplicantsForJob);
// Developer routes
router.post("/:id/apply", (0, authMiddleware_1.authorizeRoles)("developer"), jobController_1.applyForJob);
router.get("/applied", (0, authMiddleware_1.authorizeRoles)("developer"), jobController_1.getAppliedJobs);
exports.default = router;
