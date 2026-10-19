import { NextRequest } from 'next/server';
import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess, readJson } from '@/lib/api';
import { isRecord, validatePoseKeypoints } from '@/lib/validation';
import { logError } from '@/lib/logger';

const MAX_CUSTOM_POSES = 50;

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    const body = await readJson(req);
    if (!isRecord(body) || !isRecord(body.poseData)) {
      return apiError(400, 'poseData is required');
    }

    const keypoints = validatePoseKeypoints(body.poseData.keypoints);
    if (!keypoints) {
      return apiError(400, 'Invalid pose data: 17 reliable keypoints are required');
    }

    const rawName = body.poseData.name;
    const name =
      typeof rawName === 'string' && rawName.trim().length > 0
        ? rawName.trim().slice(0, 80)
        : undefined;

    if ((user.customPoses?.length || 0) >= MAX_CUSTOM_POSES) {
      return apiError(409, 'Custom pose limit reached');
    }

    await connectDB();

    const pose = { name, keypoints, createdAt: new Date() };
    await User.findByIdAndUpdate(user._id, { $push: { customPoses: pose } });

    return apiSuccess({ message: 'Pose saved successfully', pose });
  } catch (error) {
    logError('Error saving pose', error);
    return apiError(500, 'Unable to save pose');
  }
}
