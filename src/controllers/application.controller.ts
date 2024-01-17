import express from "express";
import User from "../models/user.model";
import Job from "../models/job.model";

export const applyOnJobByJobId = async (req: express.Request, res: express.Response) => {
    try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found...",
      });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found...",
      });
    }
    if(job.peopleApplied.indexOf(user._id) > -1) {
        return res.status(400).json({
            message: "You have already applied for this job..."
        })
    }
    job.peopleApplied.push(user._id);
    await job.save();
    user.appliedJobs.push(job._id);
    await user.save();
    res.status(201).json({
      message: "Applied on job successfully...",
      job
    });
  } catch (err) {
    res.status(500).json({
        message: "Error applying on job by id..."
    });
  }
}