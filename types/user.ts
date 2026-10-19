import { Types } from 'mongoose';

export interface IUserChallengeLean {
  challengeId: string;
  startedAt: Date;
  completedAt?: Date;
  progress?: number;
}

export interface IPoseLean {
  _id?: Types.ObjectId;
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

export interface IUserLean {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password?: string;
  provider?: 'credentials' | 'google';
  token?: number;
  points: number;
  calories?: number;
  challenges?: IUserChallengeLean[];
  customPoses?: IPoseLean[];
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: Date;
}

export interface IUserResponse {
  success: boolean;
  data?: {
    user: {
      name?: string;
      points: number;
      calories: number;
      tokens: number;
    };
    rank: number;
    totalUsers: number;
    percentile: number;
  };
  message?: string;
  error?: string;
}
