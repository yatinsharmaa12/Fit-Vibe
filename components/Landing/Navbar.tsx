"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "@/public/logo.png";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Questions", href: "#questions" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090b09]/95 text-white backdrop-blur-lg">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-yellow-400 focus:p-3 focus:text-black">Skip to content</a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="FitVibe home" className="flex items-center gap-2 text-xl font-bold tracking-tight"><Image src={logo} alt="" width={32} height={32} /><span>Fit<span className="text-yellow-400">Vibe</span></span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">{links.map(link => <a key={link.href} href={link.href} className="transition-colors hover:text-white">{link.label}</a>)}</nav>
        <div className="hidden items-center gap-6 text-sm md:flex"><Link href="/login" className="text-zinc-300 hover:text-white">Log in</Link><Link href="/dashboard" className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 font-bold text-black hover:bg-yellow-300">Get started <ArrowUpRight className="h-4 w-4" /></Link></div>
        <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="home-mobile-menu" onClick={() => setOpen(!open)} className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav id="home-mobile-menu" aria-label="Mobile navigation" className="space-y-1 border-t border-white/10 bg-[#111411] px-5 py-4 md:hidden">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-zinc-300 hover:bg-white/5">{link.label}</a>)}<div className="flex gap-3 pt-3"><Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-white/20 px-4 py-3 text-center text-sm">Log in</Link><Link href="/dashboard" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-yellow-400 px-4 py-3 text-center text-sm font-bold text-black">Get started</Link></div></nav>}
    </header>
  );
}
