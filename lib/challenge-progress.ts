import { Types } from 'mongoose';
import { User } from '@/models/user';
import { Workout } from '@/models/workout';
import { getChallengeById, isChallengeComplete, SupportedExercise } from '@/lib/challenges';
import { invalidateCache } from '@/lib/redis';
import { logError } from '@/lib/logger';

export async function evaluateChallenges(userId: string) {
  try {
    const user = await User.findById(userId).select('challenges').lean();
    const activeChallenges = (user?.challenges || []).filter((challenge) => !challenge.completedAt);

    for (const userChallenge of activeChallenges) {
      const definition = getChallengeById(userChallenge.challengeId);
      if (!definition) continue;

      const rows = await Workout.aggregate<{ _id: SupportedExercise; reps: number }>([
        {
          $match: {
            user: new Types.ObjectId(userId),
            createdAt: { $gte: new Date(userChallenge.startedAt) },
          },
        },
        { $group: { _id: '$exercise', reps: { $sum: '$reps' } } },
      ]);

      const repsByExercise: Partial<Record<SupportedExercise, number>> = {};
      for (const row of rows) {
        repsByExercise[row._id] = row.reps;
      }

      if (!isChallengeComplete(definition, repsByExercise)) continue;

      const claimed = await User.findOneAndUpdate(
        {
          _id: userId,
          challenges: { $elemMatch: { _id: userChallenge._id, completedAt: { $exists: false } } },
        },
        {
          $set: { 'challenges.$.completedAt': new Date() },
          $inc: { token: definition.reward },
        },
        { new: true }
      );

      if (claimed) {
        await invalidateCache('leaderboard:top:*');
      }
    }
  } catch (error) {
    logError('Failed to evaluate challenges', error, { userId });
  }
}
