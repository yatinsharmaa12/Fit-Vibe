export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8" aria-busy="true" aria-label="Loading page">
      <p role="status" className="mb-6 text-sm text-zinc-400">Loading your page…</p>
      <div className="mb-4 h-10 w-64 rounded-xl bg-zinc-800 motion-safe:animate-pulse" />
      <div className="mb-12 h-5 max-w-md rounded-lg bg-zinc-900 motion-safe:animate-pulse" />
      <div className="grid gap-8 md:grid-cols-2">{[0, 1].map(i => <div key={i} className="h-72 rounded-3xl border border-white/10 bg-zinc-900/50 motion-safe:animate-pulse" />)}</div>
    </main>
  );
}
