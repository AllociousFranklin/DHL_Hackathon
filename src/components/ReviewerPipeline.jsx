import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Eye, Compass, Layers, Cpu, Shield } from 'lucide-react';

const STAGES = [
  {
    title: 'Image Quality Validation',
    tech: 'OpenCV · Deterministic',
    owner: 'Dhanethiran',
    detail: 'Blur (Laplacian ≥100), exposure (40–220), pHash dedup, resolution ≥1600×900',
    icon: Eye,
    ms: 900,
  },
  {
    title: 'View Classification',
    tech: 'DINOv2 + k-NN',
    owner: 'Mridhula',
    detail: 'Embedding 768-dim vectors, matching against reference prototypes per view class',
    icon: Compass,
    ms: 1100,
  },
  {
    title: 'Component Detection & Segmentation',
    tech: 'Grounding DINO + SAM 2',
    owner: 'Dhanethiran',
    detail: 'Text-prompted detection: strap, chain, hook, anchor, air bellows → instance masks',
    icon: Layers,
    ms: 1200,
  },
  {
    title: 'Anomaly Scoring & Geometry',
    tech: 'PatchCore + ViTPose',
    owner: 'Harsha',
    detail: 'DINOv2 patch embeddings vs GOOD memory bank · strap angle ±15° · ride-height Δh',
    icon: Cpu,
    ms: 1200,
  },
  {
    title: 'Safety Decision & Audit Trail',
    tech: 'Two-Modality Arbiter',
    owner: 'Franklin',
    detail: 'Dual-signal agreement enforced — both must flag for BAD. FP ≤1% guaranteed.',
    icon: Shield,
    ms: 800,
  },
];

export default function ReviewerPipeline({ inspection, onComplete }) {
  const [done, setDone] = useState([]);
  const [active, setActive] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setFadeIn(true));
  }, []);

  useEffect(() => {
    if (active >= STAGES.length) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDone(prev => [...prev, active]);
      setActive(prev => prev + 1);
    }, STAGES[active].ms);
    return () => clearTimeout(t);
  }, [active, onComplete]);

  const progress = (done.length / STAGES.length) * 100;

  return (
    <div className={`max-w-2xl mx-auto space-y-6 transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Running Inspection</h1>
        <p className="text-sm text-gray-500 mt-1">
          {inspection.metadata.engine_type} · {inspection.id}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FFCC00, #10B981)',
              boxShadow: '0 0 12px rgba(255,204,0,0.3)',
            }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400 tabular-nums w-10 text-right">{Math.round(progress)}%</span>
      </div>

      {/* Stages */}
      <div className="space-y-2.5">
        {STAGES.map((stage, i) => {
          const isDone = done.includes(i);
          const isCurrent = active === i && !isDone;
          const isPending = !isDone && !isCurrent;
          const Icon = stage.icon;

          return (
            <div
              key={i}
              className={`rounded-2xl border p-4 sm:p-5 transition-all duration-500 ${
                isDone
                  ? 'bg-emerald-500/[0.05] border-emerald-500/20'
                  : isCurrent
                  ? 'bg-[#FFCC00]/[0.04] border-[#FFCC00]/30 shadow-lg shadow-[#FFCC00]/5'
                  : 'bg-white/[0.015] border-white/[0.04] opacity-40'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                  isDone
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isCurrent
                    ? 'bg-[#FFCC00]/15 text-[#FFCC00] scale-110'
                    : 'bg-white/[0.04] text-gray-600'
                }`}>
                  {isDone ? <CheckCircle2 size={18} /> : isCurrent ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className={`text-sm font-semibold ${isDone ? 'text-white' : isCurrent ? 'text-[#FFCC00]' : 'text-gray-500'}`}>
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {stage.tech}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed hidden sm:block">
                    {stage.detail}
                  </p>
                  {!isPending && (
                    <p className="text-[10px] text-gray-600 mt-1.5 font-medium">
                      Owner: {stage.owner}
                    </p>
                  )}
                  {isCurrent && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
