import { describe, expect, it } from 'vitest';
import { createCounterState, evaluateExercise } from '@/lib/exercise-counter';
import { getAngle, poseSimilarity, type Keypoint } from '@/lib/pose';

function baseKeypoints(score = 0.9): Keypoint[] {
  return Array.from({ length: 17 }, () => ({ x: 0, y: 0, score }));
}

function setAngle(keypoints: Keypoint[], a: number, b: number, c: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  keypoints[b] = { x: 0, y: 0, score: 0.9 };
  keypoints[a] = { x: 100, y: 0, score: 0.9 };
  keypoints[c] = { x: 100 * Math.cos(radians), y: 100 * Math.sin(radians), score: 0.9 };
}

function armsAt(degrees: number): Keypoint[] {
  const keypoints = baseKeypoints();
  setAngle(keypoints, 5, 7, 9, degrees);
  setAngle(keypoints, 6, 8, 10, degrees);
  return keypoints;
}

describe('getAngle', () => {
  it('computes the angle between three keypoints', () => {
    const keypoints = armsAt(90);
    expect(getAngle(keypoints, 5, 7, 9)).toBeCloseTo(90, 0);
  });

  it('returns null when a keypoint is not confident', () => {
    const keypoints = armsAt(90);
    keypoints[7].score = 0.1;
    expect(getAngle(keypoints, 5, 7, 9)).toBeNull();
  });
});

describe('evaluateExercise', () => {
  it('counts a bicep curl only after a full down/up cycle', () => {
    const state = createCounterState();

    const extended = evaluateExercise('Bicep Curl', armsAt(165), state, 1000);
    expect(extended.countedKey).toBeNull();

    const curled = evaluateExercise('Bicep Curl', armsAt(30), extended.phase, 1200);
    expect(curled.countedKey).toBeNull();

    const finished = evaluateExercise('Bicep Curl', armsAt(165), curled.phase, 2200);
    expect(finished.countedKey).toBe('bicepCurl');

    // A second frame in the up position must not double count.
    const repeat = evaluateExercise('Bicep Curl', armsAt(165), finished.phase, 2300);
    expect(repeat.countedKey).toBeNull();
  });

  it('counts a squat after descending and standing back up', () => {
    const keypointsFor = (degrees: number) => {
      const keypoints = baseKeypoints();
      setAngle(keypoints, 11, 13, 15, degrees);
      setAngle(keypoints, 12, 14, 16, degrees);
      return keypoints;
    };

    const standing = evaluateExercise('Squat', keypointsFor(170), createCounterState(), 1000);
    const down = evaluateExercise('Squat', keypointsFor(70), standing.phase, 1200);
    expect(down.countedKey).toBeNull();

    const up = evaluateExercise('Squat', keypointsFor(170), down.phase, 2200);
    expect(up.countedKey).toBe('squat');
  });

  it('explains why a shallow bend did not count', () => {
    const start = evaluateExercise('Bicep Curl', armsAt(165), createCounterState(), 1000);
    const partial = evaluateExercise('Bicep Curl', armsAt(95), start.phase, 1200);
    const returned = evaluateExercise('Bicep Curl', armsAt(165), partial.phase, 2200);
    expect(returned.countedKey).toBeNull();
    expect(returned.missedRepReason).toMatch(/too shallow/i);
    expect(returned.missedRepReason).toContain('50°');
  });

  it('rejects a movement that finishes too quickly', () => {
    const start = evaluateExercise('Bicep Curl', armsAt(165), createCounterState(), 1000);
    const middle = evaluateExercise('Bicep Curl', armsAt(30), start.phase, 1200);
    const returned = evaluateExercise('Bicep Curl', armsAt(165), middle.phase, 1300);
    expect(returned.countedKey).toBeNull();
    expect(returned.missedRepReason).toMatch(/too quick/i);
  });

  it('requires the stated minimum movement range', () => {
    const kneesAt = (degrees: number) => {
      const keypoints = baseKeypoints();
      setAngle(keypoints, 11, 13, 15, degrees);
      setAngle(keypoints, 12, 14, 16, degrees);
      return keypoints;
    };
    const start = evaluateExercise('Squat', kneesAt(162), createCounterState(), 1000);
    const middle = evaluateExercise('Squat', kneesAt(88), start.phase, 1200);
    const returned = evaluateExercise('Squat', kneesAt(162), middle.phase, 2200);
    expect(returned.countedKey).toBeNull();
    expect(returned.missedRepReason).toMatch(/at least 75°/);
  });

  it.each([
    ['Push-Up', 170, 70, 'pushup'],
    ['Pull-Up', 170, 30, 'pullup'],
    ['Shoulder Press', 90, 170, 'shoulderPress'],
  ] as const)('counts a complete %s cycle', (exercise, startAngle, middleAngle, expectedKey) => {
    const start = evaluateExercise(exercise, armsAt(startAngle), createCounterState(), 1000);
    const middle = evaluateExercise(exercise, armsAt(middleAngle), start.phase, 1200);
    const returned = evaluateExercise(exercise, armsAt(startAngle), middle.phase, 2200);
    expect(returned.countedKey).toBe(expectedKey);
  });

  it('does not count when keypoints are unreliable', () => {
    const keypoints = armsAt(90).map((keypoint) => ({ ...keypoint, score: 0.1 }));
    const result = evaluateExercise('Bicep Curl', keypoints, createCounterState());
    expect(result.countedKey).toBeNull();
    expect(result.score).toBe(0);
    expect(result.feedback).toMatch(/clearly visible/i);
  });
});

describe('poseSimilarity', () => {
  const pose = baseKeypoints().map((keypoint, index) => ({ ...keypoint, x: index * 10, y: index * 5 }));

  it('returns a high score for identical poses', () => {
    expect(poseSimilarity(pose, pose)).toBeGreaterThanOrEqual(99);
  });

  it('handles missing target keypoints without producing NaN', () => {
    const short = pose.slice(0, 5);
    expect(poseSimilarity(pose, short)).toBeNull();
  });

  it('returns null when too few points are reliable', () => {
    const lowConfidence = pose.map((keypoint) => ({ ...keypoint, score: 0.1 }));
    expect(poseSimilarity(lowConfidence, pose)).toBeNull();
  });
});
