import { NextRequest } from 'next/server';
import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { Workout } from '@/models/workout';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess, getClientIp, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { calculateWorkoutReward, MAX_DAILY_REPS, MAX_REPS_PER_SUBMISSION } from '@/lib/rewards';
import { evaluateChallenges } from '@/lib/challenge-progress';
import { invalidateCache } from '@/lib/redis';
import { isRecord, parsePositiveInteger } from '@/lib/validation';
import { SUPPORTED_EXERCISES, SupportedExercise } from '@/lib/challenges';
import { logError } from '@/lib/logger';

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    const limited = await isRateLimited(`workout:${user._id}:${getClientIp(request)}`, {
      limit: 60,
      windowSeconds: 60,
      failClosed: false,
    });
    if (limited) {
      return apiError(429, 'Too many workout submissions. Please slow down.');
    }

    const body = await readJson(request);
    if (!isRecord(body)) {
      return apiError(400, 'Invalid request body');
    }

    const clientWorkoutId = body.clientWorkoutId;
    const exercise = body.exercise;
    const reps = parsePositiveInteger(body.reps, MAX_REPS_PER_SUBMISSION);

    if (
      typeof clientWorkoutId !== 'string' ||
      clientWorkoutId.length < 8 ||
      clientWorkoutId.length > 100
    ) {
      return apiError(400, 'A valid clientWorkoutId is required');
    }

    if (
      typeof exercise !== 'string' ||
      !SUPPORTED_EXERCISES.includes(exercise as SupportedExercise)
    ) {
      return apiError(400, 'Unsupported exercise');
    }

    if (reps === null) {
      return apiError(400, `reps must be an integer between 1 and ${MAX_REPS_PER_SUBMISSION}`);
    }

    await connectDB();

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const [todaysTotals] = await Workout.aggregate<{ total: number }>([
      { $match: { user: user._id, createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: '$reps' } } },
    ]);

    if ((todaysTotals?.total || 0) + reps > MAX_DAILY_REPS) {
      return apiError(429, 'Daily workout limit reached');
    }

    const reward = calculateWorkoutReward(reps);

    try {
      await Workout.create({
        user: user._id,
        clientWorkoutId,
        exercise,
        reps,
        ...reward,
      });
    } catch (error) {
      if (isRecord(error) && error.code === 11000) {
        return apiSuccess({ message: 'Workout already recorded', alreadyProcessed: true });
      }
      throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { calories: reward.calories, points: reward.points, tokens: reward.tokens } },
      { new: true }
    )
      .select('calories points token')
      .lean();

    await evaluateChallenges(user._id.toString());
    await invalidateCache('leaderboard:top:*');

    return apiSuccess({
      message: 'Workout recorded',
      reward,
      totals: updatedUser
        ? { calories: updatedUser.calories, points: updatedUser.points, tokens: updatedUser.token }
        : undefined,
    });
  } catch (error) {
    logError('Error recording workout', error);
    return apiError(500, 'Unable to record workout');
  }
}
