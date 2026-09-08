import React, { useState } from 'react';
import { SAMPLE_INSPECTIONS } from '../data/mockInspections';
import InspectionVisual from './InspectionVisual';
import { UploadCloud, CheckCircle, AlertOctagon, HelpCircle, ArrowRight, Plane, Truck, Calendar, User, FileText } from 'lucide-react';

export default function Screen1SelectUpload({ selectedCase, onSelectCase, onRunInspection }) {
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'upload'

  const currentInspection = SAMPLE_INSPECTIONS.find(c => c.id === selectedCase) || SAMPLE_INSPECTIONS[0];
  const meta = currentInspection.engine_metadata;

  return (
    <div className="space-y-6">
      {/* Top Banner: Presentation Guidance */}
      <div className="bg-[#1C1E26] border border-[#2E323F] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCC00] text-black font-extrabold text-xs px-2 py-0.5 rounded">SCREEN 1</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Select or Ingest Inspection Batch</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Choose a pre-loaded real-world scenario for live demo reliability, or drop 6+ field photographs to test the ingestion pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#12141A] p-1 rounded-lg border border-[#2A2E3B] text-xs font-medium">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'preset' ? 'bg-[#FFCC00] text-black font-bold shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pre-loaded Sample Set (Demo Safe)
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'upload' ? 'bg-[#FFCC00] text-black font-bold shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Custom Upload (6+ Images)
          </button>
        </div>
      </div>

      {/* Preset Selection Strip */}
      {activeTab === 'preset' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {SAMPLE_INSPECTIONS.map((item) => {
            const isSelected = item.id === selectedCase;
            const isGood = item.tag === "GOOD_TO_GO";
            const isBad = item.tag === "TIE_DOWN_INCORRECT";
            const isMore = item.tag === "MORE_IMAGES_REQUIRED";

            return (
              <div
                key={item.id}
                onClick={() => onSelectCase(item.id)}
                className={`cursor-pointer rounded-xl p-4 transition-all border text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#222633] border-[#FFCC00] shadow-lg shadow-[#FFCC00]/10 ring-1 ring-[#FFCC00]'
                    : 'bg-[#181A22] border-[#2A2E3B] hover:border-gray-600 hover:bg-[#1C1F29]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-gray-400">{item.id}</span>
                    {isGood && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        <CheckCircle size={11} /> GOOD
                      </span>
                    )}
                    {isBad && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                        <AlertOctagon size={11} /> DEFECT
                      </span>
                    )}
                    {isMore && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        <HelpCircle size={11} /> RETAKE
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-100 leading-snug">{item.label}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{item.verdict_reason}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-mono">{item.engine_metadata.type.split(' ')[0]}</span>
                  <span className="text-xs font-semibold text-[#FFCC00]">{isSelected ? 'Selected' : 'Click to Load'}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Custom Upload Dropzone */
        <div className="border-2 border-dashed border-[#3E4557] rounded-xl p-8 bg-[#151720] text-center hover:border-[#FFCC00] transition-colors cursor-pointer">
          <UploadCloud size={40} className="mx-auto text-[#FFCC00] mb-3 animate-bounce" />
          <h4 className="text-base font-bold text-white">Drop 6+ Truck & Suspension Images Here</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
            Accepts JPEG, PNG (min resolution 1600×900). Required angles: Front, Rear, Left, Right, Full Trailer Overview, and Pneumatic Air Bellows.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#262A36] text-xs font-semibold text-gray-200 px-4 py-2 rounded-lg border border-[#3E4557]">
            Browse Files on Local Machine
          </div>
        </div>
      )}

      {/* Selected Batch Metadata Card */}
      <div className="bg-[#181A22] border border-[#2A2E3B] rounded-xl p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <FileText size={14} className="text-[#FFCC00]" />
          Active Inspection Batch Manifest: <span className="text-white font-mono">{currentInspection.id}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#12141A] p-3 rounded-lg border border-[#242834]">
            <div className="text-gray-400 flex items-center gap-1.5 mb-1">
              <Plane size={13} className="text-blue-400" /> Aircraft Engine
            </div>
            <div className="font-bold text-gray-100">{meta.type}</div>
            <div className="text-[10px] text-gray-500 font-mono">S/N: {meta.serial_no}</div>
          </div>

          <div className="bg-[#12141A] p-3 rounded-lg border border-[#242834]">
            <div className="text-gray-400 flex items-center gap-1.5 mb-1">
              <Truck size={13} className="text-[#FFCC00]" /> Transport Carrier
            </div>
            <div className="font-bold text-gray-100">{meta.carrier}</div>
            <div className="text-[10px] text-gray-500 font-mono">Trailer: {meta.trailer_id}</div>
          </div>

          <div className="bg-[#12141A] p-3 rounded-lg border border-[#242834]">
            <div className="text-gray-400 flex items-center gap-1.5 mb-1">
              <Calendar size={13} className="text-emerald-400" /> Route & Schedule
            </div>
            <div className="font-bold text-gray-100 truncate">{meta.route}</div>
            <div className="text-[10px] text-gray-500 font-mono">{meta.timestamp}</div>
          </div>

          <div className="bg-[#12141A] p-3 rounded-lg border border-[#242834]">
            <div className="text-gray-400 flex items-center gap-1.5 mb-1">
              <User size={13} className="text-purple-400" /> Field Dispatcher
            </div>
            <div className="font-bold text-gray-100">{meta.operator_id}</div>
            <div className="text-[10px] text-gray-500">Customer: {meta.customer}</div>
          </div>
        </div>
      </div>

      {/* 6-Image Thumbnail Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-300">
            Selected Batch Images ({currentInspection.images.length} files detected):
          </span>
          <span className="text-gray-400 font-mono">
            Resolution: ~1920×1080 (Meets &ge;1600×900 spec)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {currentInspection.images.map((img, i) => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden border border-[#2E323F] bg-[#12141A]">
              <div className="aspect-[4/3] w-full">
                <InspectionVisual
                  viewType={img.type}
                  caseId={currentInspection.id}
                  validationStatus={img.validation}
                  showBoxes={false}
                  showAngles={false}
                  showHeatmap={false}
                  className="w-full h-full"
                />
              </div>
              <div className="p-2 bg-[#181A22] border-t border-[#2A2E3B]">
                <div className="text-[10px] font-mono text-[#FFCC00] font-semibold truncate">{img.classified_view}</div>
                <div className="text-[9px] text-gray-400 flex justify-between items-center mt-0.5">
                  <span>{img.validation_metrics.resolution}</span>
                  <span className={`font-bold ${img.validation === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {img.validation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer: Big "Run Inspection" CTA */}
      <div className="pt-2 flex items-center justify-between border-t border-[#2A2E3B]">
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] animate-ping"></span>
          Ready to dispatch to <strong>Step 1 & 2 Deterministic Gate</strong> &amp; <strong>Foundation Models</strong>
        </div>

        <button
          onClick={onRunInspection}
          className="flex items-center gap-3 bg-[#FFCC00] hover:bg-[#FFD633] text-black font-extrabold text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-[#FFCC00]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Run Inspection Pipeline</span>
          <ArrowRight size={18} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
