import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  provider?: 'credentials' | 'google';
  emailVerified?: Date;
  image?: string;
  points: number;
  token: number;
  calories: number;
  challenges: IUserChallenge[];
  customPoses: IPose[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserChallenge {
  _id?: mongoose.Types.ObjectId;
  challengeId: string;
  startedAt: Date;
  completedAt?: Date;
  progress?: number;
}

export interface IPose {
  name?: string;
  keypoints: {
    x: number;
    y: number;
    z?: number;
    score?: number;
    name?: string;
  }[];
  createdAt: Date;
}

const userChallengeSchema = new mongoose.Schema<IUserChallenge>({
  challengeId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  progress: { type: Number, default: 0 },
});

const poseSchema = new mongoose.Schema<IPose>({
  name: { type: String, maxlength: 80 },
  keypoints: [{
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number },
    score: { type: Number, min: 0, max: 1 },
    name: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, trim: true, maxlength: 80 },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    select: false,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  emailVerified: Date,
  image: {
    type: String,
    default: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  calories: {
    type: Number,
    default: 0,
    min: 0,
  },
  token: {
    type: Number,
    default: 0,
    min: 0,
  },
  challenges: [userChallengeSchema],
  customPoses: [poseSchema],
}, {
  collection: 'fitvibe_users',
  timestamps: true,
});

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', userSchema);
