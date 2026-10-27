"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type * as posedetection from "@tensorflow-models/pose-detection";
import { loadPoseEngine } from "@/lib/pose-engine";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export default function PoseCreation() {
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [poseData, setPoseData] = useState<posedetection.Pose | null>(null);
  const [detectorError, setDetectorError] = useState(false);
  const poseLibraryRef = useRef<typeof posedetection | null>(null);
  const hasImage = Boolean(imageURL);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: session } = useSession();

  // Loading an image is the first point where inference is needed.
  useEffect(() => {
    if (!hasImage) return;
    let disposed = false;
    let instance: posedetection.PoseDetector | null = null;
    async function initDetector() {
      try {
        const pose = await loadPoseEngine();
        if (disposed) return;
        poseLibraryRef.current = pose;
        instance = await pose.createDetector(pose.SupportedModels.MoveNet, {
          modelType: pose.movenet.modelType.SINGLEPOSE_LIGHTNING,
        });
        if (disposed) { instance.dispose(); return; }
        setDetector(instance);
      } catch (error) {
        console.error('Pose detector failed to load:', error);
        if (!disposed) setDetectorError(true);
      }
    }
    initDetector();
    return () => { disposed = true; instance?.dispose(); };
  }, [hasImage]);

  // Handle image upload.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageURL(url);
      setPoseData(null);
    }
  };

  // Run pose detection on the loaded image.
  const detectPoseFromImage = useCallback(async () => {
    if (!detector || !imageRef.current) return;
    try {
      const poses = await detector.estimatePoses(imageRef.current);
      if (poses && poses.length > 0) {
        setPoseData(poses[0]);
        toast({ title: "Pose detected successfully!", variant: "success" });
      } else {
        toast({ title: "No pose detected.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Pose detection error:", error);
      toast({ title: "Error detecting pose.", variant: "destructive" });
    }
  }, [detector]);

  // Draw the image, pose keypoints and skeleton on the canvas.
  const drawPose = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear previous drawings.
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw image.
    ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // If pose data exists, draw keypoints and skeleton.
    if (poseData) {
      // Draw keypoints.
      poseData.keypoints.forEach((kp) => {
        if (kp.score && kp.score > 0.5 && kp.x >= 0 && kp.y >= 0) {
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });
      // Draw skeleton.
      const poseLibrary = poseLibraryRef.current;
      const adjacentPairs = poseLibrary ? poseLibrary.util.getAdjacentPairs(poseLibrary.SupportedModels.MoveNet) : [];
      adjacentPairs.forEach(([i, j]) => {
        const kp1 = poseData.keypoints[i];
        const kp2 = poseData.keypoints[j];
        if (
          kp1.score! > 0.5 &&
          kp2.score! > 0.5 &&
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
    }
  }, [poseData]);

  // Redraw the canvas whenever the image or pose data updates.
  useEffect(() => {
    if (imageURL) {
      const image = new Image();
      image.src = imageURL;
      image.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.width = image.width;
          canvasRef.current.height = image.height;
        }
        if (imageRef.current) {
          imageRef.current.src = imageURL;
        }
        drawPose();
      };
    }
  }, [imageURL, drawPose]);

  // Redraw when poseData change.
  useEffect(() => {
    if (imageURL) {
      drawPose();
    }
  }, [poseData, imageURL, drawPose]);

  // Save pose action; call API to store pose data
  const handleSavePose = async () => {
    if (poseData && session?.user?.email) {
      try {
        const response = await fetch("/api/user/addPose", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ poseData }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({ title: "Pose saved successfully!", variant: "success" });
        } else {
          toast({ title: "Failed to save pose", description: data.error, variant: "destructive" });
        }
      } catch (error) {
        console.error("Error saving pose:", error);
        toast({ title: "Error saving pose", variant: "destructive" });
      }
    } else {
      if (!poseData) {
        toast({ title: "No pose detected to save.", variant: "destructive" });
      } else if (!session?.user?.email) {
        toast({ title: "You must be logged in to save a pose.", variant: "destructive" });
      }
    }
  };

  return (
    <Card className="rounded-3xl border-2 border-white/10 bg-zinc-900/50 p-6 text-white shadow-2xl shadow-black/50 backdrop-blur-xl md:p-8">
      <div className="mb-4">
        <h2 className="mb-2 text-2xl font-bold text-white">Create New Pose from Image</h2>
        <p className="mb-5 text-sm text-zinc-400">Choose a clear image with your body in frame.</p>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:font-bold file:text-black hover:file:bg-yellow-300" />
      </div>
      {imageURL && (
        <div className="mb-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
            <canvas ref={canvasRef} className="w-full h-auto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imageRef} style={{ display: "none" }} alt="Uploaded" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={detectPoseFromImage} disabled={!detector} className="rounded-xl bg-yellow-400 font-bold text-black hover:bg-yellow-300">{detectorError ? 'Tracker unavailable' : detector ? 'Detect Pose' : 'Loading tracker…'}</Button>
            <Button onClick={handleSavePose} variant="outline" className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">Save Pose</Button>
          </div>
          {detectorError && <p role="alert" className="mt-3 text-sm text-red-400">The pose tracker could not load. Refresh the page to try again.</p>}
        </div>
      )}
      {!imageURL && (
        <p className="text-zinc-400">Upload an image to create a new pose.</p>
      )}
    </Card>
  );
}
