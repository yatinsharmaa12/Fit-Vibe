import Link from "next/link";
import { ArrowRight, ArrowUpRight, Camera, Check, ChevronDown, Dumbbell, Gift, ScanLine, ShieldCheck, Trophy } from "lucide-react";

const steps = [
  { number: "01", title: "Pick your movement.", description: "Choose an exercise and check the camera guide before you begin." },
  { number: "02", title: "Find your rhythm.", description: "See your reps and movement feedback as you work through each set." },
  { number: "03", title: "Build your momentum.", description: "Complete challenges, collect tokens, and work your way up the leaderboard." },
];

const faqs = [
  { question: "What do I need to get started?", answer: "A device with a camera, a little space to move, and a FitVibe account. Check the exercise guide so the joints being tracked stay visible." },
  { question: "Which exercises can I track?", answer: "FitVibe counts squats, push-ups, pull-ups, shoulder presses, and bicep curls. You can also save a custom pose and compare it with your camera view." },
  { question: "Does FitVibe upload my workout video?", answer: "Workout pose detection runs in your browser. The tracker sends workout summaries to save your progress; it does not upload the camera video." },
  { question: "How accurate is the feedback?", answer: "Tracking works best with good lighting and a clear view of the required joints. Feedback describes what the camera detects. Camera angle, clothing, and visibility can affect the count." },
];

function TrackerPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:ml-auto lg:mr-0">
      <div className="absolute -inset-6 rounded-full bg-yellow-400/5 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#141615] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300"><ScanLine className="h-4 w-4 text-yellow-400" /> Tracker preview</span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">Example session</span>
        </div>
        <div className="relative h-[340px] overflow-hidden sm:h-[390px]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "36px 36px" }}>
          <div className="absolute left-5 top-5 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-300">Squat <span className="ml-2 text-yellow-400">•</span></div>
          <svg viewBox="0 0 400 360" className="h-full w-full" role="img" aria-label="Illustration of a squat with detected shoulder, hip, knee, and ankle points">
            <ellipse cx="217" cy="328" rx="116" ry="10" fill="#ffffff" fillOpacity=".035" />
            <g fill="none" stroke="#303530" strokeLinecap="round" strokeLinejoin="round">
              <path d="M204 106 L184 190 L262 234 L221 310" strokeWidth="38" />
              <path d="M184 190 L130 233 L161 310" strokeWidth="30" />
              <path d="M204 117 L252 151 L295 142 M195 117 L237 160 L280 155" strokeWidth="18" />
              <path d="M219 313 L257 316 M160 313 L191 316" strokeWidth="16" />
            </g>
            <circle cx="213" cy="68" r="28" fill="#303530" />
            <g fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M204 117 L184 190 L262 234 L221 310 M184 190 L130 233 L161 310 M204 117 L252 151 L295 142" />
            </g>
            {[[204,117],[184,190],[262,234],[221,310],[130,233],[161,310],[252,151],[295,142]].map(([cx,cy], i) => <circle key={i} cx={cx} cy={cy} r="5" fill="#facc15" stroke="#141615" strokeWidth="2" />)}
            <g stroke="#facc15" strokeOpacity=".5" strokeWidth="2" fill="none"><path d="M92 67 V45 H114 M300 45 H322 V67 M92 294 V316 H114 M300 316 H322 V294" /></g>
          </svg>
          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl border border-yellow-400/20 bg-[#20251b] px-4 py-3 text-sm text-yellow-100"><Check className="h-4 w-4 shrink-0 text-yellow-400" /> Rep counted. Keep going!</div>
        </div>
        <div className="flex items-end justify-between border-t border-white/10 px-6 py-5">
          <div><p className="text-xs uppercase tracking-widest text-zinc-500">Your set</p><p className="mt-1 text-lg font-medium text-white">One rep closer.</p></div>
          <div className="text-right"><span className="text-4xl font-bold tracking-tight text-yellow-400">08</span><span className="ml-1 text-lg text-zinc-500">/ 12 reps</span></div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <main id="main-content" className="bg-[#090b09] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5 text-xs font-medium text-yellow-300"><span className="h-1.5 w-1.5 rounded-full bg-yellow-400" /> YOUR MOVEMENT. YOUR MOMENTUM.</div>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-8xl">Make every<br />rep <span className="text-yellow-400">count.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-400">Turn your camera into a workout companion. Track your reps, take on challenges, and give yourself a reason to show up again.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-yellow-400 px-7 py-3.5 font-bold text-black transition-colors hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400">Start your workout <ArrowRight className="h-4 w-4" /></Link>
              <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium text-white transition-colors hover:bg-white/5">See how it works <ChevronDown className="h-4 w-4" /></a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500"><span className="flex items-center gap-1.5"><Camera className="h-3.5 w-3.5" /> Use your own camera</span><span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Video stays in your browser</span></div>
          </div>
          <TrackerPreview />
        </div>
      </section>

      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-6 text-sm sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Find your movement</span>
          {['Squats', 'Push-ups', 'Pull-ups', 'Shoulder presses', 'Bicep curls'].map(name => <span key={name} className="flex items-center gap-2 text-zinc-300"><span className="h-1 w-1 rounded-full bg-yellow-400" />{name}</span>)}
        </div>
      </div>

      <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">More than a rep counter</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A little structure.<br />A lot more motivation.</h2></div>
          <p className="max-w-sm leading-relaxed text-zinc-400">Keep the feedback clear, the goals achievable, and the next workout worth coming back for.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: ScanLine, title: 'See your movement.', text: 'Follow live rep counts and clear feedback about what the camera can see.', href: '/dashboard', cta: 'Open the tracker', detail: 'LIVE FEEDBACK', value: 'Move. Check. Repeat.' },
            { icon: Trophy, title: 'Take on a challenge.', text: 'Work through exercise goals and see your progress, one completed set at a time.', href: '/dashboard/challenges', cta: 'Explore challenges', detail: 'BUILD CONSISTENCY', value: 'A goal for your next set.' },
            { icon: Gift, title: 'Earn your next reward.', text: 'Collect workout tokens, explore the rewards store, and climb the leaderboard.', href: '/dashboard/rewards', cta: 'View rewards', detail: 'KEEP IT REWARDING', value: 'Your effort adds up.' },
          ].map(({ icon: Icon, title, text, href, cta, detail, value }) => (
            <article key={title} className="flex flex-col rounded-3xl border border-white/10 bg-[#141614] p-7 transition-colors hover:border-yellow-400/30">
              <Icon className="mb-8 h-7 w-7 text-yellow-400" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{text}</p>
              <div className="my-7 rounded-xl border border-white/5 bg-black/20 px-4 py-5"><p className="text-[10px] tracking-widest text-zinc-500">{detail}</p><p className="mt-2 text-sm text-zinc-200">{value}</p></div>
              <Link href={href} className="flex items-center justify-between text-sm font-semibold text-yellow-300 hover:text-yellow-200">{cta}<ArrowUpRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">From camera to progress</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Ready in three simple steps.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">{steps.map(step => <div key={step.number}><span className="text-4xl font-light text-yellow-400/50">{step.number}</span><h3 className="mt-5 text-xl font-semibold">{step.title}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">{step.description}</p></div>)}</div>
        </div>
      </section>

      <section id="questions" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 md:grid-cols-[1fr_1.4fr]">
        <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Good to know</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Before your first rep.</h2><p className="mt-4 max-w-sm leading-relaxed text-zinc-400">A few answers to help you feel at home.</p></div>
        <div className="divide-y divide-white/10 border-y border-white/10">{faqs.map(faq => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" /></summary><p className="mt-4 pr-7 text-sm leading-relaxed text-zinc-400">{faq.answer}</p></details>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-7 rounded-3xl bg-yellow-400 p-8 text-black sm:p-12 md:flex-row md:items-center"><div><Dumbbell className="mb-5 h-7 w-7" /><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your next rep starts here.</h2><p className="mt-3 text-black/70">Pick an exercise. Find your rhythm. Make it a habit.</p></div><Link href="/register" className="inline-flex shrink-0 items-center gap-3 rounded-full bg-black px-7 py-4 font-semibold text-white hover:bg-zinc-800">Create your account <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    </main>
  );
}
