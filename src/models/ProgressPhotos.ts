import mongoose from "mongoose";

const ProgressPhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["front", "back"], required: true },
  date: { type: String, required: true },
});

export default mongoose.models.ProgressPhoto || mongoose.model("ProgressPhoto", ProgressPhotoSchema);
