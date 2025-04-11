import mongoose from "mongoose";

const WeightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: String, // ISO format date e.g. "2025-04-11"
    weight: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Weight || mongoose.model("Weight", WeightSchema);
