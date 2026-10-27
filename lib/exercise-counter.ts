import type { SupportedExercise } from '@/lib/challenges';
import { getAngle, type Keypoint } from '@/lib/pose';

export type ExerciseKey = 'pushup' | 'pullup' | 'squat' | 'shoulderPress' | 'bicepCurl';
type Stage = 'start' | 'ready' | 'moving' | 'middle';
type Direction = 'below' | 'above';

export type ExerciseGuide = {
  key: ExerciseKey;
  joints: string;
  camera: string;
  movement: string;
  start: string;
  middle: string;
  end: string;
  minimumRange: number;
  minimumMs: number;
  maximumMs: number;
  joint: 'elbow' | 'knee';
  startDirection: Direction;
  startAngle: number;
  middleDirection: Direction;
  middleAngle: number;
};

// These are camera tracking thresholds, not clinical form standards.
export const EXERCISE_GUIDES: Record<SupportedExercise, ExerciseGuide> = {
  'Push-Up': {
    key: 'pushup', joints: 'Both shoulders, elbows and wrists',
    camera: 'Place the camera to the side with both arms visible.',
    movement: 'Both elbows must bend and straighten.',
    start: 'Start with elbows straight (over 160°).',
    middle: 'Lower until both elbows bend below 90°.',
    end: 'Push back until both elbows straighten over 160°.',
    minimumRange: 75, minimumMs: 600, maximumMs: 12000,
    joint: 'elbow', startDirection: 'above', startAngle: 160,
    middleDirection: 'below', middleAngle: 90,
  },
  'Pull-Up': {
    key: 'pullup', joints: 'Both shoulders, elbows and wrists',
    camera: 'Face the camera or turn slightly; keep both arms visible.',
    movement: 'Both elbows must bend during the pull and straighten on the way down.',
    start: 'Start with elbows straight (over 160°).',
    middle: 'Pull until both elbows bend below 50°.',
    end: 'Lower until both elbows straighten over 160°.',
    minimumRange: 115, minimumMs: 600, maximumMs: 15000,
    joint: 'elbow', startDirection: 'above', startAngle: 160,
    middleDirection: 'below', middleAngle: 50,
  },
  Squat: {
    key: 'squat', joints: 'Both hips, knees and ankles',
    camera: 'Place the camera to the side or at a slight angle with both legs visible.',
    movement: 'Both knees must bend and straighten.',
    start: 'Stand with knees straight (over 160°).',
    middle: 'Lower until both knees bend below 90°.',
    end: 'Stand back up until both knees straighten over 160°.',
    minimumRange: 75, minimumMs: 600, maximumMs: 12000,
    joint: 'knee', startDirection: 'above', startAngle: 160,
    middleDirection: 'below', middleAngle: 90,
  },
  'Shoulder Press': {
    key: 'shoulderPress', joints: 'Both shoulders, elbows and wrists',
    camera: 'Face the camera with both arms visible.',
    movement: 'Both elbows must straighten during the press and bend on return.',
    start: 'Begin with both elbows bent below 110°.',
    middle: 'Press until both elbows straighten over 150°.',
    end: 'Lower until both elbows bend below 110° again.',
    minimumRange: 45, minimumMs: 600, maximumMs: 12000,
    joint: 'elbow', startDirection: 'below', startAngle: 110,
    middleDirection: 'above', middleAngle: 150,
  },
  'Bicep Curl': {
    key: 'bicepCurl', joints: 'Both shoulders, elbows and wrists',
    camera: 'Face the camera or turn slightly; keep both arms visible.',
    movement: 'Both elbows must bend during the curl and straighten on return.',
    start: 'Begin with elbows straight (over 150°).',
    middle: 'Curl until both elbows bend below 50°.',
    end: 'Lower until both elbows straighten over 150° again.',
    minimumRange: 105, minimumMs: 600, maximumMs: 12000,
    joint: 'elbow', startDirection: 'above', startAngle: 150,
    middleDirection: 'below', middleAngle: 50,
  },
};

export type CounterState = {
  exercise: SupportedExercise | null;
  stage: Stage;
  startedAt: number | null;
  minimumAngle: number | null;
  maximumAngle: number | null;
};

export type ExerciseEvaluation = {
  countedKey: ExerciseKey | null;
  score: number;
  phase: CounterState;
  feedback: string;
  missedRepReason?: string;
};

export function createCounterState(): CounterState {
  return { exercise: null, stage: 'start', startedAt: null, minimumAngle: null, maximumAngle: null };
}

function reached(value: number, direction: Direction, threshold: number) {
  return direction === 'below' ? value < threshold : value > threshold;
}

