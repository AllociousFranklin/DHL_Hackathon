import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle2, Upload, LogOut, ImagePlus, X, AlertTriangle } from 'lucide-react';

const MOCK_VERDICTS = {
  GOOD: {
    type: 'GOOD',
    title: 'Good to Go',
    subtitle: 'Engine is correctly tied down. You are authorised to depart.',
    details: [
      'All 6 required views identified',
      'Tie-down straps secure (44° ± 2°)',
      'Pneumatic air suspension verified',
    ],
  },
  BAD: {
    type: 'BAD',
    title: 'Tie-Down Incorrect',
    subtitle: 'A safety issue was found. Do NOT depart.',
    details: [
      'Rear-left strap is loose — routing angle 21.8° (must be 30°–60°)',
      'Re-tension the rear-left ratchet binder and resubmit photos',
    ],
  },
  MORE: {
    type: 'MORE',
    title: 'More Images Needed',
    subtitle: 'Some photos were unclear. Please retake the ones listed below.',
    retakes: [
      { view: 'Rear View', reason: 'Too blurry — hold your camera steady and retake.' },
      { view: 'Air Suspension', reason: 'Blocked by mud flap — crouch lower and capture the air bags clearly.' },
    ],
  },
};

const PIPELINE_STEPS = [
  'Checking image quality',
  'Identifying views',
  'Detecting components',
  'Checking straps & suspension',
  'Applying safety rules',
];

