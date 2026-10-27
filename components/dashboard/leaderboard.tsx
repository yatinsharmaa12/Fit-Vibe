'use client';

import { Avatar } from '@/components/ui/avatar';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Medal, Trophy, Crown, RefreshCw } from 'lucide-react';
import { useState, useEffect } from "react"
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  points: number;
  image?: string;
  rank?: number;
}

const DEFAULT_AVATAR = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"

export function Leaderboard({ showFullLink = true }: { showFullLink?: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/getTopUsers`);
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Card className="bg-zinc-900 border-0 shadow-2xl ring-1 ring-white/10 rounded-3xl overflow-hidden h-full">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-zinc-900 via-zinc-900 to-black flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h2>
          <p className="text-zinc-400 text-sm mt-1">All-time leaderboard</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={getAllUsers}
          disabled={isLoading}
          className="text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="p-0">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading champions...</div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.slice(0, 5).map((user, index) => {
              let rankColor = "bg-zinc-800 text-zinc-400";
              let Icon = null;

              if (index === 0) {
                rankColor = "bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50";
                Icon = Crown;
              } else if (index === 1) {
                rankColor = "bg-zinc-300/20 text-zinc-300 ring-1 ring-zinc-300/50";
                Icon = Medal;
              } else if (index === 2) {
                rankColor = "bg-orange-600/20 text-orange-600 ring-1 ring-orange-600/50";
                Icon = Medal;
              }

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${rankColor}`}>
                      {index + 1}
                    </div>

                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-white/20 transition-all">
                        <Image
                          src={user.image || DEFAULT_AVATAR}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_AVATAR;
                          }}
                        />
                      </Avatar>
                      {Icon && <Icon className="absolute -top-1 -right-1 w-4 h-4 fill-current text-inherit" />}
                    </div>

                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500">Level 5 Athlete</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">{user.points.toLocaleString()}</div>
                    <div className="text-xs text-zinc-500">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showFullLink && (
        <div className="p-4 border-t border-white/10 bg-zinc-950/50 text-center">
          <Button asChild variant="link" className="text-yellow-500 text-sm hover:text-yellow-400">
            <Link href="/dashboard/leaderboard">View Full Leaderboard</Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
