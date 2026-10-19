import { describe, expect, it } from 'vitest';
import {
  CHALLENGES,
  SUPPORTED_EXERCISES,
  getChallengeById,
  isChallengeComplete,
} from '@/lib/challenges';

describe('challenge definitions', () => {
  it('only reference exercises the pose counter supports', () => {
    for (const challenge of CHALLENGES) {
      for (const { exercise } of challenge.exercises) {
        expect(SUPPORTED_EXERCISES).toContain(exercise);
      }
    }
  });

  it('looks up challenges by id', () => {
    expect(getChallengeById(CHALLENGES[0].id)).toBeDefined();
    expect(getChallengeById('does-not-exist')).toBeUndefined();
  });
});

describe('isChallengeComplete', () => {
  const challenge = getChallengeById('five-rep')!;

  it('requires every exercise to reach its target', () => {
    const complete = Object.fromEntries(
      challenge.exercises.map(({ exercise, reps }) => [exercise, reps])
    );
    expect(isChallengeComplete(challenge, complete)).toBe(true);
  });

  it('is false when any exercise is short', () => {
    const partial = Object.fromEntries(
      challenge.exercises.map(({ exercise, reps }) => [exercise, reps - 1])
    );
    expect(isChallengeComplete(challenge, partial)).toBe(false);
  });
});
