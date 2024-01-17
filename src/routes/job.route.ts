import express from "express";
import { isAuthenticated, checkJobOwnership } from "../middlewares";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJobById,
  deleteJobById,
  getAllApplicants
} from "../controllers/job.controller";

const router = express.Router();

router.post("/", isAuthenticated, createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.patch("/:id", isAuthenticated, checkJobOwnership, updateJobById);
router.delete("/:id", isAuthenticated, checkJobOwnership, deleteJobById);
router.get("/:id/allApplicants", isAuthenticated, checkJobOwnership, getAllApplicants);

export default router;
