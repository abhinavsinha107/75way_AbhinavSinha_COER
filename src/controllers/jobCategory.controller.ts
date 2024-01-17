import express from "express";
import JobCategory from "../models/jobCategory.model";

export const createJobCategory = async (req: express.Request, res: express.Response) => {
    try {
        const { categoryName } = req.body;
        const existingJobCategory = await JobCategory.findOne({ categoryName });
        if (existingJobCategory) {
            return res.status(400).json({
                message: "Job category already exists...",
            });
        }
        console.log("Hello1")
        const jobCategory = new JobCategory({ categoryName });
        console.log("Hello2")
        await jobCategory.save();
        console.log("Hello3")
        return res.status(201).json({
            message: "Job category created successfully...",
            jobCategory
        });
    } catch (err: any) {
        console.log(err.message);
        res.status(500).json({
            message: "Error creating job category..."
        });
    }
}

export const getAllJobCategories = async (req: express.Request, res: express.Response) => {
    try {
        const jobCategories = await JobCategory.find({})
        res.status(200).json({
            message: "Job categories fetched successfully...",
            jobCategories,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching job categories...",
        });
    }
};
