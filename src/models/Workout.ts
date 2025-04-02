// models/Workout.ts
import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  exercise: String,
  sets: String,
  reps: String,
  time: String,
  checked: Boolean,
});

const WorkoutSchema = new mongoose.Schema(
  {
    type: String, // "day" or "week"
    completed: Boolean,
    data: [ExerciseSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);
