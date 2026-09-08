import React from 'react';

export default function InspectionVisual({ 
  viewType, 
  caseId, 
  validationStatus = "PASS", 
  showBoxes = true, 
  showHeatmap = false, 
  showAngles = true,
  detections = [],
  className = "" 
}) {
  const isBadStrap = caseId === "INSP-2026-002" && (viewType === "rear" || viewType === "left");
  const isLeafSpring = caseId === "INSP-2026-003" && viewType === "suspension";
  const isBlurry = validationStatus === "BLURRY";
  const isOccluded = caseId === "INSP-2026-004" && viewType === "suspension";

  return (
    <div className={`relative overflow-hidden rounded-lg bg-[#12141A] border border-[#2A2E39] select-none ${className}`}>
      {/* Visual SVG Content */}
      <svg 
        viewBox="0 0 400 240" 
        className={`w-full h-full object-cover transition-all duration-300 ${isBlurry ? 'blur-[3px]' : ''}`}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E232D" />
            <stop offset="100%" stopColor="#2A303C" />
          </linearGradient>

          <linearGradient id="tarpGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#1E5AA8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="cradleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          <linearGradient id="trailerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>

          <linearGradient id="bellowsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1C1E22" />
            <stop offset="50%" stopColor="#373B44" />
            <stop offset="100%" stopColor="#1C1E22" />
          </linearGradient>

          {/* Attention Heatmap Gradient */}
          <radialGradient id="attentionHeatmap" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF0000" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#FFCC00" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#00FFCC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0000FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Background / Depot Environment */}
        <rect x="0" y="0" width="400" height="240" fill="url(#skyGrad)" />
        {/* Depot floor / tarmac */}
        <rect x="0" y="180" width="400" height="60" fill="#181A20" />
        <line x1="0" y1="180" x2="400" y2="180" stroke="#333846" strokeWidth="2" />
        {/* Floor markings */}
        <line x1="20" y1="210" x2="380" y2="210" stroke="#FFCC00" strokeWidth="1" strokeDasharray="8,8" opacity="0.3" />

        {/* 2. Specific View Rendering */}
        {viewType === "suspension" ? (
          /* PNEUMATIC AIR SUSPENSION VIEW OR LEAF SPRING */
          <g>
            {/* Trailer undercarriage frame */}
            <rect x="40" y="30" width="320" height="35" fill="url(#trailerGrad)" rx="3" stroke="#4B5563" strokeWidth="1.5" />
            <rect x="80" y="25" width="240" height="8" fill="#111827" />

            {/* Axle bar */}
            <rect x="70" y="145" width="260" height="20" fill="#4B5563" rx="4" />
            {/* Wheel hubs on sides */}
            <rect x="30" y="120" width="40" height="70" fill="#111827" rx="6" />
            <rect x="330" y="120" width="40" height="70" fill="#111827" rx="6" />

            {isLeafSpring ? (
              /* LEAF SPRING (DEFECT / VIOLATION) */
              <g>
                <path d="M 90 145 Q 200 85 310 145" fill="none" stroke="#94A3B8" strokeWidth="7" />
                <path d="M 105 149 Q 200 100 295 149" fill="none" stroke="#64748B" strokeWidth="6" />
                <path d="M 120 153 Q 200 115 280 153" fill="none" stroke="#475569" strokeWidth="5" />
                {/* Center U-bolt bracket */}
                <rect x="185" y="80" width="30" height="75" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
                <text x="200" y="65" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  NON-AIR RIDE (LEAF SPRING)
                </text>
              </g>
            ) : (
              /* PNEUMATIC AIR RIDE BELLOWS (COMPLIANT) */
              <g>
                {/* Left Air Bellows */}
                <g>
                  <rect x="105" y="65" width="65" height="8" fill="#9CA3AF" rx="2" />
                  {/* Bellows rubber convolutions */}
                  <ellipse cx="137.5" cy="85" rx="35" ry="12" fill="url(#bellowsGrad)" stroke="#4B5563" strokeWidth="1" />
                  <ellipse cx="137.5" cy="103" rx="36" ry="12" fill="url(#bellowsGrad)" stroke="#4B5563" strokeWidth="1" />
                  <ellipse cx="137.5" cy="121" rx="35" ry="12" fill="url(#bellowsGrad)" stroke="#4B5563" strokeWidth="1" />
                  <rect x="108" y="133" width="60" height="12" fill="#9CA3AF" rx="2" />
                  {/* Air line hose */}
                  <path d="M 137 65 Q 155 45 190 45" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="3,2" />
                </g>

                {/* Right Air Bellows */}
                <g>
                  <rect x="230" y="65" width="65" height="8" fill="#9CA3AF" rx="2" />
                  <ellipse cx="262.5" cy="85" rx="35" ry="12" fill="url(#bellowsGrad)" stroke="#4B5563" strokeWidth="1" />
                  <ellipse cx="262.5" cy="103" rx="36" ry="12" fill="url(#bellowsGrad)" stroke="#4B5563" strokeWidth="1" />
                  <ellipse cx="262.5" cy="121" rx="35" ry="12" fill="url(#bellowsGrad)" stroke="#4B5563" strokeWidth="1" />
                  <rect x="233" y="133" width="60" height="12" fill="#9CA3AF" rx="2" />
                  <path d="M 262 65 Q 245 45 210 45" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="3,2" />
                </g>

                {/* Height Sensor Rod */}
                <line x1="200" y1="65" x2="200" y2="145" stroke="#10B981" strokeWidth="2" strokeDasharray="4,2" />
                <circle cx="200" cy="105" r="4" fill="#10B981" />
              </g>
            )}

            {/* Mudflap Occlusion if Case 4 */}
            {isOccluded && (
              <path d="M 140 20 L 290 20 L 270 190 L 160 190 Z" fill="#18181B" opacity="0.94" stroke="#27272A" strokeWidth="2" />
            )}
          </g>
        ) : (
          /* TRUCK & AIRCRAFT ENGINE VIEWS (Front, Rear, Left, Right, Full Trailer) */
          <g>
            {/* Flatbed Trailer Platform */}
            <rect x="25" y="150" width="350" height="22" fill="url(#trailerGrad)" stroke="#475569" strokeWidth="1.5" rx="2" />
            {/* Trailer Rub Rail with Stake Pockets */}
            <rect x="25" y="165" width="350" height="7" fill="#1E293B" />
            {[45, 85, 125, 165, 205, 245, 285, 325, 355].map((pos, i) => (
              <rect key={i} x={pos} y="166" width="10" height="5" fill="#E2E8F0" rx="1" />
            ))}
            {/* Trailer Wheels */}
            <rect x="50" y="172" width="55" height="35" fill="#111827" rx="6" />
            <rect x="295" y="172" width="55" height="35" fill="#111827" rx="6" />

            {/* Blue Heavy-Duty Engine Cradle Frame */}
            <rect x="55" y="125" width="290" height="25" fill="url(#cradleGrad)" stroke="#0284C7" strokeWidth="1.5" rx="3" />
            <text x="75" y="142" fill="#BAE6FD" fontSize="9" fontWeight="bold" fontFamily="sans-serif">DEDIENNE AEROSPACE CRADLE</text>
            <text x="280" y="142" fill="#BAE6FD" fontSize="8" fontWeight="bold" fontFamily="monospace">MAX 5800 KG</text>
            {/* Cradle shock-mount isolators */}
            <rect x="80" y="112" width="20" height="13" fill="#334155" rx="2" />
            <rect x="300" y="112" width="20" height="13" fill="#334155" rx="2" />

            {/* Aircraft Engine Profile (Covered in GE Spec Weatherproof Blue Tarp) */}
            <path 
              d="M 85 112 C 85 55, 150 40, 200 40 C 265 40, 315 55, 315 112 Z" 
              fill="url(#tarpGrad)" 
              stroke="#1D4ED8" 
              strokeWidth="2" 
            />
            {/* Blue Tarp Folds & Texture */}
            <path d="M 110 95 Q 150 65 200 70 Q 250 65 290 95" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" />
            <path d="M 130 112 Q 200 85 270 112" fill="none" stroke="#1E40AF" strokeWidth="1.5" />
            
            {/* Stenciled Engine Tarp Text */}
            <text x="200" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" letterSpacing="1" opacity="0.9">
              {caseId === "INSP-2026-002" ? "GE90-115B" : caseId === "INSP-2026-003" ? "GEnx-1B" : "CFM56-7B"}
            </text>
            <text x="200" y="103" textAnchor="middle" fill="#93C5FD" fontSize="8" fontWeight="bold" letterSpacing="0.5">
              GE AEROSPACE CARGO
            </text>

            {/* Tie-down Straps & Ratchet Binders */}
            {isBadStrap ? (
              /* BAD STRAP (Loose, Sagging, Flat 21.8° angle) */
              <g>
                {/* Slack/sagging strap */}
                <path d="M 90 120 Q 80 148 48 165" fill="none" stroke="#D40511" strokeWidth="5" strokeLinecap="round" />
                <path d="M 90 120 Q 80 148 48 165" fill="none" stroke="#FFCC00" strokeWidth="2" strokeDasharray="4,2" />
                {/* Loose Ratchet Binder */}
                <rect x="62" y="142" width="14" height="9" fill="#94A3B8" stroke="#D40511" strokeWidth="1.5" rx="1" />
                {/* Normal right strap */}
                <line x1="305" y1="120" x2="350" y2="165" stroke="#EAB308" strokeWidth="4" />
              </g>
            ) : (
              /* COMPLIANT STRAPS (Taut, 45-degree cross tie-down) */
              <g>
                {/* Forward cross strap (Left) */}
                <line x1="85" y1="115" x2="45" y2="165" stroke="#EAB308" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="85" y1="115" x2="45" y2="165" stroke="#1E3A8A" strokeWidth="1.5" strokeDasharray="4,2" />
                <rect x="60" y="135" width="10" height="7" fill="#CBD5E1" stroke="#334155" strokeWidth="1" rx="1" />
                {/* Hook connection at rub-rail */}
                <circle cx="45" cy="165" r="3.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />

                {/* Aft cross strap (Right) */}
                <line x1="310" y1="115" x2="350" y2="165" stroke="#EAB308" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="310" y1="115" x2="350" y2="165" stroke="#1E3A8A" strokeWidth="1.5" strokeDasharray="4,2" />
                <rect x="325" y="135" width="10" height="7" fill="#CBD5E1" stroke="#334155" strokeWidth="1" rx="1" />
                <circle cx="350" cy="165" r="3.5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
              </g>
            )}

            {/* Geometric Angle Vector Annotations */}
            {showAngles && (
              <g>
                {isBadStrap ? (
                  <g>
                    {/* Angle arc & text for defective strap */}
                    <path d="M 48 165 L 75 165" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="50" y="152" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      21.8° [FAIL]
                    </text>
                  </g>
                ) : (
                  <g>
                    {/* Compliant angle annotations */}
                    <path d="M 45 165 L 70 165" stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="48" y="153" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      44.2°
                    </text>
                    <path d="M 350 165 L 325 165" stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="325" y="153" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      44.8°
                    </text>
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* 3. Attention Heatmap Overlay (DINOv2 ViT Self-Attention) */}
        {showHeatmap && (
          <g opacity="0.65" style={{ mixBlendMode: 'screen' }}>
            {viewType === "suspension" ? (
              <circle cx="200" cy="105" r="90" fill="url(#attentionHeatmap)" />
            ) : isBadStrap ? (
              <circle cx="70" cy="140" r="70" fill="url(#attentionHeatmap)" />
            ) : (
              <>
                <circle cx="65" cy="135" r="50" fill="url(#attentionHeatmap)" />
                <circle cx="330" cy="135" r="50" fill="url(#attentionHeatmap)" />
              </>
            )}
          </g>
        )}

        {/* 4. Grounding DINO + SAM 2 Bounding Box Overlays */}
        {showBoxes && detections.map((det, idx) => {
          const [x1, y1, x2, y2] = det.bbox;
          // Scale from 800x450 to 400x240
          const sx = x1 * 0.5;
          const sy = y1 * 0.53;
          const sw = (x2 - x1) * 0.5;
          const sh = (y2 - y1) * 0.53;

          const isGood = det.flag === "GOOD";
          const isBad = det.flag === "BAD";
          const strokeColor = isGood ? "#10B981" : isBad ? "#EF4444" : "#9CA3AF";
          const fillColor = isGood ? "rgba(16, 185, 129, 0.15)" : isBad ? "rgba(239, 68, 68, 0.22)" : "rgba(156, 163, 175, 0.15)";

          return (
            <g key={idx}>
              <rect
                x={sx}
                y={sy}
                width={sw}
                height={sh}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeDasharray={isBad ? "none" : "none"}
                rx="2"
              />
              <rect
                x={sx}
                y={Math.max(0, sy - 14)}
                width={Math.max(55, det.class_name.length * 6 + 25)}
                height="13"
                fill={strokeColor}
                rx="1"
              />
              <text
                x={sx + 3}
                y={Math.max(0, sy - 14) + 10}
                fill="#FFFFFF"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {det.class_name} · {(det.confidence * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* View Title & Validation Pill Badge in Corner */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-gray-200 border border-white/10">
          {viewType.toUpperCase()}
        </span>
        {validationStatus === "PASS" ? (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            PASS
          </span>
        ) : (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 animate-pulse">
            {validationStatus}
          </span>
        )}
      </div>

      {/* Blur / Quality Notice if invalid */}
      {isBlurry && (
        <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 shadow">
            Step 2 Rejection: Blurry Image
          </span>
          <p className="text-[11px] text-red-200 font-mono">Laplacian: 58.2 &lt; 100 threshold</p>
        </div>
      )}
    </div>
  );
}
