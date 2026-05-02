import { useState } from "react";
import { RESOURCES } from "../constants";
import { ExternalLink, CheckCircle2, XCircle, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface EligibilityResult {
  eligible: boolean;
  message: string;
  detail: string;
}

export default function Resources() {
  const [age, setAge] = useState("");
  const [isIndian, setIsIndian] = useState<boolean | null>(null);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const checkEligibility = async () => {
    if (!age || isIndian === null) return;
    setLoading(true);
    setErr(null);
    setResult(null);

    try {
      const res = await fetch("/api/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: parseInt(age, 10), isIndian }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setErr(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
      aria-label="Resources and Eligibility Checker"
    >
      {/* Official Portals */}
      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Official Portals</h2>
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest font-mono mt-1">
            Trusted Government Sources
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex flex-col gap-2 group no-underline hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-saffron)]"
              aria-label={`Visit ${r.name} — ${r.description}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl" aria-hidden="true">{r.icon}</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "tag text-[9px]",
                    r.badge === "Official" ? "bg-[var(--color-india-green)] text-white border-[var(--color-india-green)]"
                    : r.badge === "App" ? "bg-[var(--color-ashoka)] text-white border-[var(--color-ashoka)]"
                    : "bg-[var(--color-saffron)] text-white border-[var(--color-saffron)]"
                  )}>
                    {r.badge}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-gray-300 group-hover:text-[var(--color-saffron)] transition-colors"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--color-ink)]">{r.name}</h3>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5 leading-snug">{r.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="flex items-center gap-3 p-3 bg-green-50 border-2 border-dashed border-green-200 rounded-2xl">
          <ShieldCheck size={18} className="text-[var(--color-india-green)] flex-shrink-0" aria-hidden="true" />
          <p className="text-[10px] font-bold text-green-800 uppercase tracking-wider font-mono">
            Always verify you're on a .gov.in domain before submitting personal information.
          </p>
        </div>
      </div>

      {/* Eligibility Checker */}
      <div
        className="card card-ashoka p-6"
        aria-label="Voter Eligibility Checker"
      >
        <div className="mb-5">
          <div className="tag mb-2" style={{ background: "var(--color-ashoka)", color: "white", borderColor: "var(--color-ashoka-dark)" }}>
            Free Tool
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Check Eligibility</h2>
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest font-mono mt-1">
            Are you eligible to vote?
          </p>
        </div>

        <div className="space-y-4">
          {/* Age Input */}
          <div>
            <label
              htmlFor="voter-age"
              className="block text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1.5 font-mono"
            >
              Your Age (years)
            </label>
            <input
              id="voter-age"
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="Enter your age"
              className="input"
              min="1"
              max="150"
              aria-describedby="age-hint"
            />
            <p id="age-hint" className="text-[10px] text-[var(--color-muted)] mt-1 font-mono">
              Minimum voting age is 18 years (as on January 1 of qualifying year)
            </p>
          </div>

          {/* Citizenship */}
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1.5 font-mono">
              Citizenship
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "🇮🇳 Indian Citizen", value: true },
                { label: "🌍 Other", value: false },
              ].map(({ label, value }) => (
                <button
                  key={String(value)}
                  onClick={() => setIsIndian(value)}
                  type="button"
                  aria-pressed={isIndian === value}
                  className={cn(
                    "py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all",
                    isIndian === value
                      ? "bg-[var(--color-ashoka)] border-[var(--color-ashoka-dark)] text-white shadow-[3px_3px_0px_0px_var(--color-ashoka-dark)]"
                      : "bg-white border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* CTA */}
          <button
            onClick={checkEligibility}
            disabled={!age || isIndian === null || loading}
            className="btn btn-dark w-full py-4 text-base rounded-2xl"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking…
              </>
            ) : (
              "Check My Eligibility →"
            )}
          </button>

          {err && (
            <p className="text-xs text-red-600 font-bold" role="alert">⚠️ {err}</p>
          )}

          {/* Result */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "p-5 rounded-2xl border-2 border-[var(--color-ink)] flex items-start gap-4",
                  result.eligible
                    ? "bg-green-50 shadow-[4px_4px_0px_0px_var(--color-india-green)]"
                    : "bg-red-50 shadow-[4px_4px_0px_0px_#DC2626]"
                )}
                role="status"
                aria-live="polite"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl border-2 border-[var(--color-ink)] flex items-center justify-center text-white flex-shrink-0",
                    result.eligible ? "bg-[var(--color-india-green)]" : "bg-red-600"
                  )}
                  aria-hidden="true"
                >
                  {result.eligible ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                </div>
                <div>
                  <h4 className={cn(
                    "font-extrabold text-lg tracking-tight leading-none",
                    result.eligible ? "text-green-900" : "text-red-900"
                  )}>
                    {result.message}
                  </h4>
                  <p className="text-xs mt-1.5 leading-relaxed font-medium text-gray-700">
                    {result.detail}
                  </p>
                  {result.eligible && (
                    <a
                      href="https://www.nvsp.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold text-[var(--color-india-green)] border-b-2 border-[var(--color-india-green)] pb-0.5 hover:opacity-80 transition-opacity"
                    >
                      Register at NVSP.in <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
