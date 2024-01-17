import express from "express";
import { isAuthenticated } from "../middlewares";
import { createInterest } from "../controllers/createInterest.controller";

const router = express.Router();

export default router;