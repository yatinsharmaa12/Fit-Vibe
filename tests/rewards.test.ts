import { describe, expect, it } from 'vitest';
import { calculatePercentile, calculateWorkoutReward } from '@/lib/rewards';

describe('calculateWorkoutReward', () => {
  it('derives calories, points and tokens from reps', () => {
    expect(calculateWorkoutReward(3)).toEqual({ calories: 15, points: 3, tokens: 30 });
  });

  it('rejects non-positive, fractional and oversized rep counts', () => {
    expect(() => calculateWorkoutReward(0)).toThrow();
    expect(() => calculateWorkoutReward(-5)).toThrow();
    expect(() => calculateWorkoutReward(1.5)).toThrow();
    expect(() => calculateWorkoutReward(5000)).toThrow();
  });
});

describe('calculatePercentile', () => {
  it('returns the percentage of users with fewer points', () => {
    expect(calculatePercentile(100, 99)).toBe(99);
    expect(calculatePercentile(100, 0)).toBe(0);
  });

  it('handles empty and invalid collections', () => {
    expect(calculatePercentile(0, 0)).toBe(0);
    expect(calculatePercentile(Number.NaN, 5)).toBe(0);
  });

  it('clamps out-of-range values', () => {
    expect(calculatePercentile(10, 50)).toBe(100);
    expect(calculatePercentile(10, -1)).toBe(0);
  });
});
