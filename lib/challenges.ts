export type SupportedExercise =
  | 'Push-Up'
  | 'Pull-Up'
  | 'Squat'
  | 'Shoulder Press'
  | 'Bicep Curl';

export const SUPPORTED_EXERCISES: SupportedExercise[] = [
  'Push-Up',
  'Pull-Up',
  'Squat',
  'Shoulder Press',
  'Bicep Curl',
];

export type ChallengeExercise = {
  exercise: SupportedExercise;
  reps: number;
};

export type ChallengeDefinition = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeLimit: string;
  reward: number;
  exercises: ChallengeExercise[];
};

const repsFor = (reps: number): ChallengeExercise[] =>
  SUPPORTED_EXERCISES.map((exercise) => ({ exercise, reps }));

export const CHALLENGES: ChallengeDefinition[] = [
  {
    id: 'five-rep',
    title: '5 Rep Challenge',
    description: 'Complete 5 reps of every supported exercise.',
    difficulty: 'Beginner',
    timeLimit: '5 minutes',
    reward: 100,
    exercises: repsFor(5),
  },
  {
    id: 'ten-rep',
    title: '10 Rep Challenge',
    description: 'Complete 10 reps of every supported exercise.',
    difficulty: 'Intermediate',
    timeLimit: '10 minutes',
    reward: 250,
    exercises: repsFor(10),
  },
  {
    id: 'twenty-rep',
    title: '20 Rep Challenge',
    description: 'Complete 20 reps of every supported exercise.',
    difficulty: 'Advanced',
    timeLimit: '15 minutes',
    reward: 500,
    exercises: repsFor(20),
  },
  {
    id: 'thirty-rep',
    title: '30 Rep Challenge',
    description: 'Complete 30 reps of every supported exercise.',
    difficulty: 'Expert',
    timeLimit: '20 minutes',
    reward: 1000,
    exercises: repsFor(30),
  },
];

export function getChallengeById(id: string): ChallengeDefinition | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}

export function isChallengeComplete(
  challenge: ChallengeDefinition,
  repsByExercise: Partial<Record<SupportedExercise, number>>
): boolean {
  return challenge.exercises.every(({ exercise, reps }) => (repsByExercise[exercise] || 0) >= reps);
}
