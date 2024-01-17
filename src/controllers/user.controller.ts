import express from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user.model"
import JobCategory from "../models/jobCategory.model";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    await User.findByIdAndUpdate(req.params.id, {
      $set: {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName,
      },
    });
    return res.status(201).json({
        message: "Update Successfull..."
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({_id: id});
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    return res.status(201).json({message: "User deleted successfully..."});
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const createInterest = async (req: express.Request, res: express.Response) => {
  try {
    const { interests } = req.body;
    const existingJobCategory = await JobCategory.findOne({ categoryName: `${interests}` }).exec();
    if (!existingJobCategory) {
      return res.status(400).json({
        message: "Job category does not exists...",
      });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found...",
      });
    }
    if (user.interests.indexOf(existingJobCategory._id) > -1) {
      return res.status(400).json({
        message: "This job interest already exists..."
      })
    }
    user.interests.push(existingJobCategory._id);
    existingJobCategory.interestedUsers.push(user.email);
    await user.save();
    await existingJobCategory.save();
    res.status(201).json({
      message: "Job interest updated successfully..."
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating job interest..."
    });
  }
}