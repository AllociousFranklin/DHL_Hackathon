import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Shield, Cpu, Layers, Eye, Compass, FastForward } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 1,
    title: "Step 1 & 2: Image Quality Validation",
    owner: "Dhanethiran (Detection & Segmentation)",
    tech: "Deterministic OpenCV (Zero-ML)",
    details: "Checking image count (≥6), Laplacian variance (blur < 100), mean luminance (40-220), and pHash duplicates.",
    icon: Eye,
    durationMs: 900
  },
  {
    id: 2,
    title: "Step 3: Side & Angle View Identification",
    owner: "Mridhula (Data & Foundation Models)",
    tech: "DINOv2 (Frozen ViT Backbone) + k-NN",
    details: "Extracting 768-dim embeddings; matching against reference prototypes (front, rear, left, right, trailer, suspension).",
    icon: Compass,
    durationMs: 1100
  },
  {
    id: 3,
    title: "Step 4: Component Detection & Segmentation",
    owner: "Dhanethiran (Detection & Segmentation)",
    tech: "Grounding DINO + SAM 2",
    details: "Prompting 'strap, chain, hook, anchor point, air bellows'; SAM2 box-prompted zero-shot instance segmentation.",
    icon: Layers,
    durationMs: 1200
  },
  {
    id: 4,
    title: "Step 5 & 6: Anomaly Scoring & Geometry",
    owner: "Harsha (Quality Models: Anomaly + Geometry)",
    tech: "PatchCore Anomaly + Vector Angle Engine",
    details: "Evaluating DINOv2 patch tokens against GOOD memory bank; measuring strap routing vectors vs. 45° ± 15° tolerance.",
    icon: Cpu,
    durationMs: 1200
  },
  {
    id: 5,
    title: "Safety Layer: Two-Modality Arbiter & Audit Trail",
    owner: "Franklin (Safety Layer, Decision, UI)",
    tech: "Conformal Safety Arbiter & Bounded VLM Fact-Check",
    details: "Enforcing dual-signal agreement (both must flag for BAD) to guarantee False Positive Rate ≤ 1.0%.",
    icon: Shield,
    durationMs: 900
  }
];

export default function Screen2PipelineProgress({ onComplete, inspection }) {
  const [completedStages, setCompletedStages] = useState([]);
  const [activeStage, setActiveStage] = useState(1);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let current = 1;
    setLogs([`[00:00.12] Ingested batch ${inspection.id} with ${inspection.images.length} candidate images.`]);

    const runNext = () => {
      if (current > 5) {
        setTimeout(() => {
          onComplete();
        }, 600);
        return;
      }

      setActiveStage(current);
      const stage = PIPELINE_STAGES[current - 1];

      // Add log entry
      setTimeout(() => {
        setLogs(prev => [
          ...prev,
          `[STAGE ${current}] ${stage.title} started using ${stage.tech}...`
        ]);
      }, 200);

      setTimeout(() => {
        setCompletedStages(prev => [...prev, current]);
        setLogs(prev => [
          ...prev,
          `[STAGE ${current} DONE] Completed in ${stage.durationMs}ms. Output: SUCCESS.`
        ]);
        current += 1;
        runNext();
      }, stage.durationMs);
    };

    const timer = setTimeout(runNext, 400);
    return () => clearTimeout(timer);
  }, [inspection, onComplete]);

  const handleSkip = () => {
    setCompletedStages([1, 2, 3, 4, 5]);
    onComplete();
  };

  const progressPercent = Math.min(100, Math.round((completedStages.length / 5) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Live Progress */}
      <div className="bg-[#1C1E26] border border-[#2E323F] p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFCC00] text-black font-extrabold text-xs px-2 py-0.5 rounded">SCREEN 2</span>
              <h2 className="text-xl font-bold text-white tracking-tight">Real-Time Inspection Pipeline</h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Executing staged modular evidence analysis for <strong className="text-gray-200">{inspection.engine_metadata.type}</strong> ({inspection.id})
            </p>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FFCC00] bg-[#12141A] px-3 py-1.5 rounded-lg border border-[#2A2E3B] transition-colors"
          >
            <FastForward size={14} />
            <span>Fast-Forward</span>
          </button>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full bg-[#12141A] h-3 rounded-full overflow-hidden border border-[#2A2E3B] p-0.5 mb-2">
          <div
            className="bg-gradient-to-r from-[#FFCC00] via-yellow-400 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-gray-400">
          <span>Staged Evidence Pipeline: {completedStages.length} / 5 Stages Finished</span>
          <span className="text-[#FFCC00] font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* 5 Stages Lighting Up Sequentially */}
      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage) => {
          const isDone = completedStages.includes(stage.id);
          const isCurrent = activeStage === stage.id && !isDone;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all duration-500 flex items-start gap-4 ${
                isDone
                  ? 'bg-[#151922] border-emerald-500/40 shadow-sm'
                  : isCurrent
                  ? 'bg-[#1D212D] border-[#FFCC00] shadow-lg shadow-[#FFCC00]/5 ring-1 ring-[#FFCC00]/50'
                  : 'bg-[#12141A] border-[#222631] opacity-50'
              }`}
            >
              {/* Stage Icon / Status Bubble */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  isDone
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
                    : isCurrent
                    ? 'bg-yellow-950/80 border-[#FFCC00] text-[#FFCC00] animate-pulse'
                    : 'bg-[#1A1D24] border-[#2E323F] text-gray-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={22} className="text-emerald-400 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 size={20} className="animate-spin text-[#FFCC00]" />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              {/* Stage Text & Metadata */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isDone ? 'text-white' : isCurrent ? 'text-[#FFCC00]' : 'text-gray-400'}`}>
                      {stage.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-gray-300 border border-white/10">
                      {stage.tech}
                    </span>
                  </div>

                  <span className="text-[11px] text-gray-400 font-medium">
                    Owner: <strong className="text-gray-200">{stage.owner}</strong>
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {stage.details}
                </p>

                {isCurrent && (
                  <div className="mt-2 text-[11px] font-mono text-[#FFCC00] flex items-center gap-2 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]"></span>
                    Processing tensor tensors &amp; spatial geometries...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Terminal / Execution Log */}
      <div className="bg-[#0A0B0E] border border-[#222530] rounded-xl p-4 font-mono text-[11px] text-gray-400">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
          <span className="text-gray-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Telemetry Stream
          </span>
          <span className="text-[10px] text-gray-500">Franklin's /inspect Pipeline Listener</span>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {logs.map((line, i) => (
            <div key={i} className="text-gray-300 flex items-start gap-2">
              <span className="text-[#FFCC00] select-none">&gt;</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
