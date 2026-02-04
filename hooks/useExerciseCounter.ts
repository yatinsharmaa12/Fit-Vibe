"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { useSession } from "next-auth/react";

export type ExerciseType =
  | "Push-Up"
  | "Pull-Up"
  | "Squat"
  | "Shoulder Press"
  | "Bicep Curl"
  | "Custom Pose";

export type ExerciseCounts = {
  pushup: number;
  pullup: number;
  squat: number;
  shoulderPress: number;
  bicepCurl: number;
  custom: number;
};

export function useExerciseCounter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseDetector, setPoseDetector] = useState<posedetection.PoseDetector | null>(null);
  const [enableDetection, setEnableDetection] = useState<boolean>(false);
  const [currExercise, setCurrExercise] = useState<ExerciseType | null>(null);
  const [exerciseCounts, setExerciseCounts] = useState<ExerciseCounts>({
    pushup: 0,
    pullup: 0,
    squat: 0,
    shoulderPress: 0,
    bicepCurl: 0,
    custom: 0,
  });
  const [customPoses, setCustomPoses] = useState<any[]>([]);
  const [selectedCustomPose, setSelectedCustomPose] = useState<any>(null);
  const totalReps =
    exerciseCounts.pushup +
    exerciseCounts.pullup +
    exerciseCounts.squat +
    exerciseCounts.shoulderPress +
    exerciseCounts.bicepCurl;
  const { data: session } = useSession();

  // New state for live rep feedback.
  const [repFeedback, setRepFeedback] = useState<string>("");
  const [liveFeedback, setLiveFeedback] = useState<string>("");

  // Refs to track movement state for counting reps.
  const pushUpDownRef = useRef<boolean>(false);
  const pullUpDownRef = useRef<boolean>(false);
  const squatDownRef = useRef<boolean>(false);
  const shoulderPressDownRef = useRef<boolean>(false);
  const bicepCurlDownRef = useRef<boolean>(false);

  // Utility: calculate the angle (in degrees) between three keypoints (A, B, C)
  const calculateAngle = (
    A: posedetection.Keypoint,
    B: posedetection.Keypoint,
    C: posedetection.Keypoint
  ) => {
    const angle =
      Math.atan2(C.y - B.y, C.x - B.x) -
      Math.atan2(A.y - B.y, A.x - B.x);
    let degree = Math.abs((angle * 180) / Math.PI);
    if (degree > 180) degree = 360 - degree;
    return degree;
  };

  // Cosine Similarity Function
  const cosineSimilarity = (poseKeypoints: posedetection.Keypoint[], targetKeypoints: { x: number, y: number, name?: string }[]) => {
    // We will use 17 keypoints from MoveNet
    // Vector A: Live Pose, Vector B: Target Pose
    // Only consider x and y for now
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    // Use common index for simplicity, assuming Order is consistent (MoveNet ordering)
    for (let i = 0; i < poseKeypoints.length; i++) {
      // Only use keypoints with good confidence in live pose
      if (poseKeypoints[i].score && poseKeypoints[i].score! > 0.3) {
        const Ax = poseKeypoints[i].x;
        const Ay = poseKeypoints[i].y;

        // Normalize slightly to bounding box could be better, but rough coords comparison 
        // works if user is same distance.
        // BETTER: Use L2 Normalized vectors relative to a root point (e.g., hips).
        // For MVP: Direct vector comparison. But users vary in distance.
        // IMPROVEMENT: Normalize coordinates relative to root (e.g. nose or hip center) and scale.
        // Let's stick to raw cosine similarity of flattened vector for simplicity first or just key angles.

        // ACTUALLY: Let's use Cosine Similarity of the vector (x,y) sequence.
        // This is scale invariant but sensitive to translation if using raw coords.
        // Shift to center of gravity usually needed. 
        // Given time, let's try a simpler approach: Match Key Angles? 
        // The request asked for matching the saved pose. The saved pose has keypoints.

        // Let's implement Cosine Similarity on Relative Vectors (Limb vectors).
        // But saved data is raw keypoints.

        const Bx = targetKeypoints[i].x;
        const By = targetKeypoints[i].y;

        dotProduct += (Ax * Bx + Ay * By);
        normA += (Ax * Ax + Ay * Ay);
        normB += (Bx * Bx + By * By);
      }
    }

    // Fallback if norms are zero
    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  // Helper to normalize pose to [0,1] bounding box to handle distance diffs
  const normalizePose = (keypoints: { x: number, y: number, score?: number }[]) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    keypoints.forEach(kp => {
      if (kp.x < minX) minX = kp.x;
      if (kp.y < minY) minY = kp.y;
      if (kp.x > maxX) maxX = kp.x;
      if (kp.y > maxY) maxY = kp.y;
    });
    const width = maxX - minX;
    const height = maxY - minY;
    return keypoints.map(kp => ({
      x: (kp.x - minX) / (width || 1),
      y: (kp.y - minY) / (height || 1),
      score: kp.score
    }));
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user/getPoses?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.poses) setCustomPoses(data.poses);
        })
        .catch(err => console.error("Error fetching poses:", err));
    }
  }, [session]);

  useEffect(() => {
    async function initDetector() {
      await tf.ready();
      const detectorConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setPoseDetector(detector);
    }
    initDetector();
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      if (enableDetection && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        } catch (err) {
          console.error("Camera error:", err);
        }
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [enableDetection]);

  useEffect(() => {
    if (enableDetection && !currExercise) {
      setCurrExercise("Bicep Curl");
    }
  }, [enableDetection, currExercise]);

  // Set the selected custom pose when ExerciseType changes to a specific custom one?
  // Or rather, we need a way to SELECT which custom pose.
  // We'll expose setCurrExercise and verify loop.




  const drawPose = useCallback((pose: posedetection.Pose, accuracy?: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const threshold = 0.3;
    pose.keypoints.forEach((kp, index) => {
      if (kp.score && kp.score > threshold && kp.x >= 0 && kp.y >= 0) {
        ctx.beginPath();
        if (index === 9 || index === 10) {
          ctx.arc(kp.x, kp.y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = "blue";
        } else {
          ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
        }
        ctx.fill();
      }
    });
    const adjacentPairs = posedetection.util.getAdjacentPairs(
      posedetection.SupportedModels.MoveNet
    );
    adjacentPairs.forEach(([i, j]) => {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];
      if (
        kp1.score! > threshold &&
        kp2.score! > threshold &&
        kp1.x >= 0 &&
        kp1.y >= 0 &&
        kp2.x >= 0 &&
        kp2.y >= 0
      ) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    if (typeof accuracy === "number") {
      ctx.font = "20px Arial";
      ctx.fillStyle = "lime";
      // ctx.fillText(`Accuracy: ${accuracy}%`, 10, 30);
    }
    ctx.restore();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!poseDetector || !enableDetection || !videoRef.current) return;
      const video = videoRef.current;
      if (video.readyState < 2) return;
      if (
        canvasRef.current &&
        video.videoWidth &&
        video.videoHeight &&
        (canvasRef.current.width !== video.videoWidth ||
          canvasRef.current.height !== video.videoHeight)
      ) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }
      const poses = await poseDetector.estimatePoses(video);
      let computedAccuracy = 0;
      if (poses && poses.length > 0) {
        const pose = poses[0];
        if (currExercise) {
          switch (currExercise) {
            case "Push-Up": {
              const leftAngle = calculateAngle(
                pose.keypoints[5],
                pose.keypoints[7],
                pose.keypoints[9]
              );
              const rightAngle = calculateAngle(
                pose.keypoints[6],
                pose.keypoints[8],
                pose.keypoints[10]
              );
              if (leftAngle < 90 && rightAngle < 90) {
                pushUpDownRef.current = true;
              }
              if (pushUpDownRef.current && leftAngle > 160 && rightAngle > 160) {
                // Compute rep accuracy (ideal = 160°)
                const avgAngle = (leftAngle + rightAngle) / 2;
                const repAcc = Math.max(0, Math.round(100 - Math.abs(avgAngle - 160)));
                setExerciseCounts((prev) => ({ ...prev, pushup: prev.pushup + 1 }));
                setRepFeedback(repAcc >= 90 ? "Good Posture, Keep Going!" : "Try to improve your form!");
                setTimeout(() => setRepFeedback(""), 5000);
                pushUpDownRef.current = false;
              }
              {
                const avgAngle = (leftAngle + rightAngle) / 2;
                const ideal = pushUpDownRef.current ? 90 : 160;
                computedAccuracy = Math.max(0, Math.round(100 - Math.abs(avgAngle - ideal)));
              }
              break;
            }
            case "Pull-Up": {
              const leftAngle = calculateAngle(
                pose.keypoints[5],
                pose.keypoints[7],
                pose.keypoints[9]
              );
              const rightAngle = calculateAngle(
                pose.keypoints[6],
                pose.keypoints[8],
                pose.keypoints[10]
              );
              if (leftAngle > 160 && rightAngle > 160) {
                pullUpDownRef.current = true;
              }
              if (pullUpDownRef.current && leftAngle < 50 && rightAngle < 50) {
                const avgAngle = (leftAngle + rightAngle) / 2;
                const repAcc = Math.max(0, Math.round(100 - Math.abs(avgAngle - 50)));
                setExerciseCounts((prev) => ({ ...prev, pullup: prev.pullup + 1 }));
                setRepFeedback(repAcc >= 90 ? "Good Posture, Keep Going!!" : "Try to improve your form!");
                setTimeout(() => setRepFeedback(""), 5000);
                pullUpDownRef.current = false;
              }
              {
                const avgAngle = (leftAngle + rightAngle) / 2;
                const ideal = pullUpDownRef.current ? 50 : 160;
                computedAccuracy = Math.max(0, Math.round(100 - Math.abs(avgAngle - ideal)));
              }
              break;
            }
            case "Squat": {
              const leftKneeAngle = calculateAngle(
                pose.keypoints[11],
                pose.keypoints[13],
                pose.keypoints[15]
              );
              const rightKneeAngle = calculateAngle(
                pose.keypoints[12],
                pose.keypoints[14],
                pose.keypoints[16]
              );
              if (leftKneeAngle < 90 && rightKneeAngle < 90) {
                squatDownRef.current = true;
              }
              if (squatDownRef.current && leftKneeAngle > 160 && rightKneeAngle > 160) {
                const avgKnee = (leftKneeAngle + rightKneeAngle) / 2;
                const repAcc = Math.max(0, Math.round(100 - Math.abs(avgKnee - 160)));
                setExerciseCounts((prev) => ({ ...prev, squat: prev.squat + 1 }));
                setRepFeedback(repAcc >= 90 ? "Good Posture, Keep Going!!" : "Try to improve your form!");
                setTimeout(() => setRepFeedback(""), 5000);
                squatDownRef.current = false;
              }
              {
                const avgKnee = (leftKneeAngle + rightKneeAngle) / 2;
                const ideal = squatDownRef.current ? 90 : 160;
                computedAccuracy = Math.max(0, Math.round(100 - Math.abs(avgKnee - ideal)));
              }
              break;
            }
            case "Shoulder Press": {
              const leftAngle = calculateAngle(
                pose.keypoints[5],
                pose.keypoints[7],
                pose.keypoints[9]
              );
              const rightAngle = calculateAngle(
                pose.keypoints[6],
                pose.keypoints[8],
                pose.keypoints[10]
              );
              // Mark "up" phase when both angles are greater than 130°.
              if (leftAngle > 130 && rightAngle > 130) {
                shoulderPressDownRef.current = true;
              }
              // Count rep when, after being "up", at least one angle drops below 110°.
              if (shoulderPressDownRef.current && (leftAngle < 110 || rightAngle < 110)) {
                setExerciseCounts((prev) => ({
                  ...prev,
                  shoulderPress: prev.shoulderPress + 1,
                }));
                shoulderPressDownRef.current = false;
              }
              {
                const avgAngle = (leftAngle + rightAngle) / 2;
                const ideal = shoulderPressDownRef.current ? 110 : 130;
                computedAccuracy = Math.max(0, Math.round(100 - Math.abs(avgAngle - ideal)));
              }
              break;
            }

            case "Bicep Curl": {
              const leftAngle = calculateAngle(
                pose.keypoints[5],
                pose.keypoints[7],
                pose.keypoints[9]
              );
              const rightAngle = calculateAngle(
                pose.keypoints[6],
                pose.keypoints[8],
                pose.keypoints[10]
              );
              if (leftAngle < 50 && rightAngle < 50) {
                bicepCurlDownRef.current = true;
              }
              if (bicepCurlDownRef.current && leftAngle > 150 && rightAngle > 150) {
                const avgAngle = (leftAngle + rightAngle) / 2;
                const repAcc = Math.max(0, Math.round(100 - Math.abs(avgAngle - 150)));
                setExerciseCounts((prev) => ({
                  ...prev,
                  bicepCurl: prev.bicepCurl + 1,
                }));
                setRepFeedback(repAcc >= 90 ? "Good Posture, Keep Going!!" : "Try to improve your form!");
                setTimeout(() => setRepFeedback(""), 5000);
                bicepCurlDownRef.current = false;
              }
              {
                const avgAngle = (leftAngle + rightAngle) / 2;
                const ideal = bicepCurlDownRef.current ? 50 : 150;
                computedAccuracy = Math.max(0, Math.round(100 - Math.abs(avgAngle - ideal)));
              }
              break;
            }
            default:
              // Handle Custom Pose Matching
              if (selectedCustomPose) {
                // Normalize both live and target pose for better comparison
                const normalizedLive = normalizePose(pose.keypoints);
                const normalizedTarget = normalizePose(selectedCustomPose.keypoints);

                // Simple L2 distance check on normalized keypoints might be better than Cosine for "Shape" matching
                // Let's average the distance between corresponding keypoints
                let totalDist = 0;
                let validPoints = 0;
                for (let i = 0; i < normalizedLive.length; i++) {
                  if (normalizedLive[i].score && normalizedLive[i].score! > 0.4) {
                    const dx = normalizedLive[i].x - normalizedTarget[i].x;
                    const dy = normalizedLive[i].y - normalizedTarget[i].y;
                    totalDist += Math.sqrt(dx * dx + dy * dy);
                    validPoints++;
                  }
                }

                // Average distance (0 is perfect match)
                const avgDist = validPoints > 0 ? totalDist / validPoints : 1;
                // Convert to similarity score (0 to 100)
                // Heuristic: avgDist < 0.1 is very good match
                const similarity = Math.max(0, Math.min(100, Math.round((1 - avgDist * 2) * 100))); // Multiplier 2 makes it stricter

                computedAccuracy = similarity;

                if (similarity > 80) {
                  setRepFeedback("Pose Matched!");
                } else {
                  setRepFeedback("Adjust Pose...");
                }
              }
              break;
          }
        }
        setLiveFeedback(`Accuracy: ${computedAccuracy}%`);
        drawPose(pose, computedAccuracy);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [poseDetector, enableDetection, currExercise, calculateAngle, drawPose]);


  useEffect(() => {
    if (totalReps > 0) {
      const newCalories = totalReps * 5;
      const newTokens = totalReps * 10;
      const timer = setTimeout(() => {
        fetch("/api/user/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            calories: newCalories,
            tokens: newTokens,
          }),
        }).catch((err) => console.error(err));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [exerciseCounts, totalReps, session]);

  const toggleCamera = () => {
    setEnableDetection((prev) => !prev);
  };

  return {
    exerciseCounts,
    totalReps,
    videoRef,
    canvasRef,
    enableDetection,
    toggleCamera,
    currExercise,
    setCurrExercise,
    liveFeedback,
    repFeedback,
    customPoses,
    selectedCustomPose,
    setSelectedCustomPose,
  };
}

export default useExerciseCounter;