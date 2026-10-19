'use client';

import { Activity, Coins, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

type OverviewStats = {
  calories: number;
  tokens: number;
  rank: number | null;
};

export function UserOverview() {
  const [stats, setStats] = useState<OverviewStats>({ calories: 0, tokens: 0, rank: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getCurrUser');
        if (!response.ok) {
          throw new Error('Unable to load your stats');
        }
        const data = await response.json();
        if (cancelled) return;
        setStats({
          calories: data.data.user.calories ?? 0,
          tokens: data.data.user.tokens ?? 0,
          rank: data.data.rank ?? null,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayValue = (value: number | null, prefix = '') => {
    if (isLoading) return '...';
    if (value === null) return 'N/A';
    return `${prefix}${value}`;
  };

  const cards = [
    {
      name: 'Calories Burned',
      value: displayValue(isLoading ? null : stats.calories),
      unit: 'kcal',
      icon: Activity,
      color: "from-orange-500 to-red-600",
      iconColor: "text-orange-100"
    },
    {
      name: 'Tokens Earned',
      value: displayValue(isLoading ? null : stats.tokens),
      unit: 'tokens',
      icon: Coins,
      color: "from-yellow-400 to-orange-500",
      iconColor: "text-yellow-100"
    },
    {
      name: 'Global Rank',
      value: isLoading ? '...' : stats.rank ? `#${stats.rank}` : 'N/A',
      unit: 'Place',
      icon: Trophy,
      color: "from-blue-500 to-purple-600",
      iconColor: "text-blue-100"
    },
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl bg-gradient-to-br ${stat.color}`}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-white/80 font-medium text-sm mb-1">{stat.name}</p>
                <h3 className="text-4xl font-bold text-white tracking-tight">
                  {stat.value} <span className="text-lg font-normal text-white/70">{stat.unit}</span>
                </h3>
              </div>
              <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-md ${stat.iconColor}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
