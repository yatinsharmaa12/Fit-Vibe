import type { SupportedExercise } from '@/lib/challenges';
import { getAngle, Keypoint } from '@/lib/pose';

export type ExerciseKey = 'pushup' | 'pullup' | 'squat' | 'shoulderPress' | 'bicepCurl';

export type CounterState = {
  pushupDown: boolean;
  pullupDown: boolean;
  squatDown: boolean;
  shoulderPressDown: boolean;
  bicepCurlDown: boolean;
};

export type ExerciseEvaluation = {
  countedKey: ExerciseKey | null;
  score: number;
  phase: CounterState;
};

export function createCounterState(): CounterState {
  return {
    pushupDown: false,
    pullupDown: false,
    squatDown: false,
    shoulderPressDown: false,
    bicepCurlDown: false,
  };
}

function clampScore(angle: number, ideal: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - Math.abs(angle - ideal))));
}

/**
 * Evaluates a single frame for the given exercise and returns whether a rep was
 * completed, a heuristic form score and the next phase state.
 *
 * The form score is a threshold-based heuristic, not a biomechanical measurement.
 */
export function evaluateExercise(
  exercise: SupportedExercise,
  keypoints: Keypoint[],
  state: CounterState
): ExerciseEvaluation {
  const next: CounterState = { ...state };
  const leftElbow = getAngle(keypoints, 5, 7, 9);
  const rightElbow = getAngle(keypoints, 6, 8, 10);
  const leftKnee = getAngle(keypoints, 11, 13, 15);
  const rightKnee = getAngle(keypoints, 12, 14, 16);

  switch (exercise) {
    case 'Push-Up': {
      if (leftElbow === null || rightElbow === null) return { countedKey: null, score: 0, phase: next };
      if (leftElbow < 90 && rightElbow < 90) next.pushupDown = true;
      let countedKey: ExerciseKey | null = null;
      if (next.pushupDown && leftElbow > 160 && rightElbow > 160) {
        countedKey = 'pushup';
        next.pushupDown = false;
      }
      const ideal = next.pushupDown ? 90 : 160;
      return { countedKey, score: clampScore((leftElbow + rightElbow) / 2, ideal), phase: next };
    }

    case 'Pull-Up': {
      if (leftElbow === null || rightElbow === null) return { countedKey: null, score: 0, phase: next };
      if (leftElbow > 160 && rightElbow > 160) next.pullupDown = true;
      let countedKey: ExerciseKey | null = null;
      if (next.pullupDown && leftElbow < 50 && rightElbow < 50) {
        countedKey = 'pullup';
        next.pullupDown = false;
      }
      const ideal = next.pullupDown ? 50 : 160;
      return { countedKey, score: clampScore((leftElbow + rightElbow) / 2, ideal), phase: next };
    }

    case 'Squat': {
      if (leftKnee === null || rightKnee === null) return { countedKey: null, score: 0, phase: next };
      if (leftKnee < 90 && rightKnee < 90) next.squatDown = true;
      let countedKey: ExerciseKey | null = null;
      if (next.squatDown && leftKnee > 160 && rightKnee > 160) {
        countedKey = 'squat';
        next.squatDown = false;
      }
      const ideal = next.squatDown ? 90 : 160;
      return { countedKey, score: clampScore((leftKnee + rightKnee) / 2, ideal), phase: next };
    }

    case 'Shoulder Press': {
      if (leftElbow === null || rightElbow === null) return { countedKey: null, score: 0, phase: next };
      if (leftElbow > 130 && rightElbow > 130) next.shoulderPressDown = true;
      let countedKey: ExerciseKey | null = null;
      if (next.shoulderPressDown && (leftElbow < 110 || rightElbow < 110)) {
        countedKey = 'shoulderPress';
        next.shoulderPressDown = false;
      }
      const ideal = next.shoulderPressDown ? 110 : 130;
      return { countedKey, score: clampScore((leftElbow + rightElbow) / 2, ideal), phase: next };
    }

    case 'Bicep Curl': {
      if (leftElbow === null || rightElbow === null) return { countedKey: null, score: 0, phase: next };
      if (leftElbow < 50 && rightElbow < 50) next.bicepCurlDown = true;
      let countedKey: ExerciseKey | null = null;
      if (next.bicepCurlDown && leftElbow > 150 && rightElbow > 150) {
        countedKey = 'bicepCurl';
        next.bicepCurlDown = false;
      }
      const ideal = next.bicepCurlDown ? 50 : 150;
      return { countedKey, score: clampScore((leftElbow + rightElbow) / 2, ideal), phase: next };
    }

    default:
      return { countedKey: null, score: 0, phase: next };
  }
}
