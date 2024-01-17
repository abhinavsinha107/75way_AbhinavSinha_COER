import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    peopleApplied: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const Job = mongoose.model('job', jobSchema);

export default Job;