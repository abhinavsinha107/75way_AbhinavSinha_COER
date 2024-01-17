import express from "express";
import Job from "../models/job.model";
import User from "../models/user.model"
import JobCategory from "../models/jobCategory.model";
import nodemailer from "nodemailer"

export const createJob = async (req: express.Request, res: express.Response) => {
  // Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD,
    },
  });
  try {
    const { title, description, categoryName } = req.body;
    const existingJobCategory = await JobCategory.findOne({ categoryName });
    if (!existingJobCategory) {
      return res.status(400).json({
        message: "Create Job category first...",
      });
    }
    const interestedUsers = existingJobCategory.interestedUsers;
    const job = new Job({
      title,
      description,
      categoryName,
      owner: req.userId,
    });
    await job.save();
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found...",
      });
    }
    user.jobs.push(job._id);
    await user.save();
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: interestedUsers,
      subject: "New Job Posted",
      text: `A new job of your interest has been posted.`,
    };
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error Sending email..."
        });
      }
    });
    return res.status(201).json({
      message: "Job created successfully and email sent securely...",
      job
    });
  } catch (err) {
    res.status(500).json({
        message: "Error creating job..."
    });
  }
};

export const getAllJobs = async (req: express.Request, res: express.Response) => {
  try {
    const search = req.body.search || ""; // Default to an empty string if 'search' is not provided
    const page = parseInt(req.body.page) || 1; // Default to page 1 if 'page' is not provided or is invalid
    const perPage = 10; // Number of jobs per page
    // Build the search query using regular expressions for case-insensitive search
    const searchQuery = new RegExp(search, "i");
    // Count the total number of jobs that match the search query
    const totalJobs = await Job.countDocuments({ title: searchQuery });
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalJobs / perPage);
    // Ensure 'page' is within valid range
    if (page < 1 || page > totalPages) {
      return res.status(400).json({
        message: "Invalid page number",
      });
    }
    // Calculate the number of jobs to skip
    const skip = (page - 1) * perPage;
    // Fetch the jobs that match the search query for the specified page
    const jobs = await Job.find({ title: searchQuery })
      .sort({ createdAt: -1 }) // Sort by the latest jobs
      .skip(skip)
      .limit(perPage);
    res.status(200).json({
      message: "Jobs fetched successfully...",
      jobs,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({
        message: "Error fetching jobs...",
    });
  }
};

export const getJobById = async (req: express.Request, res: express.Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found...",
      });
    }
    res.status(200).json({ message: "Job fetched successfully", job });
  } catch (err) {
    res.status(500).json({
        message: "Error fetching job by id..."
    });
  }
};

export const updateJobById = async (req: express.Request, res: express.Response) => {
  try {
    const { title, description } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found...",
      });
    }
    res.status(200).json({
      message: "Job updated successfully...",
      updatedJob
    });
  } catch (err) {
    res.status(500).json({
        message: "Error updating job..."
    });
  }
};

export const deleteJobById = async (req: express.Request, res: express.Response) => {
  try {
    // Find the job by ID and delete it
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({
        message: "Job not found...",
      });
    }
    // Remove the deleted job ID from the user's jobs array
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found...",
      });
    }
    const jobIndex = user.jobs.indexOf(req.params.id);
    if (jobIndex !== -1) {
      user.jobs.splice(jobIndex, 1);
      await user.save();
    }
    res.status(200).json({
      message: "Job deleted successfully...",
    });
  } catch (err) {
    res.status(500).json({
        message: "Error deleting job"
    });
  }
};

export const getAllApplicants = async (req: express.Request, res: express.Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found...",
      });
    }
    res.status(200).json({ message: "Applicants fetched successfully...", applicants: job.peopleApplied });
  } catch (err) {
    res.status(500).json({
        message: "Error fetching Applicants..."
    });
  }
}