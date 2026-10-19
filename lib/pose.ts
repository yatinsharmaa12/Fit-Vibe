export type Keypoint = {
  x: number;
  y: number;
  score?: number;
  name?: string;
};

export const MIN_KEYPOINT_SCORE = 0.4;
export const MOVENET_KEYPOINT_COUNT = 17;

export function calculateAngle(A: Keypoint, B: Keypoint, C: Keypoint): number {
  const angle = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let degree = Math.abs((angle * 180) / Math.PI);
  if (degree > 180) degree = 360 - degree;
  return degree;
}

export function getAngle(
  keypoints: Keypoint[],
  a: number,
  b: number,
  c: number
): number | null {
  const A = keypoints[a];
  const B = keypoints[b];
  const C = keypoints[c];
  if (!A || !B || !C) return null;
  if ((A.score ?? 0) < MIN_KEYPOINT_SCORE) return null;
  if ((B.score ?? 0) < MIN_KEYPOINT_SCORE) return null;
  if ((C.score ?? 0) < MIN_KEYPOINT_SCORE) return null;
  return calculateAngle(A, B, C);
}

export function normalizePose(
  keypoints: Keypoint[]
): Array<{ x: number; y: number; score: number }> | null {
  if (!Array.isArray(keypoints) || keypoints.length !== MOVENET_KEYPOINT_COUNT) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const keypoint of keypoints) {
    if (!Number.isFinite(keypoint.x) || !Number.isFinite(keypoint.y)) return null;
    minX = Math.min(minX, keypoint.x);
    minY = Math.min(minY, keypoint.y);
    maxX = Math.max(maxX, keypoint.x);
    maxY = Math.max(maxY, keypoint.y);
  }

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return keypoints.map((keypoint) => ({
    x: (keypoint.x - minX) / width,
    y: (keypoint.y - minY) / height,
    score: keypoint.score ?? 0,
  }));
}

export function poseSimilarity(live: Keypoint[], target: Keypoint[]): number | null {
  const normalizedLive = normalizePose(live);
  const normalizedTarget = normalizePose(target);
  if (!normalizedLive || !normalizedTarget) return null;

  let totalDistance = 0;
  let validPoints = 0;

  for (let i = 0; i < normalizedLive.length; i++) {
    if (normalizedLive[i].score < MIN_KEYPOINT_SCORE) continue;
    if (normalizedTarget[i].score < MIN_KEYPOINT_SCORE) continue;
    const dx = normalizedLive[i].x - normalizedTarget[i].x;
    const dy = normalizedLive[i].y - normalizedTarget[i].y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
    validPoints += 1;
  }

  if (validPoints < 6) return null;

  const averageDistance = totalDistance / validPoints;
  const similarity = Math.round((1 - averageDistance * 2) * 100);
  return Math.max(0, Math.min(100, similarity));
}
