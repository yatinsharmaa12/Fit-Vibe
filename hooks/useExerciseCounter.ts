"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import type { SupportedExercise } from "@/lib/challenges";
import { createCounterState, evaluateExercise, ExerciseKey } from "@/lib/exercise-counter";
import { poseSimilarity } from "@/lib/pose";

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

export type CustomPose = {
  _id: string;
  name?: string;
  keypoints: posedetection.Keypoint[];
  createdAt: string;
};

const EXERCISE_MAP: Array<{ key: ExerciseKey; name: SupportedExercise }> = [
  { key: "pushup", name: "Push-Up" },
  { key: "pullup", name: "Pull-Up" },
  { key: "squat", name: "Squat" },
  { key: "shoulderPress", name: "Shoulder Press" },
  { key: "bicepCurl", name: "Bicep Curl" },
];

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
  const [customPoses, setCustomPoses] = useState<CustomPose[]>([]);
  const [selectedCustomPose, setSelectedCustomPose] = useState<CustomPose | null>(null);

  const [repFeedback, setRepFeedback] = useState<string>("");
  const [liveFeedback, setLiveFeedback] = useState<string>("");
  const [formScore, setFormScore] = useState<number>(0);

  const counterStateRef = useRef(createCounterState());

  const countsRef = useRef<ExerciseCounts>(exerciseCounts);
  const lastSubmittedRef = useRef<ExerciseCounts>({
    pushup: 0,
    pullup: 0,
    squat: 0,
    shoulderPress: 0,
    bicepCurl: 0,
    custom: 0,
  });
  const submittingRef = useRef<boolean>(false);

  const totalReps =
    exerciseCounts.pushup +
    exerciseCounts.pullup +
    exerciseCounts.squat +
    exerciseCounts.shoulderPress +
    exerciseCounts.bicepCurl;

  useEffect(() => {
    countsRef.current = exerciseCounts;
  }, [exerciseCounts]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/user/getPoses")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.poses) {
          setCustomPoses(data.poses as CustomPose[]);
        }
      })
      .catch((err) => console.error("Error fetching poses:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let detector: posedetection.PoseDetector | null = null;

    async function initDetector() {
      try {
        await tf.ready();
        detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        });
        if (disposed) {
          detector.dispose();
          return;
        }
        setPoseDetector(detector);
      } catch (error) {
        console.error("Failed to initialize pose detector:", error);
      }
    }

    initDetector();

    return () => {
      disposed = true;
      detector?.dispose();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (!enableDetection || !videoRef.current) return;
      try {
        const acquired = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          acquired.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = acquired;
        videoRef.current.srcObject = acquired;
        await videoRef.current.play();
      } catch (error) {
        console.error("Camera error:", error);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enableDetection]);

  useEffect(() => {
    if (enableDetection && !currExercise) {
      setCurrExercise("Bicep Curl");
    }
  }, [enableDetection, currExercise]);

  const drawPose = useCallback((pose: posedetection.Pose) => {
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
    const adjacentPairs = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
    adjacentPairs.forEach(([i, j]) => {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];
      if (kp1.score && kp1.score > threshold && kp2.score && kp2.score > threshold) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    ctx.restore();
  }, []);

  const registerRep = useCallback((key: ExerciseKey, score: number) => {
    setExerciseCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setRepFeedback(score >= 90 ? "Good form, keep going!" : "Try to improve your form!");
    setTimeout(() => setRepFeedback(""), 5000);
  }, []);

  useEffect(() => {
    if (!poseDetector || !enableDetection || !videoRef.current) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const processFrame = async () => {
      if (cancelled) return;

      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        try {
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
          if (poses && poses.length > 0) {
            const pose = poses[0];
            const keypoints = pose.keypoints;
            let computedScore = 0;

            if (currExercise && currExercise !== "Custom Pose") {
              const evaluation = evaluateExercise(
                currExercise as SupportedExercise,
                keypoints,
                counterStateRef.current
              );
              counterStateRef.current = evaluation.phase;
              computedScore = evaluation.score;
              if (evaluation.countedKey) {
                registerRep(evaluation.countedKey, evaluation.score);
              }
            } else if (currExercise === "Custom Pose" && selectedCustomPose) {
              const similarity = poseSimilarity(keypoints, selectedCustomPose.keypoints);
              if (similarity !== null) {
                computedScore = similarity;
                setRepFeedback(similarity > 80 ? "Pose matched!" : "Adjust pose...");
              } else {
                setRepFeedback("Move fully into frame");
              }
            }

            setFormScore(computedScore);
            setLiveFeedback(`Form score: ${computedScore}%`);
            drawPose(pose);
          }
        } catch (error) {
          console.error("Pose inference error:", error);
        }
      }

      if (!cancelled) {
        timer = setTimeout(processFrame, 100);
      }
    };

    processFrame();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [poseDetector, enableDetection, currExercise, selectedCustomPose, drawPose, registerRep]);

  const submitPendingWorkouts = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      const counts = countsRef.current;

      for (const { key, name } of EXERCISE_MAP) {
        const alreadySubmitted = lastSubmittedRef.current[key];
        const current = counts[key];
        if (current <= alreadySubmitted) continue;

        const reps = current - alreadySubmitted;
        const response = await fetch("/api/user/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientWorkoutId: crypto.randomUUID(),
            exercise: name,
            reps,
          }),
        });

        if (response.ok) {
          lastSubmittedRef.current[key] = current;
        }
      }
    } catch (error) {
      console.error("Failed to submit workout rewards:", error);
    } finally {
      submittingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (totalReps === 0) return;
    const timer = setTimeout(submitPendingWorkouts, 3000);
    return () => clearTimeout(timer);
  }, [exerciseCounts, totalReps, submitPendingWorkouts]);

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
    formScore,
    customPoses,
    selectedCustomPose,
    setSelectedCustomPose,
  };
}

export default useExerciseCounter;
