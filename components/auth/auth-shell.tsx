import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ScanLine, Trophy, Gift } from "lucide-react";
import logo from "@/public/logo.png";

export function AuthShell({ children, registering = false }: { children: React.ReactNode; registering?: boolean }) {
  return (
    <div className="min-h-svh bg-[#090b09] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="FitVibe home" className="flex items-center gap-2 text-xl font-bold">
            <Image src={logo} alt="" width={32} height={32} />
            <span>Fit<span className="text-yellow-400">Vibe</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-24">
        <section className="hidden lg:block">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Your movement. Your momentum.</p>
          <h2 className="text-6xl font-bold leading-[1.05] tracking-tight">{registering ? "Start strong." : "Welcome back."}<br /><span className="text-yellow-400">Make it count.</span></h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">A little movement today. A little more progress tomorrow. Your next workout starts here.</p>
          <div className="mt-12 space-y-6">
            {[{icon: ScanLine, title: "Find your rhythm", text: "Track your reps with live movement feedback."}, {icon: Trophy, title: "Give yourself a goal", text: "Take on challenges and follow your progress."}, {icon: Gift, title: "Keep coming back", text: "Earn tokens and explore your next reward."}].map(({icon: Icon, title, text}) => (
              <div key={title} className="flex items-start gap-4"><div className="rounded-2xl border border-yellow-400/15 bg-yellow-400/5 p-3"><Icon className="h-5 w-5 text-yellow-400" /></div><div><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm text-zinc-400">{text}</p></div></div>
            ))}
          </div>
        </section>
        <section aria-label={registering ? "Create your account" : "Sign in to FitVibe"} className="mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-[#141614] p-6 shadow-2xl shadow-black/20 sm:p-9">
          {children}
        </section>
      </main>
      <footer className="px-5 pb-8 text-center text-xs text-zinc-500">FitVibe · A little movement. A little more momentum.</footer>
    </div>
  );
}
