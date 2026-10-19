import { NextRequest } from 'next/server';
import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { Workout } from '@/models/workout';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess, readJson } from '@/lib/api';
import { CHALLENGES, getChallengeById, isChallengeComplete, SupportedExercise } from '@/lib/challenges';
import { isRecord } from '@/lib/validation';
import { logError } from '@/lib/logger';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    await connectDB();

    const startedChallenges = user.challenges || [];
    let workouts: Array<{ exercise: SupportedExercise; reps: number; createdAt: Date }> = [];

    if (startedChallenges.length > 0) {
      const earliestStart = new Date(
        Math.min(...startedChallenges.map((challenge) => new Date(challenge.startedAt).getTime()))
      );
      workouts = await Workout.find({ user: user._id, createdAt: { $gte: earliestStart } })
        .select('exercise reps createdAt')
        .lean<Array<{ exercise: SupportedExercise; reps: number; createdAt: Date }>>();
    }

    const challenges = CHALLENGES.map((definition) => {
      const userChallenge = startedChallenges.find((c) => c.challengeId === definition.id);

      if (!userChallenge) {
        return {
          ...definition,
          startedAt: null,
          completedAt: null,
          completed: false,
          progress: definition.exercises.map(({ exercise, reps }) => ({
            exercise,
            reps: 0,
            required: reps,
            completed: false,
          })),
        };
      }

      const startTime = new Date(userChallenge.startedAt).getTime();
      const repsByExercise: Partial<Record<SupportedExercise, number>> = {};
      for (const workout of workouts) {
        if (new Date(workout.createdAt).getTime() < startTime) continue;
        repsByExercise[workout.exercise] = (repsByExercise[workout.exercise] || 0) + workout.reps;
      }

      return {
        ...definition,
        startedAt: userChallenge.startedAt,
        completedAt: userChallenge.completedAt ?? null,
        completed:
          Boolean(userChallenge.completedAt) || isChallengeComplete(definition, repsByExercise),
        progress: definition.exercises.map(({ exercise, reps }) => ({
          exercise,
          reps: repsByExercise[exercise] || 0,
          required: reps,
          completed: (repsByExercise[exercise] || 0) >= reps,
        })),
      };
    });

    return apiSuccess({ challenges });
  } catch (error) {
    logError('Failed to load challenges', error);
    return apiError(500, 'Unable to load challenges');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    const body = await readJson(request);
    const challengeId = isRecord(body) && typeof body.challengeId === 'string' ? body.challengeId : null;

    if (!challengeId || !getChallengeById(challengeId)) {
      return apiError(400, 'Unknown challenge');
    }

    await connectDB();

    const updated = await User.findOneAndUpdate(
      { _id: user._id, 'challenges.challengeId': { $ne: challengeId } },
      {
        $push: {
          challenges: { challengeId, startedAt: new Date(), progress: 0 },
        },
      },
      { new: true }
    )
      .select('challenges')
      .lean();

    if (!updated) {
      return apiSuccess({ message: 'Challenge already started' });
    }

    return apiSuccess({ message: 'Challenge started' });
  } catch (error) {
    logError('Failed to start challenge', error);
    return apiError(500, 'Unable to start challenge');
  }
}
