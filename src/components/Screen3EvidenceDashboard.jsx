import React, { useState } from 'react';
import InspectionVisual from './InspectionVisual';
import { 
  CheckCircle2, AlertTriangle, XCircle, HelpCircle, Eye, Sliders, ChevronDown, 
  ChevronUp, Maximize2, ShieldCheck, Download, RefreshCw, ArrowRight, Layers, Info
} from 'lucide-react';

export default function Screen3EvidenceDashboard({ inspection, onGoToRetake, onReset }) {
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [auditLogOpen, setAuditLogOpen] = useState(true);

  const isGood = inspection.tag === "GOOD_TO_GO";
  const isBad = inspection.tag === "TIE_DOWN_INCORRECT";
  const isMore = inspection.tag === "MORE_IMAGES_REQUIRED";

  return (
    <div className="space-y-6">
      {/* SECTION A: UNMISSABLE TOP VERDICT BANNER */}
      <div 
        className={`rounded-2xl p-6 border-2 shadow-2xl transition-all ${
          isGood 
            ? 'bg-gradient-to-r from-emerald-950/80 via-[#13281E] to-[#121E18] border-emerald-500 shadow-emerald-950/40' 
            : isBad 
            ? 'bg-gradient-to-r from-red-950/90 via-[#2E1214] to-[#1F1012] border-[#D40511] shadow-red-950/40' 
            : 'bg-gradient-to-r from-amber-950/80 via-[#2A1D0E] to-[#1E160D] border-amber-500 shadow-amber-950/40'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border shrink-0 ${
              isGood 
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg' 
                : isBad 
                ? 'bg-[#D40511] text-white border-red-400 shadow-lg' 
                : 'bg-amber-500 text-black border-amber-400 shadow-lg'
            }`}>
              {isGood && <CheckCircle2 size={36} className="stroke-[2.5]" />}
              {isBad && <XCircle size={36} className="stroke-[2.5]" />}
              {isMore && <HelpCircle size={36} className="stroke-[2.5]" />}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className={`text-xl md:text-2xl font-black uppercase tracking-wider ${
                  isGood ? 'text-emerald-400' : isBad ? 'text-[#FF4D4D]' : 'text-amber-400'
                }`}>
                  {inspection.verdict_badge}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-black/60 text-gray-200 border border-white/10">
                  {inspection.id}
                </span>
              </div>

              {/* One-line plain-English reason */}
              <p className="text-sm text-gray-200 font-medium mt-1 leading-relaxed max-w-4xl">
                {inspection.verdict_reason}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-2 font-mono">
                <span>Engine: <strong className="text-white">{inspection.engine_metadata.type}</strong></span>
                <span>•</span>
                <span>Trailer: <strong className="text-white">{inspection.engine_metadata.trailer_id}</strong></span>
                <span>•</span>
                <span>Carrier: <strong className="text-white">{inspection.engine_metadata.carrier}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons inside Banner */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {isMore && (
              <button
                onClick={onGoToRetake}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-4 py-2.5 rounded-lg shadow transition-all"
              >
                <span>View Retake Instructions</span>
                <ArrowRight size={15} />
              </button>
            )}
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-200 text-xs px-3.5 py-2.5 rounded-lg border border-white/15 transition-all"
            >
              <RefreshCw size={13} />
              <span>Test Another Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION B: 6-IMAGE GRID WITH OVERLAYS */}
      <div className="bg-[#181A22] border border-[#2A2E3B] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#262A36]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-[#FFCC00]" />
              Inspection Image Evidence &amp; Model Overlays
            </h3>
            <p className="text-xs text-gray-400">
              Click any view to inspect high-resolution bounding boxes, DINOv2 self-attention maps, and angle vectors.
            </p>
          </div>

          {/* Interactive Layer Toggles */}
          <div className="flex items-center gap-2 bg-[#12141A] p-1 rounded-lg border border-[#282C38] text-xs">
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                showBoxes ? 'bg-[#FFCC00] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Boxes &amp; Masks</span>
            </button>
            <button
              onClick={() => setShowAngles(!showAngles)}
              className={`px-2.5 py-1 rounded transition-colors ${
                showAngles ? 'bg-[#FFCC00] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Angle Vectors
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1 rounded transition-colors ${
                showHeatmap ? 'bg-[#FFCC00] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              ViT Attention Heatmap
            </button>
          </div>
        </div>

        {/* 6-Grid Thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {inspection.images.map((img) => {
            const hasBad = img.detections.some(d => d.flag === "BAD");
            const hasUnknown = img.detections.some(d => d.flag === "UNKNOWN") || img.validation === "BLURRY";

            return (
              <div
                key={img.id}
                onClick={() => setSelectedImageModal(img)}
                className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.01] ${
                  hasBad
                    ? 'border-red-600/80 bg-[#1D1416]'
                    : hasUnknown
                    ? 'border-amber-600/70 bg-[#1C1814]'
                    : 'border-[#2D3241] bg-[#14161E] hover:border-gray-500'
                }`}
              >
                {/* Visual Area */}
                <div className="aspect-[16/10] w-full relative">
                  <InspectionVisual
                    viewType={img.type}
                    caseId={inspection.id}
                    validationStatus={img.validation}
                    showBoxes={showBoxes}
                    showHeatmap={showHeatmap}
                    showAngles={showAngles}
                    detections={img.detections}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/20">
                      <Maximize2 size={13} /> Click to Inspect
                    </span>
                  </div>
                </div>

                {/* Card Sub-bar */}
                <div className="p-3 bg-[#181B24] border-t border-[#2A2E3B] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-200">{img.classified_view}</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      DINOv2 Confidence: <strong className="text-white">{(img.view_confidence * 100).toFixed(0)}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasBad && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-400">
                        DEFECT
                      </span>
                    )}
                    {hasUnknown && !hasBad && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-400">
                        ATTENTION
                      </span>
                    )}
                    {!hasBad && !hasUnknown && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400">
                        COMPLIANT
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION C: COMPONENT EVIDENCE TABLE (TWO-MODALITY RULE IN ACTION) */}
      <div className="bg-[#181A22] border border-[#2A2E3B] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#262A36]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#FFCC00]" />
              <h3 className="text-base font-bold text-white">Component Evidence &amp; Two-Modality Agreement Rule</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Strict safety architecture: A defect is only confirmed <strong className="text-red-400">BAD</strong> when <strong>BOTH</strong> Modality 1 (Visual PatchCore) and Modality 2 (Geometry) agree. This guarantees False Positive Rate &le; 1.0%.
            </p>
          </div>

          <div className="text-[11px] font-mono bg-[#12141A] px-3 py-1.5 rounded-lg border border-[#282C38] text-gray-300">
            FP Target: <strong className="text-emerald-400">&le; 1.0%</strong> · FN Target: <strong className="text-blue-400">&lt; 10%</strong>
          </div>
        </div>

        {/* Evidence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#12141A] text-gray-400 uppercase tracking-wider font-mono text-[10px] border-b border-[#282C38]">
                <th className="py-3 px-4">Component ID / Type</th>
                <th className="py-3 px-4">Source View</th>
                <th className="py-3 px-4">Modality 1: Visual Anomaly (PatchCore)</th>
                <th className="py-3 px-4">Modality 2: Geometry / Vector</th>
                <th className="py-3 px-4 text-center">Dual Agreement</th>
                <th className="py-3 px-4 text-right">Safety Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242835]">
              {inspection.component_evidence.map((comp) => {
                const isCompBad = comp.status === "BAD";
                const isCompUnknown = comp.status === "UNKNOWN";

                return (
                  <tr 
                    key={comp.component_id}
                    className={`hover:bg-[#1E212B] transition-colors ${
                      isCompBad ? 'bg-red-950/20' : isCompUnknown ? 'bg-amber-950/15' : ''
                    }`}
                  >
                    {/* Component Info */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-100">{comp.component_type}</div>
                      <div className="font-mono text-[10px] text-gray-400">{comp.component_id}</div>
                    </td>

                    {/* Source View */}
                    <td className="py-3 px-4 text-gray-300 font-medium">
                      {comp.view_source}
                    </td>

                    {/* Modality 1: PatchCore */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${comp.anomaly_flag ? 'text-red-400' : 'text-emerald-400'}`}>
                          {comp.anomaly_score.toFixed(3)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          (Thresh: {comp.anomaly_threshold})
                        </span>
                      </div>
                      {comp.anomaly_flag ? (
                        <span className="text-[9px] text-red-400 font-semibold uppercase">● Exceeds 99th pct. threshold</span>
                      ) : (
                        <span className="text-[9px] text-emerald-400">● Normal calibration zone</span>
                      )}
                    </td>

                    {/* Modality 2: Geometry */}
                    <td className="py-3 px-4">
                      <div className={`font-medium ${comp.geometric_flag ? 'text-red-400' : 'text-gray-200'}`}>
                        {comp.geometric_measurement}
                      </div>
                      {comp.geometric_flag && (
                        <span className="text-[9px] text-red-400 font-semibold uppercase">● Out-of-tolerance</span>
                      )}
                    </td>

                    {/* Two-Modality Agreement */}
                    <td className="py-3 px-4 text-center">
                      {comp.both_agree ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-700">
                          AGREEMENT (BAD)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                          {comp.status === "GOOD" ? "Both Normal" : "Disagreement"}
                        </span>
                      )}
                    </td>

                    {/* Final Status */}
                    <td className="py-3 px-4 text-right">
                      {comp.status === "GOOD" && (
                        <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                          <CheckCircle2 size={12} /> GOOD
                        </span>
                      )}
                      {comp.status === "BAD" && (
                        <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-700">
                          <XCircle size={12} /> BAD
                        </span>
                      )}
                      {comp.status === "UNKNOWN" && (
                        <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-700">
                          <HelpCircle size={12} /> UNKNOWN
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION D: COLLAPSIBLE AUDIT TRAIL / LOG */}
      <div className="bg-[#181A22] border border-[#2A2E3B] rounded-2xl overflow-hidden">
        <button
          onClick={() => setAuditLogOpen(!auditLogOpen)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1C1F2B] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCC00] text-black font-extrabold text-[10px] px-2 py-0.5 rounded">AUDIT TRAIL</span>
            <span className="text-sm font-bold text-white">Deterministic Inspection Ledger &amp; Decision Rationale</span>
            <span className="text-xs text-gray-400 font-mono">({inspection.audit_trail.length} verified events)</span>
          </div>

          <div className="text-gray-400 hover:text-white">
            {auditLogOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {auditLogOpen && (
          <div className="p-4 bg-[#111319] border-t border-[#262A36] font-mono text-xs text-gray-300 space-y-2">
            {inspection.audit_trail.map((line, idx) => (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-[#FFCC00] select-none shrink-0 font-bold">&gt;</span>
                <span className={line.includes("FLAGGED") || line.includes("BAD") || line.includes("BLURRY") ? "text-red-400" : ""}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: HIGH-RESOLUTION VIEW EXPANSION */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181A22] border border-[#3E4557] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-[#14161E] border-b border-[#2A2E3B] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-[#FFCC00]">{selectedImageModal.name}</span>
                  <span className="text-xs font-mono text-gray-400">({selectedImageModal.classified_view})</span>
                </h4>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Resolution: {selectedImageModal.validation_metrics.resolution} · Laplacian: {selectedImageModal.validation_metrics.blur_laplacian} · Luminance: {selectedImageModal.validation_metrics.mean_luminance}
                </div>
              </div>

              <button
                onClick={() => setSelectedImageModal(null)}
                className="text-gray-400 hover:text-white bg-[#222633] p-1.5 rounded-lg transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#2E323F] bg-black">
                <InspectionVisual
                  viewType={selectedImageModal.type}
                  caseId={inspection.id}
                  validationStatus={selectedImageModal.validation}
                  showBoxes={showBoxes}
                  showHeatmap={showHeatmap}
                  showAngles={showAngles}
                  detections={selectedImageModal.detections}
                  className="w-full h-full"
                />
              </div>

              {/* Detected Hardware Sub-table */}
              <div className="mt-4 pt-4 border-t border-[#2A2E3B]">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Grounding DINO + SAM 2 Bounding Box Telemetry:
                </div>
                {selectedImageModal.detections.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedImageModal.detections.map((det, i) => (
                      <div key={i} className="bg-[#12141A] p-2.5 rounded-lg border border-[#242834] text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{det.class_name}</span>
                          <span className={`text-[10px] font-bold ${det.flag === 'GOOD' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {det.flag}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          Conf: {(det.confidence * 100).toFixed(1)}% · Bbox: [{det.bbox.join(', ')}]
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No valid components detected due to image blur or occlusion.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#14161E] border-t border-[#2A2E3B] flex justify-end">
              <button
                onClick={() => setSelectedImageModal(null)}
                className="bg-[#FFCC00] text-black font-bold text-xs px-4 py-2 rounded-lg"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
