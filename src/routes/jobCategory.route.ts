import express from "express";
import { isAuthenticated } from "../middlewares";
import { createJobCategory, getAllJobCategories } from "../controllers/jobCategory.controller";

const router = express.Router();

router.get("/allJobCategories", getAllJobCategories)
router.post("/createJobCategory", isAuthenticated, createJobCategory)

export default router;