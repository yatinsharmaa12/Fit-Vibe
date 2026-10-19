import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api';
import { getCached } from '@/lib/redis';
import { logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const LEADERBOARD_LIMIT = 5;

async function fetchTopUsers() {
  await connectDB();
  const users = await User.find({})
    .select('name points createdAt image')
    .sort({ points: -1, createdAt: 1 })
    .limit(LEADERBOARD_LIMIT)
    .lean();

  return users.map((user) => ({
    name: user.name || 'Anonymous',
    points: user.points || 0,
    createdAt: user.createdAt,
    image: user.image,
  }));
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    const users = await getCached(`leaderboard:top:${LEADERBOARD_LIMIT}`, fetchTopUsers, 60);

    return apiSuccess({
      message: 'Top users fetched successfully',
      users,
      count: users.length,
    });
  } catch (error) {
    logError('Error fetching top users', error);
    return apiError(500, 'Failed to fetch top users');
  }
}
