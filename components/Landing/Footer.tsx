import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090b09] text-zinc-400">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center">
        <div><Link href="/" className="text-xl font-bold text-white">Fit<span className="text-yellow-400">Vibe</span></Link><p className="mt-2 text-sm">A little movement. A little more momentum.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 text-sm"><Link href="/dashboard/challenges" className="hover:text-yellow-400">Challenges</Link><Link href="/dashboard/rewards" className="hover:text-yellow-400">Rewards</Link><Link href="/dashboard/leaderboard" className="hover:text-yellow-400">Leaderboard</Link><a href="https://github.com/Aryainguz/fitvibe" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">GitHub ↗</a></nav>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/5 px-5 py-5 text-xs text-zinc-500 sm:px-8">© {new Date().getFullYear()} FitVibe. Made by Aryan and Ayush.</div>
    </footer>
  );
}
