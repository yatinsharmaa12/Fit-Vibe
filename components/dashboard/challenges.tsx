"use client"
import { Card } from '@/components/ui/card';
import { Trophy, Gift, Timer, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';

type ExerciseProgress = {
  exercise: string;
  reps: number;
  required: number;
  completed: boolean;
};

type ChallengeView = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: string;
  reward: number;
  startedAt: string | null;
  completedAt: string | null;
  completed: boolean;
  progress: ExerciseProgress[];
};

const DIFFICULTY_ICONS: Record<string, LucideIcon> = {
  Beginner: Dumbbell,
  Intermediate: Timer,
  Advanced: Trophy,
  Expert: Gift,
};

export default function ChallengesDashboard() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<ChallengeView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  const loadChallenges = useCallback(async () => {
    try {
      const response = await fetch('/api/user/challenges');
      if (!response.ok) {
        throw new Error('Failed to load challenges');
      }
      const data = await response.json();
      setChallenges(data.challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({ title: 'Unable to load challenges', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const startChallenge = async (challenge: ChallengeView) => {
    setStartingId(challenge.id);
    try {
      const response = await fetch('/api/user/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start challenge');
      }

      toast({ title: `${challenge.title} started`, variant: 'success' });
      await loadChallenges();
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Unable to start challenge',
        description: error instanceof Error ? error.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setStartingId(null);
    }
  };

  return (
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

          {isLoading ? (
            <div className="text-zinc-400">Loading challenges...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {challenges.map((challenge) => {
                const Icon = DIFFICULTY_ICONS[challenge.difficulty] || Dumbbell;
                return (
                  <Card key={challenge.id} className="p-8 bg-zinc-900/50 backdrop-blur-xl border-2 border-white/10 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-black/50">
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-zinc-800 border border-white/10 text-yellow-400">
                            <Icon className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{challenge.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 border border-white/5">
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
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Progress</div>
                      <div className="space-y-3">
                        {challenge.progress.map((item) => (
                          <div key={item.exercise}>
                            <div className="flex items-center justify-between text-xs font-medium text-white">
                              <span>{item.exercise}</span>
                              <span className={item.completed ? 'text-green-400' : 'text-zinc-400'}>
                                {Math.min(item.reps, item.required)} / {item.required}
                              </span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.completed ? 'bg-green-500' : 'bg-yellow-400'}`}
                                style={{ width: `${Math.min(100, (item.reps / item.required) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 relative z-10">
                      <Button
                        onClick={() => startChallenge(challenge)}
                        disabled={challenge.completed || startingId === challenge.id}
                        className={`w-full py-6 rounded-2xl text-lg font-black transition-all ${challenge.completed
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border-white/5"
                          : "bg-yellow-400 hover:bg-yellow-300 text-black shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40"}`}
                      >
                        {challenge.completed
                          ? "CHALLENGE COMPLETED"
                          : startingId === challenge.id
                            ? "STARTING..."
                            : challenge.startedAt
                              ? "CONTINUE CHALLENGE"
                              : "START CHALLENGE"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
  );
}
