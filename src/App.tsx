import ChatBot from "./components/ChatBot";
import ElectionGuide from "./components/ElectionGuide";
import Resources from "./components/Resources";
import PollingBoothLocator from "./components/PollingBoothLocator";
import { STATS } from "./constants";
import { Vote, PhoneCall } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen pb-12">

      {/* ── Top Tricolour Bar ─────────────────────────────────── */}
      <div className="tricolour-stripe" />

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="border-b-2 border-[var(--color-ink)] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[var(--color-ink)] flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0px_0px_var(--color-ink)]"
              style={{
                background: "linear-gradient(135deg, var(--color-saffron) 33.3%, white 33.3%, white 66.6%, var(--color-india-green) 66.6%)"
              }}
              aria-hidden="true"
            >
              <Vote size={26} className="text-[var(--color-ink)] drop-shadow-sm" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-[var(--color-ink)]">
                Election Assistant
              </h1>
              <p className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-[0.2em] mt-0.5">
                Indian Election Process Education Assistant
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-ink)] rounded-full border-2 border-[var(--color-ink)]">
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[var(--color-india-green)] animate-ping opacity-70" />
                <span className="relative w-2 h-2 rounded-full bg-[var(--color-india-green)] block" />
              </span>
              <span className="text-[10px] font-mono text-white uppercase tracking-widest">Election Guide Active</span>
            </div>

            {/* Helpline */}
            <a
              href="tel:1950"
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[var(--color-ink)] rounded-full hover:bg-gray-50 transition-colors"
              aria-label="Call ECI Voter Helpline 1950"
            >
              <PhoneCall size={13} aria-hidden="true" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Helpline 1950</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <div className="border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)]" role="region" aria-label="Election statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center sm:justify-start">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span
                  className="text-xl font-extrabold tracking-tight font-mono"
                  style={{ color: stat.color }}
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  {stat.value}
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Row 1: Guide + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Election Guide — wider */}
          <div className="lg:col-span-8 card p-6 sm:p-8">
            <ElectionGuide />
          </div>

          {/* Chat — sticky sidebar */}
          <div
            className="lg:col-span-4 card overflow-hidden"
            style={{ minHeight: "560px" }}
          >
            <ChatBot />
          </div>
        </div>

        {/* Row 2: Resources + Booth Locator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Resources */}
          <div className="lg:col-span-8 card p-6 sm:p-8">
            <Resources />
          </div>

          {/* Booth Locator */}
          <div className="lg:col-span-4 card p-6 sm:p-8" style={{ boxShadow: "4px 4px 0px 0px var(--color-saffron)" }}>
            <PollingBoothLocator />
          </div>
        </div>

        <footer className="py-8 text-center" role="contentinfo">
          <p className="text-sm font-mono font-bold tracking-widest uppercase text-gray-500 hover:text-gray-900 transition-colors">
            Developed by Saranaeswar
          </p>
        </footer>

      </main>
    </div>
  );
}
