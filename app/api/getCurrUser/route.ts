import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api';
import { calculatePercentile } from '@/lib/rewards';
import { logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    await connectDB();

    const [higherRankedUsers, lowerRankedUsers, totalUsers] = await Promise.all([
      User.countDocuments({ points: { $gt: user.points } }),
      User.countDocuments({ points: { $lt: user.points } }),
      User.countDocuments(),
    ]);

    const rank = higherRankedUsers + 1;
    const percentile = calculatePercentile(totalUsers, lowerRankedUsers);

    return apiSuccess({
      data: {
        user: {
          name: user.name,
          points: user.points,
          calories: user.calories ?? 0,
          tokens: user.token ?? 0,
        },
        rank,
        totalUsers,
        percentile,
      },
    });
  } catch (error) {
    logError('Error fetching user rank', error);
    return apiError(500, 'Failed to fetch user data');
  }
}
