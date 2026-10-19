export const MAX_REPS_PER_SUBMISSION = 1000;
export const MAX_DAILY_REPS = 2000;

export type WorkoutReward = {
  calories: number;
  points: number;
  tokens: number;
};

export function calculateWorkoutReward(reps: number): WorkoutReward {
  if (!Number.isInteger(reps) || reps <= 0 || reps > MAX_REPS_PER_SUBMISSION) {
    throw new Error('Invalid rep count');
  }

  const calories = reps * 5;
  return {
    calories,
    points: calories / 5,
    tokens: reps * 10,
  };
}

/**
 * Percentage of users with strictly fewer points than this user.
 * Returns 0 for an empty collection and a value between 0 and 100.
 */
export function calculatePercentile(totalUsers: number, usersWithFewerPoints: number): number {
  if (!Number.isFinite(totalUsers) || totalUsers <= 0) return 0;
  const lower = Math.max(0, Math.min(totalUsers, usersWithFewerPoints));
  return Math.round((lower / totalUsers) * 1000) / 10;
}
