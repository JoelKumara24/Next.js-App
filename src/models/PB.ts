import mongoose from "mongoose";

const PBSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exercise: { type: String, required: true },
  weight: { type: Number, required: true },
  date: { type: String, required: true }
});

export default mongoose.models.PB || mongoose.model("PB", PBSchema);
