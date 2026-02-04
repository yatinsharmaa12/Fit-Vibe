"use client"
import { Card } from '@/components/ui/card';
import { Trophy, Gift, Timer, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DashboardNavbar } from './dashboard-navbar';

const challenges = [
  {
    id: '110',
    title: '5 Rep Challenge',
    reps: 5,
    description: 'Complete 5 reps of each exercise',
    exercises: ['Push-ups', 'Squats', 'Burpees'],
    reward: 100,
    difficulty: 'Beginner',
    timeLimit: '5 minutes',
    icon: Dumbbell,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400"
  },
  {
    id: '111',
    title: '10 Rep Challenge',
    reps: 10,
    description: 'Complete 10 reps of each exercise',
    exercises: ['Push-ups', 'Squats', 'Lunges', 'Sit-ups'],
    reward: 250,
    difficulty: 'Intermediate',
    timeLimit: '10 minutes',
    icon: Timer,
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400"
  },
  {
    id: '112',
    title: '20 Rep Challenge',
    reps: 20,
    description: 'Complete 20 reps of each exercise',
    exercises: ['Push-ups', 'Squats', 'Burpees', 'Mountain Climbers'],
    reward: 500,
    difficulty: 'Advanced',
    timeLimit: '15 minutes',
    icon: Trophy,
    gradient: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400"
  },
  {
    id: '113',
    title: '30 Rep Challenge',
    reps: 30,
    description: 'Complete 30 reps of each exercise',
    exercises: ['Push-ups', 'Squats', 'Burpees', 'Planks', 'Jump Rope'],
    reward: 1000,
    difficulty: 'Expert',
    timeLimit: '20 minutes',
    icon: Gift,
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    iconColor: "text-green-400"
  },
];

export default function ChallengesDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const { data: session } = useSession();
  const [reps, setReps] = useState(0);

  useEffect(() => {
    async function fun() {
      const email = session?.user?.email;
      if (!email) return;

      try {
        const response = await fetch(`/api/getCurrUser?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setReps(data.data.user.calories / 5);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
    fun();
  }, [session]);

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Fitness Challenges
            </h1>
            <p className="text-zinc-400 mt-3 text-lg max-w-2xl">
              Push your limits, earn massive rewards, and dominate the world-class leaderboard.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {challenges.map((challenge) => (
              <Card key={challenge.title} className={`p-8 bg-zinc-900/50 backdrop-blur-xl border-2 ${challenge.border} overflow-hidden relative group hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-black/50`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${challenge.gradient} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity`} />

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl bg-zinc-800 border border-white/10 ${challenge.iconColor}`}>
                        <challenge.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{challenge.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 border border-white/5`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-zinc-500 text-xs flex items-center gap-1">
                            <Timer className="w-3 h-3" /> {challenge.timeLimit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-black">
                      <Trophy className="h-5 w-5" />
                      <span>{challenge.reward}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Reward Tokens</span>
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Required Exercises</div>
                  <div className="flex flex-wrap gap-2">
                    {challenge.exercises.map((exercise) => (
                      <span
                        key={exercise}
                        className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                      >
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  <Link href="/dashboard">
                    <Button
                      className={`w-full py-6 rounded-2xl text-lg font-black transition-all ${reps >= challenge.reps
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border-white/5"
                        : "bg-yellow-400 hover:bg-yellow-300 text-black shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40"}`}
                      disabled={reps >= challenge.reps}
                    >
                      {reps >= challenge.reps ? "CHALLENGE COMPLETED" : "START CHALLENGE"}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

