import { useState } from "react";
import { STEPS } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Lightbulb, Info } from "lucide-react";

export default function ElectionGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];
  const StepIcon = step.icon;

  const prev = () => setActiveStep((s) => Math.max(0, s - 1));
  const next = () => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <section aria-label="Indian Election Step-by-Step Guide">
      {/* Section Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="tag mb-2" style={{ borderColor: step.color, color: step.color }}>
            Step {activeStep + 1} of {STEPS.length}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight leading-none">
            Election Journey
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-1 uppercase tracking-widest font-mono">
            How Indian Democracy Works
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={activeStep === 0}
            className="btn btn-ghost p-2.5 rounded-xl"
            aria-label="Previous step"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            disabled={activeStep === STEPS.length - 1}
            className="btn btn-dark p-2.5 rounded-xl"
            aria-label="Next step"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {STEPS.map((s, idx) => {
          const isActive = idx === activeStep;
          const isPast = idx < activeStep;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              aria-pressed={isActive}
              aria-label={`Step ${idx + 1}: ${s.title}`}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 min-w-[90px]",
                isActive
                  ? "border-[var(--color-ink)] text-white shadow-[3px_3px_0px_0px_var(--color-ink)]"
                  : isPast
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white opacity-60"
                  : "border-[var(--color-ink)] bg-white text-[var(--color-ink)] hover:bg-gray-50"
              )}
              style={isActive ? { background: s.color } : {}}
            >
              <span className="text-lg">{s.emoji}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap font-mono">
                {s.title.split(" ")[0]}
              </span>
              {isPast && (
                <span className="text-[8px] font-mono opacity-70">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: step.color }}
          animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Active Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-5"
        >
          {/* Main Card */}
          <div
            className="lg:col-span-3 card p-6 flex flex-col gap-5"
            style={{ boxShadow: `4px 4px 0px 0px ${step.color}` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl border-2 border-[var(--color-ink)] flex items-center justify-center text-white flex-shrink-0"
                style={{ background: step.color }}
                aria-hidden="true"
              >
                <StepIcon size={26} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">{step.title}</h3>
                <p className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-widest mt-0.5">
                  Step {activeStep + 1} · Indian Election Process
                </p>
              </div>
            </div>

            <p className="text-base text-[var(--color-ink)] leading-relaxed font-medium">
              {step.description}
            </p>

            <div className="border-t-2 border-gray-100 pt-4 flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg border-2 border-[var(--color-ink)] flex items-center justify-center flex-shrink-0"
                style={{ background: step.color }}
                aria-hidden="true"
              >
                <Info size={13} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1 font-mono">
                  Official Process Detail
                </p>
                <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                  {step.details}
                </p>
              </div>
            </div>
          </div>

          {/* Side Cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Fun Fact */}
            <div className="card card-saffron p-5 flex gap-3 items-start">
              <Lightbulb size={20} className="text-[var(--color-saffron)] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1 font-mono">
                  Did You Know?
                </p>
                <p className="text-sm font-semibold text-[var(--color-ink)] leading-snug">
                  {step.funFact}
                </p>
              </div>
            </div>

            {/* All Steps Mini List */}
            <div className="card p-4 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-3 font-mono">
                All Steps
              </p>
              {STEPS.map((s, idx) => {
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-semibold",
                      idx === activeStep
                        ? "bg-[var(--color-ink)] text-white"
                        : idx < activeStep
                        ? "bg-gray-100 text-[var(--color-muted)] line-through"
                        : "hover:bg-gray-50 text-[var(--color-ink)]"
                    )}
                    aria-current={idx === activeStep ? "step" : undefined}
                  >
                    <span className="text-base" aria-hidden="true">{s.emoji}</span>
                    <span className="flex-1 truncate">{s.title}</span>
                    {idx < activeStep && <span className="text-[var(--color-india-green)] font-bold">✓</span>}
                    {idx === activeStep && <span className="w-2 h-2 rounded-full bg-[var(--color-saffron)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
