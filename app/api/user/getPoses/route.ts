import connectDB from '@/utils/db';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api';
import { logError } from '@/lib/logger';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    await connectDB();

    return apiSuccess({
      message: 'Poses retrieved successfully',
      poses: user.customPoses || [],
    });
  } catch (error) {
    logError('Error retrieving poses', error);
    return apiError(500, 'Unable to retrieve poses');
  }
}
