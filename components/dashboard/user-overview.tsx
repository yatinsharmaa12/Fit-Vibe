'use client';

import { Activity, Coins, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

export function UserOverview() {
  const [rank, setRank] = useState("");
  const [calories, setCalories] = useState("")
  const [tokens, setTokens] = useState("")
  const [error, setError] = useState("");
  const { status, data: session } = useSession();

  const stats = [
    {
      name: 'Calories Burned',
      value: calories == "loading..." ? "..." : calories ? `${calories}` : '0',
      unit: 'kcal',
      icon: Activity,
      change: '+12%',
      changeType: 'positive',
      color: "from-orange-500 to-red-600",
      iconColor: "text-orange-100"
    },
    {
      name: 'Tokens Earned',
      value: tokens == "loading..." ? "..." : tokens ? `${tokens}` : '0',
      unit: 'tokens',
      icon: Coins,
      change: '+8%',
      changeType: 'positive',
      color: "from-yellow-400 to-orange-500",
      iconColor: "text-yellow-100"
    },
    {
      name: 'Global Rank',
      value: rank == "loading..." ? "..." : rank ? `#${rank}` : 'N/A',
      unit: 'Place',
      icon: Trophy,
      change: '+3',
      changeType: 'positive',
      color: "from-blue-500 to-purple-600",
      iconColor: "text-blue-100"
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = session?.user?.email;
        if (!email) {
          // throw new Error('No user email found');
          return;
        }

        const response = await fetch(
          `/api/getCurrUser?email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCalories(data.data.user.calories);
        setTokens(data.data.user.tokens)
        // setRank(data.data.rank); // Assuming API returns rank
        setRank("42"); // Mock rank if API doesn't return it yet
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setRank("...");
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat, i) => (
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

          <div className="relative z-10 mt-6 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-medium">
              {stat.changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </div>
            <span className="text-xs text-white/60">vs last week</span>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}
