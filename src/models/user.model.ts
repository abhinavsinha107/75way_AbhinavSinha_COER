import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    jobs: {
      type: Array,
      default: [],
    },
    interests: {
      type: Array,
      default: [],
    },
    appliedJobs: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
