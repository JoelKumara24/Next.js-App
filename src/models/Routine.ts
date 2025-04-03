import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  exercise: String,
  sets: String,
  reps: String,
  time: String,
  checked: Boolean,
});

const RoutineSchema = new mongoose.Schema(
  {
    days: [[ExerciseSchema]],
    currentDayIndex: {
      type: Number,
      default: 0,
    },
    // Optional: store user ID if auth
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.models.Routine || mongoose.model("Routine", RoutineSchema);
