import { Leaderboard } from '@/components/dashboard/leaderboard';

export default function LeaderboardPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent">
            Leaderboard
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-400">
            See the top performers ranked by total workout points.
          </p>
        </div>
        <div className="max-w-3xl">
          <Leaderboard showFullLink={false} />
        </div>
      </div>
    </main>
  );
}