function instruction(joint: 'elbow' | 'knee', direction: Direction, threshold: number) {
  return `${direction === 'below' ? 'Bend' : 'Straighten'} both ${joint}s ${direction} ${threshold}°`;
}

function reset(exercise: SupportedExercise, stage: Stage = 'ready'): CounterState {
  return { ...createCounterState(), exercise, stage };
}

export function evaluateExercise(
  exercise: SupportedExercise,
  keypoints: Keypoint[],
  state: CounterState,
  nowMs = Date.now()
): ExerciseEvaluation {
  const guide = EXERCISE_GUIDES[exercise];
  const current = state.exercise === exercise ? state : reset(exercise, 'start');
  const left = guide.joint === 'elbow' ? getAngle(keypoints, 5, 7, 9) : getAngle(keypoints, 11, 13, 15);
  const right = guide.joint === 'elbow' ? getAngle(keypoints, 6, 8, 10) : getAngle(keypoints, 12, 14, 16);
  if (left === null || right === null) {
    return { countedKey: null, score: 0, phase: current,
      feedback: `Cannot count: both ${guide.joint}s need to be clearly visible. Adjust the camera.` };
  }

  const average = (left + right) / 2;
  const atStart = reached(left, guide.startDirection, guide.startAngle)
    && reached(right, guide.startDirection, guide.startAngle);
  const atMiddle = reached(left, guide.middleDirection, guide.middleAngle)
    && reached(right, guide.middleDirection, guide.middleAngle);
  const startPrompt = instruction(guide.joint, guide.startDirection, guide.startAngle);
  const middlePrompt = instruction(guide.joint, guide.middleDirection, guide.middleAngle);
  const seen = `left ${Math.round(left)}°, right ${Math.round(right)}°`;
  const ideal = current.stage === 'middle' ? guide.startAngle : guide.middleAngle;
  const score = Math.max(0, Math.min(100, Math.round(100 - Math.abs(average - ideal))));

  if (current.stage === 'start') {
    return { countedKey: null, score, phase: atStart ? reset(exercise) : current,
      feedback: atStart ? `Start found. ${middlePrompt}.` : `Start position needed: ${startPrompt} (${seen}).` };
  }
  if (current.stage === 'ready' && atStart) {
    return { countedKey: null, score, phase: current, feedback: `${middlePrompt} (${seen}).` };
  }

  let next: CounterState = current.stage === 'ready'
    ? { exercise, stage: 'moving', startedAt: nowMs, minimumAngle: average, maximumAngle: average }
    : { ...current, minimumAngle: Math.min(current.minimumAngle ?? average, average),
        maximumAngle: Math.max(current.maximumAngle ?? average, average) };

  if (next.startedAt !== null && nowMs - next.startedAt > guide.maximumMs) {
    const reason = `Not counted: movement took over ${guide.maximumMs / 1000} seconds. Return to the start position.`;
    return { countedKey: null, score, phase: reset(exercise, atStart ? 'ready' : 'start'),
      feedback: reason, missedRepReason: reason };
  }

  if (next.stage === 'moving') {
    if (atMiddle) {
      next = { ...next, stage: 'middle' };
      return { countedKey: null, score, phase: next, feedback: `Middle reached. ${startPrompt} to finish.` };
    }
    if (atStart) {
      const deepest = guide.middleDirection === 'below' ? next.minimumAngle : next.maximumAngle;
      const reason = `Not counted: ${guide.joint} movement was too shallow. ${middlePrompt}; closest angle was about ${Math.round(deepest ?? average)}°.`;
      return { countedKey: null, score, phase: reset(exercise), feedback: reason, missedRepReason: reason };
    }
    return { countedKey: null, score, phase: next, feedback: `${middlePrompt}; currently ${seen}.` };
  }

  if (!atStart) {
    return { countedKey: null, score, phase: next, feedback: `Complete the rep: ${startPrompt}; currently ${seen}.` };
  }

  const duration = nowMs - (next.startedAt ?? nowMs);
  const range = (next.maximumAngle ?? average) - (next.minimumAngle ?? average);
  if (duration < guide.minimumMs) {
    const reason = `Not counted: movement was too quick (${(duration / 1000).toFixed(1)}s). Take at least ${guide.minimumMs / 1000}s.`;
    return { countedKey: null, score, phase: reset(exercise), feedback: reason, missedRepReason: reason };
  }
  if (range < guide.minimumRange) {
    const reason = `Not counted: ${guide.joint} movement was ${Math.round(range)}°; at least ${guide.minimumRange}° is needed.`;
    return { countedKey: null, score, phase: reset(exercise), feedback: reason, missedRepReason: reason };
  }
  return { countedKey: guide.key, score, phase: reset(exercise),
    feedback: `Rep counted. ${middlePrompt} for the next one.` };
}
