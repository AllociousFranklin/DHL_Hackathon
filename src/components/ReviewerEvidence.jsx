import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp,
  ArrowLeft, RefreshCw, Camera, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function ReviewerEvidence({ inspection, onReset }) {
  const [auditOpen, setAuditOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setFadeIn(true));
  }, []);

  const isGood = inspection.tag === 'GOOD_TO_GO';
  const isBad = inspection.tag === 'TIE_DOWN_INCORRECT';
  const isMore = inspection.tag === 'MORE_IMAGES_REQUIRED';

  const accentColor = isGood ? '#10B981' : isBad ? '#EF4444' : '#F59E0B';

  return (
    <div className={`space-y-5 transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

      {/* ═══ A. VERDICT BANNER ═══ */}
      <div
        className="rounded-2xl p-5 sm:p-6 border relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accentColor}12 0%, transparent 50%)`,
          borderColor: `${accentColor}40`,
        }}
      >
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ background: accentColor }}></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: accentColor, boxShadow: `0 8px 30px ${accentColor}35` }}
            >
              {isGood && <CheckCircle2 size={30} className="text-white stroke-[2.5]" />}
              {isBad && <XCircle size={30} className="text-white stroke-[2.5]" />}
              {isMore && <HelpCircle size={30} className="text-white stroke-[2.5]" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{inspection.verdict}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.06]">
                  {inspection.id}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{inspection.verdict_reason}</p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/[0.08] transition-all shrink-0"
          >
            <RefreshCw size={14} />
            <span>New Case</span>
          </button>
        </div>
      </div>

      {/* ═══ B. IMAGE GRID ═══ */}
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6">
        <h3 className="text-sm font-bold text-white mb-4">Image Evidence</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {inspection.thumbnails.map((thumb) => {
            const ok = thumb.status === 'PASS';
            const defect = thumb.status === 'DEFECT';
            const borderCol = ok ? 'border-white/[0.06]' : defect ? 'border-red-500/40' : 'border-amber-500/40';
            const bgCol = ok ? 'bg-white/[0.03]' : defect ? 'bg-red-500/5' : 'bg-amber-500/5';

            return (
              <div key={thumb.id} className={`aspect-[4/3] rounded-xl border ${borderCol} ${bgCol} relative flex flex-col items-center justify-center gap-1 p-2`}>
                <span className={`text-xs font-semibold ${ok ? 'text-gray-300' : defect ? 'text-red-400' : 'text-amber-400'}`}>
                  {thumb.view}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  ok ? 'bg-emerald-500/15 text-emerald-400' :
                  defect ? 'bg-red-500/15 text-red-400' :
                  'bg-amber-500/15 text-amber-400'
                }`}>
                  {thumb.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ C. TWO-MODALITY EVIDENCE TABLE ═══ */}
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FFCC00]" />
              Two-Modality Evidence Table
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              A component is only marked <strong className="text-red-400">BAD</strong> when <strong>both</strong> modalities agree. This guarantees FP ≤ 1%.
            </p>
          </div>
          <div className="text-[10px] font-mono bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06] text-gray-400 shrink-0">
            FP ≤ 1% · FN &lt; 10%
          </div>
        </div>

        {/* Mobile: Cards / Desktop: Table */}
        {/* Cards (mobile-first) */}
        <div className="space-y-2.5 lg:hidden">
          {inspection.components.map((c) => (
            <ComponentCard key={c.id} comp={c} />
          ))}
        </div>

        {/* Table (desktop) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider font-mono border-b border-white/[0.06]">
                <th className="py-3 pr-4">Component</th>
                <th className="py-3 pr-4">View</th>
                <th className="py-3 pr-4">Modality 1: Anomaly</th>
                <th className="py-3 pr-4">Modality 2: Geometry</th>
                <th className="py-3 pr-4 text-center">Agreement</th>
                <th className="py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {inspection.components.map((c) => (
                <tr key={c.id} className={`hover:bg-white/[0.02] ${c.status === 'BAD' ? 'bg-red-500/[0.03]' : c.status === 'UNKNOWN' ? 'bg-amber-500/[0.03]' : ''}`}>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-gray-200">{c.type}</div>
                    <div className="text-[10px] font-mono text-gray-500">{c.id}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{c.view}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-mono font-bold ${c.aFlag ? 'text-red-400' : 'text-emerald-400'}`}>
                      {c.anomaly.toFixed(3)}
                    </span>
                    <span className="text-gray-600 ml-1.5">/ {c.thresh}</span>
                    {c.aFlag && <div className="text-[9px] text-red-400 mt-0.5">● Exceeds threshold</div>}
                  </td>
                  <td className="py-3 pr-4">
                    <div className={c.gFlag ? 'text-red-400 font-medium' : 'text-gray-300'}>{c.geo}</div>
                    <div className="text-[10px] text-gray-600">Spec: {c.geoSpec}</div>
                    {c.gFlag && <div className="text-[9px] text-red-400 mt-0.5">● Out of tolerance</div>}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    {c.agree ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">BOTH FLAG</span>
                    ) : (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.06]">
                        {c.status === 'GOOD' ? 'Both clear' : 'Disagree'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ MORE IMAGES: RETAKE CARDS ═══ */}
      {isMore && inspection.retakes && (
        <div className="bg-white/[0.03] backdrop-blur-sm border border-amber-500/20 rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Camera size={16} className="text-amber-400" />
            Retake Instructions
          </h3>
          <div className="space-y-2.5">
            {inspection.retakes.map((r, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="text-sm font-semibold text-amber-400">{r.view}</div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ D. AUDIT TRAIL ═══ */}
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden">
        <button
          onClick={() => setAuditOpen(!auditOpen)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-[#FFCC00] text-black px-2 py-0.5 rounded">AUDIT</span>
            <span className="text-sm font-bold text-white">Decision Trail</span>
            <span className="text-[10px] text-gray-500 font-mono">({inspection.audit.length} events)</span>
          </div>
          {auditOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>

        {auditOpen && (
          <div className="px-5 sm:px-6 pb-5 space-y-1.5 border-t border-white/[0.04] pt-4">
            {inspection.audit.map((line, i) => {
              const isFlag = line.includes('FLAGGED') || line.includes('BAD') || line.includes('FAILED') || line.includes('INCORRECT');
              return (
                <div key={i} className="flex items-start gap-2.5 text-xs font-mono leading-relaxed">
                  <span className="text-[#FFCC00] shrink-0 select-none">›</span>
                  <span className={isFlag ? 'text-red-400' : 'text-gray-400'}>{line}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mobile component card ──
function ComponentCard({ comp: c }) {
  return (
    <div className={`rounded-xl border p-4 ${
      c.status === 'BAD' ? 'bg-red-500/[0.04] border-red-500/20' :
      c.status === 'UNKNOWN' ? 'bg-amber-500/[0.04] border-amber-500/20' :
      'bg-white/[0.02] border-white/[0.05]'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-white">{c.type}</div>
          <div className="text-[10px] text-gray-500 font-mono">{c.id} · {c.view}</div>
        </div>
        <StatusBadge status={c.status} />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Modality 1 */}
        <div className={`rounded-lg p-2.5 border ${c.aFlag ? 'bg-red-500/5 border-red-500/15' : 'bg-white/[0.02] border-white/[0.04]'}`}>
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Anomaly Score</div>
          <div className={`text-lg font-bold font-mono ${c.aFlag ? 'text-red-400' : 'text-emerald-400'}`}>
            {c.anomaly.toFixed(3)}
          </div>
          <div className="text-[9px] text-gray-600">Threshold: {c.thresh}</div>
        </div>

        {/* Modality 2 */}
        <div className={`rounded-lg p-2.5 border ${c.gFlag ? 'bg-red-500/5 border-red-500/15' : 'bg-white/[0.02] border-white/[0.04]'}`}>
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Geometry</div>
          <div className={`text-sm font-bold ${c.gFlag ? 'text-red-400' : 'text-gray-200'}`}>
            {c.geo}
          </div>
          <div className="text-[9px] text-gray-600">Spec: {c.geoSpec}</div>
        </div>
      </div>

      {c.agree && (
        <div className="mt-2.5 text-[10px] font-bold text-red-400 bg-red-500/10 rounded-lg px-3 py-1.5 text-center border border-red-500/15">
          ⚠ Both modalities flagged → Confirmed BAD
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'GOOD') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 size={11} /> GOOD
    </span>
  );
  if (status === 'BAD') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
      <XCircle size={11} /> BAD
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <HelpCircle size={11} /> UNKNOWN
    </span>
  );
}
