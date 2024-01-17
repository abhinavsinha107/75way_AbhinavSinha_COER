import express from "express";
import { applyOnJobByJobId } from "../controllers/application.controller";
import {isAuthenticated} from "../middlewares"

const router = express.Router();

router.post("/:id", isAuthenticated, applyOnJobByJobId);

export default router;