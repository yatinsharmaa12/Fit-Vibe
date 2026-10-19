import { describe, expect, it } from 'vitest';
import {
  normalizeEmail,
  parsePositiveInteger,
  validateOtp,
  validatePassword,
  validatePoseKeypoints,
} from '@/lib/validation';

describe('validatePassword', () => {
  it('collects every failing rule', () => {
    const errors = validatePassword('short');
    expect(errors.length).toBeGreaterThan(1);
  });

  it('accepts a strong password', () => {
    expect(validatePassword('Abcd1234')).toEqual([]);
  });
});

describe('normalizeEmail', () => {
  it('lowercases and trims valid emails', () => {
    expect(normalizeEmail('  User@Example.COM ')).toBe('user@example.com');
  });

  it('rejects invalid values', () => {
    expect(normalizeEmail('not-an-email')).toBeNull();
    expect(normalizeEmail(42)).toBeNull();
  });
});

describe('parsePositiveInteger', () => {
  it('accepts positive integers within bounds', () => {
    expect(parsePositiveInteger(3, 1000)).toBe(3);
  });

  it('rejects floats, zero, negatives and strings', () => {
    expect(parsePositiveInteger(1.5, 1000)).toBeNull();
    expect(parsePositiveInteger(0, 1000)).toBeNull();
    expect(parsePositiveInteger(-1, 1000)).toBeNull();
    expect(parsePositiveInteger('3', 1000)).toBeNull();
    expect(parsePositiveInteger(2000, 1000)).toBeNull();
  });
});

describe('validateOtp', () => {
  it('accepts six digit codes only', () => {
    expect(validateOtp('123456')).toBe('123456');
    expect(validateOtp('12 456')).toBeNull();
    expect(validateOtp('12345')).toBeNull();
  });
});

describe('validatePoseKeypoints', () => {
  const buildKeypoints = (score: number) =>
    Array.from({ length: 17 }, (_, index) => ({ x: index, y: index, score }));

  it('accepts 17 keypoints with enough reliable points', () => {
    expect(validatePoseKeypoints(buildKeypoints(0.9))).toHaveLength(17);
  });

  it('rejects the wrong keypoint count', () => {
    expect(validatePoseKeypoints(buildKeypoints(0.9).slice(0, 10))).toBeNull();
  });

  it('rejects poses with too few reliable keypoints', () => {
    expect(validatePoseKeypoints(buildKeypoints(0.1))).toBeNull();
  });
});
