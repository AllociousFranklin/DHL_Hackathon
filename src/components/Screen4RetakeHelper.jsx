import React, { useState } from 'react';
import { HelpCircle, AlertCircle, Camera, Check, Copy, MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function Screen4RetakeHelper({ inspection, onBackToDashboard }) {
  const [copied, setCopied] = useState(false);
  const retakes = inspection.retake_instructions || [
    {
      image_slot: "Image 2: Rear Elevation",
      issue: "Severe motion blur detected (Laplacian score: 58.2, minimum required: 100.0).",
      action: "Hold phone/camera steady with two hands, step back 2.5 meters from trailer bumper, ensure rear cradle anchor hooks are in sharp focus, and retake photo in landscape orientation."
    },
    {
      image_slot: "Image 6: Pneumatic Air Suspension",
      issue: "Bellows assembly partially obstructed by wheel-well mud flap (mask coverage 48% < 80%).",
      action: "Position camera directly underneath axle clearance facing the rubber air spring bellows; illuminate with flashlight if in shadow to capture full cylindrical profile."
    }
  ];

  const driverSms = `DHL-DGF SAFETY NOTICE for ${inspection.engine_metadata.type} (Trailer: ${inspection.engine_metadata.trailer_id}):\nYour tie-down photos require 2 retakes before departure clearance:\n1. Rear View: blurry (hold steady, step back 2.5m).\n2. Air Suspension: obstructed by mudflap (capture clear view of rubber air bag bellows).\nPlease submit via WhatsApp or Driver Portal.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(driverSms);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-[#261C10] to-[#1B150F] border-2 border-amber-500 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500 text-black font-extrabold shadow">
            <HelpCircle size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFCC00] text-black font-extrabold text-[10px] px-2 py-0.5 rounded">SCREEN 4</span>
              <h2 className="text-xl font-bold text-white tracking-tight">Actionable Retake Guidance</h2>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              The AI inspection engine is <strong>conservative-by-design</strong>. Rather than guessing on ambiguous angles and compromising the &le; 1.0% False Positive safety threshold, it provides targeted photographic directives.
            </p>
          </div>
        </div>
      </div>

      {/* Retake Instruction Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Camera size={16} className="text-[#FFCC00]" />
          Targeted Deficiencies Requiring Resubmission ({retakes.length} items):
        </h3>

        {retakes.map((item, index) => (
          <div key={index} className="bg-[#181A22] border border-[#2E323F] rounded-xl p-5 hover:border-amber-500/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600 text-amber-400 font-bold flex items-center justify-center shrink-0 text-sm">
                #{index + 1}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{item.image_slot}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-semibold">
                    RESUBMISSION MANDATORY
                  </span>
                </div>

                <div className="bg-[#12141A] p-3 rounded-lg border border-[#262A36] text-xs">
                  <div className="text-gray-400 mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                    <AlertCircle size={13} className="text-red-400" />
                    <strong>Detected Algorithmic Failure:</strong>
                  </div>
                  <p className="text-gray-200 font-mono pl-4">{item.issue}</p>
                </div>

                <div className="bg-[#19221C] p-3 rounded-lg border border-emerald-800/40 text-xs">
                  <div className="text-emerald-400 mb-1 flex items-center gap-1.5 font-bold">
                    <Camera size={13} />
                    <strong>Corrective Action for Field Driver:</strong>
                  </div>
                  <p className="text-gray-200 pl-4 leading-relaxed">{item.action}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver SMS / WhatsApp Dispatch Generator */}
      <div className="bg-[#181A22] border border-[#2E323F] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
            <MessageSquare size={16} className="text-[#FFCC00]" />
            <span>Automated Driver Dispatch Notification (WhatsApp / SMS)</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold bg-[#262A36] hover:bg-[#323746] text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>
        </div>

        <div className="bg-[#0E1015] p-3.5 rounded-lg border border-[#252834] font-mono text-xs text-amber-200/90 whitespace-pre-line leading-relaxed">
          {driverSms}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2A2E3B]">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white bg-[#1C1E26] hover:bg-[#252834] px-4 py-2.5 rounded-lg border border-[#2A2E3B] transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back to Evidence Dashboard</span>
        </button>

        <button
          onClick={() => alert("Retake notification dispatched to field driver OP-9921 via DHL WhatsApp Gateway.")}
          className="flex items-center gap-2 text-xs font-bold bg-[#FFCC00] hover:bg-[#FFD633] text-black px-5 py-2.5 rounded-lg shadow-lg transition-all"
        >
          <Send size={14} />
          <span>Dispatch Retake Request to Driver</span>
        </button>
      </div>
    </div>
  );
}
