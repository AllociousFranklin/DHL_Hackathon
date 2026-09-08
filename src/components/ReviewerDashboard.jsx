import React, { useState, useEffect } from 'react';
import { SAMPLE_INSPECTIONS } from '../data/mockInspections';
import ReviewerPipeline from './ReviewerPipeline';
import ReviewerEvidence from './ReviewerEvidence';
import {
  CheckCircle2, XCircle, HelpCircle, ArrowRight,
  Plane, Truck, MapPin, User, Clock, Images, LogOut, ChevronRight
} from 'lucide-react';

export default function ReviewerDashboard({ onLogout }) {
  const [selectedId, setSelectedId] = useState(SAMPLE_INSPECTIONS[0].id);
  const [screen, setScreen] = useState('select'); // 'select' | 'pipeline' | 'evidence'
  const [fadeIn, setFadeIn] = useState(false);

  const selected = SAMPLE_INSPECTIONS.find(c => c.id === selectedId);

  useEffect(() => {
    setFadeIn(false);
    requestAnimationFrame(() => setFadeIn(true));
  }, [screen]);

  const handleRun = () => {
    setScreen('pipeline');
  };

  const handlePipelineDone = () => {
    setScreen('evidence');
  };

  const handleReset = () => {
    setScreen('select');
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0B0F] flex flex-col">
      {/* Header */}
      <header className="bg-[#FFCC00] px-4 sm:px-6 py-3 flex items-center justify-between safe-area-top">
        <div className="flex items-center gap-3">
          <div className="bg-[#D40511] text-[#FFCC00] font-black italic text-xl tracking-tighter px-2.5 py-0.5 rounded shadow-lg shadow-[#D40511]/30">
            DHL
          </div>
          <div className="hidden sm:block">
            <div className="text-black font-bold text-sm">Global Forwarding</div>
            <div className="text-black/60 text-[10px] font-medium -mt-0.5">UK Aviation · GE Aerospace</div>
          </div>
          <span className="sm:hidden text-black font-bold text-sm">Reviewer Console</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full text-xs font-semibold text-black/70">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Safety Reviewer
          </div>
          <button onClick={onLogout} className="text-black/60 hover:text-black p-2 -mr-2 rounded-full transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">

        {/* ── SCREEN 1: SELECT ── */}
        {screen === 'select' && (
          <div className={`transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Select Inspection</h1>
              <p className="text-sm text-gray-500 mt-1">Choose a case to run through the inspection pipeline.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-5">
              {/* Case Cards */}
              <div className="lg:w-[380px] xl:w-[420px] shrink-0 space-y-2.5">
                {SAMPLE_INSPECTIONS.map((item) => {
                  const isActive = item.id === selectedId;
                  const isGood = item.tag === 'GOOD_TO_GO';
                  const isBad = item.tag === 'TIE_DOWN_INCORRECT';

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-white/[0.06] border-[#FFCC00]/50 shadow-lg shadow-[#FFCC00]/5 ring-1 ring-[#FFCC00]/30'
                          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-gray-500">{item.id}</span>
                            {isGood && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={10} /> GOOD
                              </span>
                            )}
                            {isBad && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                <XCircle size={10} /> DEFECT
                              </span>
                            )}
                            {!isGood && !isBad && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                <HelpCircle size={10} /> RETAKE
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-white truncate">{item.label}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{item.subtitle}</p>
                        </div>
                        <ChevronRight size={16} className={`shrink-0 mt-1 transition-colors ${isActive ? 'text-[#FFCC00]' : 'text-gray-600'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Details Panel */}
              {selected && (
                <div className="flex-1 space-y-4">
                  {/* Metadata */}
                  <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold text-white">Batch Details</h2>
                      <span className="text-[11px] font-mono text-gray-500">{selected.id}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { icon: Plane, label: 'Engine', value: selected.metadata.engine_type, color: 'text-blue-400' },
                        { icon: Truck, label: 'Trailer', value: selected.metadata.trailer, color: 'text-[#FFCC00]' },
                        { icon: MapPin, label: 'Route', value: selected.metadata.route, color: 'text-emerald-400' },
                        { icon: User, label: 'Operator', value: selected.metadata.operator, color: 'text-purple-400' },
                        { icon: Clock, label: 'Submitted', value: selected.metadata.timestamp, color: 'text-gray-400' },
                        { icon: Images, label: 'Images', value: `${selected.metadata.images_count} photos`, color: 'text-cyan-400' },
                      ].map((field, i) => (
                        <div key={i} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                          <div className={`flex items-center gap-1.5 text-[10px] font-medium ${field.color} mb-1`}>
                            <field.icon size={12} />
                            {field.label}
                          </div>
                          <div className="text-xs font-semibold text-gray-200 leading-snug">{field.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold text-white">Batch Images</h2>
                      <span className="text-xs text-gray-500">{selected.thumbnails.length} files</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {selected.thumbnails.map((thumb) => {
                        const isOk = thumb.status === 'PASS';
                        const isDefect = thumb.status === 'DEFECT';
                        return (
                          <div
                            key={thumb.id}
                            className={`aspect-[4/3] rounded-xl border overflow-hidden relative flex items-center justify-center ${
                              !isOk
                                ? isDefect ? 'border-red-500/40 bg-red-500/5' : 'border-amber-500/40 bg-amber-500/5'
                                : 'border-white/[0.06] bg-white/[0.03]'
                            }`}
                          >
                            <div className={`text-[10px] font-bold ${!isOk ? (isDefect ? 'text-red-400' : 'text-amber-400') : 'text-gray-400'}`}>
                              {thumb.view}
                            </div>
                            <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-2 py-0.5 rounded-full ${
                              isOk ? 'bg-emerald-500/15 text-emerald-400' :
                              isDefect ? 'bg-red-500/15 text-red-400' :
                              'bg-amber-500/15 text-amber-400'
                            }`}>
                              {thumb.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Run Button */}
                  <button
                    onClick={handleRun}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#FFCC00] hover:bg-[#FFD633] text-black font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-[#FFCC00]/15 hover:shadow-[#FFCC00]/25 transition-all duration-300 active:scale-[0.98]"
                  >
                    <span>Run Inspection Pipeline</span>
                    <ArrowRight size={18} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SCREEN 2: PIPELINE ── */}
        {screen === 'pipeline' && (
          <ReviewerPipeline inspection={selected} onComplete={handlePipelineDone} />
        )}

        {/* ── SCREEN 3: EVIDENCE (placeholder) ── */}
        {screen === 'evidence' && (
          <ReviewerEvidence inspection={selected} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
