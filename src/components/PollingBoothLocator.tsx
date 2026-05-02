import React, { useState } from "react";
import { MapPin, Loader2, Navigation, Clock, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BoothResult {
  pincode: string;
  booth: string;
  address: string;
  ward: string;
  timings: string;
  officer: string;
  note: string;
}

export default function PollingBoothLocator() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<BoothResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/booth-locator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
        signal: AbortSignal.timeout(10000),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (e: any) {
      setError(e.name === "AbortError" ? "Request timed out." : "Service unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section aria-label="Polling Booth Locator">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-2xl border-2 border-[var(--color-ink)] flex items-center justify-center text-white flex-shrink-0"
          style={{ background: "var(--color-saffron)" }}
          aria-hidden="true"
        >
          <MapPin size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Find Your Booth</h2>
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest font-mono mt-0.5">
            Polling Station Locator
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <input
          type="text"
          inputMode="numeric"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={handleKeyDown}
          placeholder="Enter Your 6-Digit Pincode"
          className="input font-mono text-lg tracking-widest w-full"
          maxLength={6}
          aria-label="Enter pincode"
        />

        <button
          onClick={handleSearch}
          disabled={loading || pincode.length !== 6}
          className="btn btn-dark w-full py-4 text-sm"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Navigation size={16} />
              Locate My Booth
            </>
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl"
              role="alert"
            >
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 card card-green p-5 space-y-4"
            role="region"
            aria-label="Booth search result"
            aria-live="polite"
          >
            {/* Result Header */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-india-green)] relative">
                <span className="absolute inset-0 rounded-full bg-[var(--color-india-green)] animate-ping opacity-50" />
              </span>
              <p className="text-[10px] font-bold text-[var(--color-india-green)] uppercase tracking-widest font-mono">
                Booth Found — Pincode {result.pincode}
              </p>
            </div>

            {/* Booth Name */}
            <div>
              <h3 className="text-xl font-extrabold text-[var(--color-ink)] leading-tight">
                {result.booth}
              </h3>
              <div className="flex items-start gap-1.5 mt-1.5">
                <MapPin size={12} className="text-[var(--color-muted)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-xs text-[var(--color-muted)] font-medium leading-snug">{result.address}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={11} className="text-[var(--color-muted)]" aria-hidden="true" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] font-mono">
                    Timings
                  </p>
                </div>
                <p className="text-sm font-bold text-[var(--color-ink)]">{result.timings}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <User size={11} className="text-[var(--color-muted)]" aria-hidden="true" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] font-mono">
                    Ward
                  </p>
                </div>
                <p className="text-xs font-bold text-[var(--color-ink)] leading-tight">{result.ward}</p>
              </div>
            </div>

            {/* Mock disclaimer */}
            <p className="text-[9px] text-[var(--color-muted)] font-mono border-t border-gray-100 pt-3">
              ⚠️ {result.note} For real-time data, visit{" "}
              <a
                href="https://voters.eci.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[var(--color-ashoka)]"
              >
                voters.eci.gov.in
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Tip */}
      {!result && !loading && (
        <div className="mt-5 p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl">
          <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider font-mono leading-relaxed">
            💡 Tip: Carry your Voter ID (EPIC) or Aadhaar card when visiting your polling booth.
          </p>
        </div>
      )}
    </section>
  );
}
