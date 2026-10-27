// Import the inference runtime only after a user starts tracking or uploads a pose.
// A shared promise also avoids loading two runtimes during rapid navigation.
let enginePromise: Promise<typeof import('@tensorflow-models/pose-detection')> | null = null;

export function loadPoseEngine() {
  if (!enginePromise) {
    enginePromise = (async () => {
      const [tf, pose] = await Promise.all([
        import('@tensorflow/tfjs'),
        import('@tensorflow-models/pose-detection'),
      ]);
      await import('@tensorflow/tfjs-backend-webgl');
      await tf.ready();
      return pose;
    })().catch((error) => {
      enginePromise = null;
      throw error;
    });
  }
  return enginePromise;
}
