import express from "express";
import { deleteUser, getAllUsers, updateUser, createInterest } from "../controllers/user.controller";
import { isAuthenticated, isOwner } from "../middlewares";

const router = express.Router();

router.get("/getAllUsers", isAuthenticated, getAllUsers);
router.patch("/updateUser/:id", isAuthenticated, isOwner, updateUser);
router.delete("/deleteUser/:id", isAuthenticated, isOwner, deleteUser);
router.post("/createInterest/:id", isAuthenticated, isOwner, createInterest);

export default router;
