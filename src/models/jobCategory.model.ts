import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
    interestedUsers: {
        type: Array,
        default: []
    }
})

const JobCategory = mongoose.model("jobCategory", jobCategorySchema);

export default JobCategory;