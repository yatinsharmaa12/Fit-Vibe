"use client";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ExerciseType, useExerciseCounter } from "@/hooks/useExerciseCounter";
import { useEffect, useRef } from "react";
import { EXERCISE_GUIDES } from "@/lib/exercise-counter";
import { Button } from "../ui/button";
import { Camera, Activity, Volume2 } from "lucide-react";

export function LiveTracking() {
  const {
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
  } = useExerciseCounter();

  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const milestoneAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // optional initial toast
    // toast({ title: "Select an exercise to start!", variant: "default" });
  }, []);

  useEffect(() => {
    if (currExercise && startAudioRef.current) {
      startAudioRef.current
        .play()
        .catch((err) => console.error("Start Audio Error:", err));
    }
  }, [currExercise]);

  useEffect(() => {
    const checkMilestone = (name: ExerciseType, count: number) => {
      if (count > 0 && count % 5 === 0) {
        if (milestoneAudioRef.current) {
          milestoneAudioRef.current
            .play()
            .catch((err) => console.error("Milestone Audio Error:", err));
        }
        toast({ title: `Milestone: ${count} ${name}(s)!`, variant: "success" });
      }
    };
    checkMilestone("Squat", exerciseCounts.squat);
    checkMilestone("Push-Up", exerciseCounts.pushup);
    checkMilestone("Pull-Up", exerciseCounts.pullup);
    checkMilestone("Shoulder Press", exerciseCounts.shoulderPress);
    checkMilestone("Bicep Curl", exerciseCounts.bicepCurl);
  }, [exerciseCounts]);

  const exerciseOptions: ExerciseType[] = [
    "Push-Up",
    "Pull-Up",
    "Squat",
    "Shoulder Press",
    "Bicep Curl",
    "Custom Pose",
  ];
  const guide = currExercise && currExercise !== "Custom Pose" ? EXERCISE_GUIDES[currExercise] : null;
  const canStart = Boolean(currExercise && (currExercise !== "Custom Pose" || selectedCustomPose));

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-zinc-900 ring-1 ring-white/10 rounded-3xl">
      <audio ref={startAudioRef} src="/start.mp3" preload="auto" />
      <audio ref={milestoneAudioRef} src="/start.mp3" preload="auto" />

      {/* Header */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-zinc-900 to-black">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-yellow-500" />
            AI Workout Tracker
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Real-time pose detection powered by TensorFlow.js
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 rounded-full px-4 py-2 flex items-center gap-2 border border-white/5">
            <Volume2 className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-white">Voice On</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-zinc-900/50 flex flex-wrap gap-2 justify-center border-b border-white/5">
        {exerciseOptions.map((option) => (
          <Button
            key={option}
            variant={currExercise === option ? "default" : "outline"}
            onClick={() => setCurrExercise(option)}
            className={`rounded-full border-zinc-700 ${currExercise === option ? "bg-yellow-500 hover:bg-yellow-600 text-black font-bold" : "text-zinc-300 hover:text-white hover:bg-zinc-800"}`}
            size="sm"
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Show the actual counting rules before the camera starts. */}
      <section className="p-5 md:p-6 border-b border-white/10 bg-zinc-950" aria-label="Exercise guide">
        <h3 className="text-lg font-bold text-yellow-400">Before you start: {currExercise || "choose an exercise"}</h3>
        {guide ? (
          <div className="mt-3 grid gap-4 text-sm text-zinc-200 md:grid-cols-2">
            <div>
              <p><span className="font-semibold text-white">Joints tracked:</span> {guide.joints}</p>
              <p className="mt-2"><span className="font-semibold text-white">Movement measured:</span> {guide.movement}</p>
              <p className="mt-2"><span className="font-semibold text-white">Camera:</span> {guide.camera}</p>
            </div>
            <div>
              <ol className="list-inside list-decimal space-y-1">
                <li>{guide.start}</li>
                <li>{guide.middle}</li>
                <li>{guide.end}</li>
              </ol>
              <p className="mt-2 text-zinc-400">
                Tracking checks: at least {guide.minimumRange}° of {guide.joint} movement;
                {` ${(guide.minimumMs / 1000).toFixed(1)}–${guide.maximumMs / 1000}`} seconds per rep.
              </p>
            </div>
          </div>
        ) : currExercise === "Custom Pose" ? (
          <p className="mt-2 text-sm text-zinc-300">Select a saved pose, then keep your body in frame. Custom poses show similarity; they do not count workout reps.</p>
        ) : (
          <p className="mt-2 text-sm text-zinc-300">Choose an exercise above to see the joints, movement and rep rules before enabling the camera.</p>
        )}
        <p className="mt-3 text-xs text-zinc-500">These camera thresholds describe how the app counts movement. They are not a medical assessment of exercise form.</p>
      </section>

      {/* Custom Pose Selector */}
      {currExercise === "Custom Pose" && customPoses.length > 0 && (
        <div className="p-4 bg-zinc-900/50 flex justify-center border-b border-white/5">
          <select
            className="bg-zinc-800 text-white p-2 rounded-md border border-zinc-700"
            onChange={(e) => {
              const pose = customPoses.find(p => p._id === e.target.value);
              setSelectedCustomPose(pose ?? null);
            }}
            value={selectedCustomPose?._id || ""}
          >
            <option value="" disabled>Select a Custom Pose</option>
            {customPoses.map((pose) => (
              <option key={pose._id} value={pose._id}>
                Pose created on {new Date(pose.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}
      {currExercise === "Custom Pose" && customPoses.length === 0 && (
        <div className="p-4 bg-zinc-900/50 flex justify-center border-b border-white/5 text-zinc-400 text-sm">
          No custom poses found. Create one in the &quot;Add Pose&quot; section.
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative">
        {/* Video Container */}
        <div className="relative bg-black w-full aspect-video overflow-hidden group">

          {/* Default State Overlay */}
          {!enableDetection && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-20">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6 animate-pulse">
                <Activity className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Start?</h3>
              <p className="text-zinc-400 mb-8 max-w-md text-center">Enable your camera to start tracking your {currExercise || "workout"}. Make sure your full body is visible.</p>

              <Button
                size="lg"
                onClick={toggleCamera}
                disabled={!canStart}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-6 text-xl rounded-full shadow-lg hover:shadow-yellow-500/25 transition-all"
              >
                {canStart ? "Start Flexing" : "Select Exercise First"}
              </Button>
            </div>
          )}

          {/* Active State Overlay (Hidden when not enabled) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
            style={{ visibility: enableDetection ? "visible" : "hidden" }}
          />
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* HUD Overlay */}
          {enableDetection && (
            <>
              <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-white font-medium text-sm">{liveFeedback || "Detecting..."}</span>
                </div>
                {currExercise === "Custom Pose" && selectedCustomPose && (
                  <span className="text-xs text-zinc-300 bg-black/60 px-3 py-1.5 rounded-lg w-fit">Pose similarity: {formScore}%</span>
                )}
                {repFeedback && (
                  <div className="bg-yellow-500 text-black font-bold px-3 py-1.5 rounded-lg text-sm shadow-lg" role="status" aria-live="polite">
                    {repFeedback}
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={toggleCamera}
                  className="rounded-full px-6 shadow-xl border border-white/20"
                >
                  Stop Session
                </Button>
              </div>
            </>
          )}

        </div>

        {/* Stats Bar */}
        <div className="bg-zinc-950 p-6 flex justify-between items-center border-t border-white/10">
          <div className="text-left">
            <div className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Current Exercise</div>
            <div className="text-white text-2xl font-bold">{currExercise || "Select Exercise"}</div>
          </div>

          <div className="text-right">
            <div className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Total Reps</div>
            <div className="text-4xl font-black text-yellow-500">
              {currExercise === "Push-Up" ? exerciseCounts.pushup :
                currExercise === "Pull-Up" ? exerciseCounts.pullup :
                  currExercise === "Squat" ? exerciseCounts.squat :
                    currExercise === "Shoulder Press" ? exerciseCounts.shoulderPress :
                      currExercise === "Bicep Curl" ? exerciseCounts.bicepCurl : 0}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LiveTracking;
