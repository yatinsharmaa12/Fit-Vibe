export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return EMAIL_PATTERN.test(email) && email.length <= 254 ? email : null;
}

export function validateName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  return name.length >= 2 && name.length <= 80 ? name : null;
}

export function validatePassword(password: unknown): string[] {
  if (typeof password !== 'string') {
    return ['Password is required'];
  }

  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  return errors;
}

export function parsePositiveInteger(value: unknown, max = 100000): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    return null;
  }
  if (value <= 0 || value > max) return null;
  return value;
}

export type PoseKeypointInput = {
  x: number;
  y: number;
  z?: number;
  score?: number;
  name?: string;
};

const MOVENET_KEYPOINT_COUNT = 17;

export function validatePoseKeypoints(value: unknown): PoseKeypointInput[] | null {
  if (!Array.isArray(value) || value.length !== MOVENET_KEYPOINT_COUNT) {
    return null;
  }

  const keypoints: PoseKeypointInput[] = [];
  let reliable = 0;

  for (const item of value) {
    if (!isRecord(item)) return null;

    const { x, y, z, score, name } = item;
    if (typeof x !== 'number' || !Number.isFinite(x) || Math.abs(x) > 100000) return null;
    if (typeof y !== 'number' || !Number.isFinite(y) || Math.abs(y) > 100000) return null;
    if (z !== undefined && (typeof z !== 'number' || !Number.isFinite(z))) return null;
    if (score !== undefined && (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 1)) {
      return null;
    }
    if (name !== undefined && typeof name !== 'string') return null;

    if (typeof score === 'number' && score >= 0.3) reliable += 1;
    keypoints.push({
      x,
      y,
      ...(z !== undefined ? { z } : {}),
      ...(score !== undefined ? { score } : {}),
      ...(name !== undefined ? { name } : {}),
    });
  }

  return reliable >= 6 ? keypoints : null;
}

export function validateOtp(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{6}$/.test(value)) return null;
  return value;
}