export default function OperatorDashboard({ onLogout }) {
  const [files, setFiles] = useState([]);
  const [screen, setScreen] = useState('upload');
  const [verdict, setVerdict] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const fileInputRef = useRef(null);
  const addMoreRef = useRef(null);

  // Fade-in on screen change
  useEffect(() => {
    setFadeIn(false);
    const t = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(t);
  }, [screen]);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setScreen('processing');
    setPipelineStep(0);
  };

  const handleReset = () => {
    setFiles([]);
    setScreen('upload');
    setVerdict(null);
    setPipelineStep(0);
  };

  // Animate pipeline
  useEffect(() => {
    if (screen !== 'processing') return;
    if (pipelineStep < PIPELINE_STEPS.length) {
      const timer = setTimeout(() => setPipelineStep(p => p + 1), 900);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        const outcomes = ['GOOD', 'BAD', 'MORE'];
        setVerdict(MOCK_VERDICTS[outcomes[Math.floor(Math.random() * outcomes.length)]]);
        setScreen('verdict');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [screen, pipelineStep]);

  const canSubmit = files.length >= 6;

  // ─── PROCESSING ───
  if (screen === 'processing') {
    const progress = (pipelineStep / PIPELINE_STEPS.length) * 100;
    return (
      <div className="min-h-[100dvh] bg-[#0A0B0F] flex flex-col">
        <Header onLogout={onLogout} />
        <div className={`flex-1 flex items-center justify-center p-6 transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-full max-w-xs sm:max-w-sm space-y-8">
            {/* Animated ring */}
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                <circle
                  cx="48" cy="48" r="42"
                  fill="none"
                  stroke="#FFCC00"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  className="transition-all duration-700 ease-out"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(255,204,0,0.4))' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Analysing {files.length} photos</h2>
              <p className="text-xs text-gray-500 mt-1">Please wait, this takes a few seconds</p>
            </div>

            {/* Steps */}
            <div className="space-y-2.5">
              {PIPELINE_STEPS.map((step, i) => {
                const isDone = i < pipelineStep;
                const isCurrent = i === pipelineStep && pipelineStep < PIPELINE_STEPS.length;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500 ${
                      isDone ? 'bg-emerald-500/10' : isCurrent ? 'bg-[#FFCC00]/[0.07]' : 'bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-500 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 scale-100'
                        : isCurrent
                        ? 'bg-[#FFCC00]/20 text-[#FFCC00] scale-110'
                        : 'bg-white/[0.04] text-gray-600 scale-90'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm transition-colors duration-300 ${
                      isDone ? 'text-emerald-300' : isCurrent ? 'text-white font-medium' : 'text-gray-600'
                    }`}>
                      {step}
                    </span>
                    {isCurrent && (
                      <div className="ml-auto flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-bounce [animation-delay:0ms]"></span>
                        <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-bounce [animation-delay:150ms]"></span>
                        <span className="w-1.5 h-1.5 bg-[#FFCC00] rounded-full animate-bounce [animation-delay:300ms]"></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── VERDICT ───
  if (screen === 'verdict' && verdict) {
    const isGood = verdict.type === 'GOOD';
    const isBad = verdict.type === 'BAD';
    const isMore = verdict.type === 'MORE';

    const accentColor = isGood ? '#10B981' : isBad ? '#EF4444' : '#F59E0B';

    return (
      <div className="min-h-[100dvh] bg-[#0A0B0F] flex flex-col">
        <Header onLogout={onLogout} />
        <div className={`flex-1 p-5 sm:p-6 max-w-lg mx-auto w-full flex flex-col transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Verdict Card */}
          <div className="rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${accentColor}10 0%, transparent 60%)` }}>
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] opacity-30 pointer-events-none" style={{ background: accentColor }}></div>

            {/* Icon */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center relative z-10`}
              style={{ background: accentColor, boxShadow: `0 12px 40px ${accentColor}40` }}
            >
              {isGood && <CheckCircle2 size={40} className="text-white stroke-[2.5]" />}
              {isBad && <X size={40} className="text-white stroke-[3]" />}
              {isMore && <Camera size={36} className="text-white" />}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-5 relative z-10">
              {verdict.title}
            </h2>
            <p className="text-sm text-gray-400 mt-2 relative z-10 max-w-sm mx-auto">{verdict.subtitle}</p>
          </div>

          {/* Details */}
          <div className="mt-5 space-y-2.5 flex-1">
            {isGood && verdict.details.map((item, i) => (
              <div key={i}
                className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.05] transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <span className="text-sm text-gray-200">{item}</span>
              </div>
            ))}

            {isBad && verdict.details.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-red-500/10">
                <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={15} className="text-red-400" />
                </div>
                <span className="text-sm text-gray-200">{item}</span>
              </div>
            ))}

            {isMore && verdict.retakes.map((item, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-4 border border-amber-500/10">
                <div className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                  <Camera size={15} />
                  {item.view}
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="pt-5 mt-4">
            <button
              onClick={handleReset}
              className="w-full font-bold text-sm py-4 rounded-2xl transition-all duration-300 active:scale-[0.97]"
              style={{
                background: isGood ? '#10B981' : '#FFCC00',
                color: isGood ? 'white' : 'black',
                boxShadow: isGood ? '0 8px 30px rgba(16,185,129,0.2)' : '0 8px 30px rgba(255,204,0,0.15)',
              }}
            >
              {isGood ? 'Done' : 'Retake & Resubmit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── UPLOAD ───
  return (
    <div className="min-h-[100dvh] bg-[#0A0B0F] flex flex-col">
      <Header onLogout={onLogout} />

      <main className={`flex-1 p-4 sm:p-6 pb-28 max-w-lg mx-auto w-full space-y-4 transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Instructions Card */}
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="text-lg font-bold text-white">Upload truck photos</h2>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
            Take at least <strong className="text-[#FFCC00]">6 photos</strong> of the truck from all sides including the air suspension. The system identifies each view automatically.
          </p>
        </div>

        {/* Progress indicator (only shown once files exist) */}
        {files.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(100, (files.length / 6) * 100)}%`,
                  background: canSubmit
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : 'linear-gradient(90deg, #FFCC00, #FFD633)',
                  boxShadow: canSubmit ? '0 0 12px rgba(16,185,129,0.4)' : '0 0 12px rgba(255,204,0,0.3)',
                }}
              ></div>
            </div>
            <span className={`text-xs font-semibold tabular-nums ${canSubmit ? 'text-emerald-400' : 'text-gray-400'}`}>
              {files.length}/6
            </span>
          </div>
        )}

        {/* Action Zones */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Camera Button */}
          <label className="cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFiles}
            />
            <div className="bg-[#FFCC00] hover:bg-[#FFD633] text-black rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-[0.97] shadow-xl shadow-[#FFCC00]/10 h-full">
              <Camera size={32} className="mb-3 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              <p className="text-sm font-extrabold">Take Photo</p>
              <p className="text-[10px] text-black/60 mt-1 font-medium">Use device camera</p>
            </div>
          </label>

          {/* Gallery Button */}
          <label className="cursor-pointer group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
            <div className="border-2 border-dashed border-white/[0.08] hover:border-[#FFCC00]/50 bg-white/[0.02] hover:bg-[#FFCC00]/[0.02] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-[0.97] h-full">
              <ImagePlus size={32} className="mb-3 text-gray-400 group-hover:text-[#FFCC00] group-hover:scale-110 transition-all duration-300" />
              <p className="text-sm font-semibold text-white">Gallery</p>
              <p className="text-[10px] text-gray-500 mt-1 font-medium">Upload multiple</p>
            </div>
          </label>
        </div>

        {/* Thumbnail Grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {files.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] group">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Remove button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 sm:opacity-100"
                >
                  <X size={14} />
                </button>
                {/* Index badge */}
                <div className="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white/80 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                  {i + 1}
                </div>
              </div>
            ))}

            {/* Add more tile */}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-white/[0.06] flex items-center justify-center cursor-pointer hover:border-[#FFCC00]/40 hover:bg-[#FFCC00]/[0.02] transition-all duration-300">
              <input
                ref={addMoreRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
              <ImagePlus size={22} className="text-gray-600" />
            </label>
          </div>
        )}
      </main>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0B0F]/90 backdrop-blur-xl border-t border-white/[0.05]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-2.5 font-bold text-sm py-4 rounded-2xl transition-all duration-300 active:scale-[0.97] ${
              canSubmit
                ? 'bg-[#FFCC00] text-black shadow-xl shadow-[#FFCC00]/15'
                : 'bg-white/[0.05] text-gray-500 cursor-not-allowed'
            }`}
          >
            <Upload size={18} />
            <span>{canSubmit ? 'Submit for Inspection' : `Add ${6 - files.length} more photo${6 - files.length !== 1 ? 's' : ''}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ onLogout }) {
  return (
    <div className="bg-[#FFCC00] px-4 py-3 flex items-center justify-between safe-area-top">
      <div className="flex items-center gap-3">
        <div className="bg-[#D40511] text-[#FFCC00] font-black italic text-xl tracking-tighter px-2.5 py-0.5 rounded shadow-lg shadow-[#D40511]/30">
          DHL
        </div>
        <span className="text-black font-bold text-sm">Tie-Down Check</span>
      </div>
      <button onClick={onLogout} className="text-black/60 hover:text-black p-2 -mr-2 rounded-full transition-colors">
        <LogOut size={18} />
      </button>
    </div>
  );
}
