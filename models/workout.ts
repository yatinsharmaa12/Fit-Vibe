import mongoose, { Document, Types } from 'mongoose';
import { SUPPORTED_EXERCISES, SupportedExercise } from '@/lib/challenges';

export interface IWorkout extends Document {
  user: Types.ObjectId;
  clientWorkoutId: string;
  exercise: SupportedExercise;
  reps: number;
  calories: number;
  points: number;
  tokens: number;
  createdAt: Date;
}

const workoutSchema = new mongoose.Schema<IWorkout>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  clientWorkoutId: { type: String, required: true },
  exercise: { type: String, enum: SUPPORTED_EXERCISES, required: true },
  reps: { type: Number, required: true, min: 1, max: 1000 },
  calories: { type: Number, required: true, min: 0 },
  points: { type: Number, required: true, min: 0 },
  tokens: { type: Number, required: true, min: 0 },
}, {
  collection: 'fitvibe_workouts',
  timestamps: { createdAt: true, updatedAt: false },
});

workoutSchema.index({ user: 1, clientWorkoutId: 1 }, { unique: true });
workoutSchema.index({ user: 1, exercise: 1, createdAt: 1 });

export const Workout =
  (mongoose.models.Workout as mongoose.Model<IWorkout>) ||
  mongoose.model<IWorkout>('Workout', workoutSchema);
