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
       // Optional: store user ID if auth
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);
