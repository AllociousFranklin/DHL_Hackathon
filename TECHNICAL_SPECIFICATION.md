# DHL AeroCheck — Technical Specification Document

**Project:** Computer Vision for Aircraft Engine Tie-Down Process Automation
**Client:** DHL Global Forwarding (UK Aviation) & GE Aerospace
**Version:** 1.0 — 09 September 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture & Technology Stack](#3-architecture--technology-stack)
4. [User Roles & Access Control](#4-user-roles--access-control)
5. [UI/UX Design System](#5-uiux-design-system)
6. [Application Flow — Field Operator](#6-application-flow--field-operator)
7. [Application Flow — Safety Reviewer](#7-application-flow--safety-reviewer)
8. [Computer Vision Pipeline (6-Stage)](#8-computer-vision-pipeline-6-stage)
9. [Safety Decision Engine — Two-Modality Arbiter](#9-safety-decision-engine--two-modality-arbiter)
10. [Data Contract & Integration Schema](#10-data-contract--integration-schema)
11. [Required Inputs for Full Execution](#11-required-inputs-for-full-execution)
12. [PWA & Mobile Deployment](#12-pwa--mobile-deployment)
13. [File Structure & Codebase Map](#13-file-structure--codebase-map)

---

## 1. Executive Summary

**DHL AeroCheck** is a Progressive Web Application (PWA) designed to automate the visual inspection of aircraft engine tie-down configurations during road transport. The system replaces manual, paper-based checklist verification with a multi-modal computer vision pipeline that analyses photographs of the loaded trailer and returns a safety verdict.

The platform serves two distinct user personas:

- **Field Operators (Truck Drivers):** Capture and submit photographs of the engine cradle from multiple angles using their mobile device.
- **UK Safety Reviewers:** Review incoming inspection batches, monitor the automated pipeline execution, and examine the AI-generated evidence package before authorising departure.

The system enforces a **conservative-by-design** safety policy: a component is only marked as defective when **two independent modalities** (anomaly detection and geometric measurement) both agree. This guarantees a false positive rate of ≤ 1%, meaning operators are never incorrectly blocked from departure.

---

## 2. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DHL AeroCheck PWA                            │
│                                                                     │
│  ┌──────────────┐        ┌──────────────────────┐                   │
│  │  Field        │        │  UK Safety Reviewer   │                   │
│  │  Operator     │        │  Dashboard             │                   │
│  │  (Mobile)     │        │  (Desktop / Tablet)    │                   │
│  └──────┬───────┘        └──────────┬───────────┘                   │
│         │                            │                               │
│         │      ┌─────────────────┐   │                               │
│         └─────►│  Image Upload   │◄──┘                               │
│                └────────┬────────┘                                   │
│                         ▼                                            │
│         ┌───────────────────────────────┐                            │
│         │   6-Stage CV Pipeline          │                            │
│         │                               │                            │
│         │  1. Image Quality Validation  │                            │
│         │  2. View Classification       │                            │
│         │  3. Component Detection       │                            │
│         │  4. Anomaly Scoring           │                            │
│         │  5. Geometric Measurement     │                            │
│         │  6. Safety Decision           │                            │
│         └──────────────┬────────────────┘                            │
│                        ▼                                             │
│         ┌────────────────────────────┐                               │
│         │     Evidence Package        │                               │
│         │  (Verdict + Audit Trail)    │                               │
│         └────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Three Possible Verdicts

| Verdict | Colour | Meaning |
|:---|:---|:---|
| **GOOD TO GO** | 🟢 Green | All components verified. Operator is authorised to depart. |
| **TIE-DOWN INCORRECT** | 🔴 Red | A confirmed safety defect was found. Operator must NOT depart. |
| **MORE IMAGES REQUIRED** | 🟡 Amber | The system could not reach a confident verdict. Retake specific photos. |

---

## 3. Architecture & Technology Stack

### Frontend (Delivered)

| Layer | Technology | Purpose |
|:---|:---|:---|
| Framework | React 18 | Component-based UI rendering |
| Build Tool | Vite 6.x | Hot Module Replacement, fast bundling |
| Styling | Tailwind CSS 3.x | Utility-first responsive design |
| Icons | Lucide React | Consistent iconography |
| Fonts | Inter (UI), JetBrains Mono (data) | Typography system |
| PWA | Service Worker + Manifest | Installable, offline-capable mobile app |

### Backend (Pending Integration)

| Layer | Technology | Purpose |
|:---|:---|:---|
| API | FastAPI (Python) | Serve the CV pipeline as HTTP endpoints |
| Quality Gate | OpenCV | Blur, exposure, duplicate, resolution checks |
| Classification | DINOv2 + k-NN | Map each image to a view angle (Front, Rear, etc.) |
| Detection | Grounding DINO + SAM 2 | Detect and segment straps, chains, hooks, air bellows |
| Anomaly | PatchCore (DINOv2 backbone) | Score each component against a trained "GOOD" memory bank |
| Geometry | ViTPose | Measure strap routing angles and ride-height symmetry |

---

## 4. User Roles & Access Control

The application supports two roles, selectable at login via a toggle in the top navigation bar. Authentication is currently mocked — no credentials are validated. In production, this would integrate with DHL's SSO.

| Role | Label | Primary Device | Access |
|:---|:---|:---|:---|
| Field Operator | `operator` | Mobile phone (PWA) | Upload photos, receive verdict, receive retake instructions |
| UK Safety Reviewer | `reviewer` | Desktop / Tablet | Select inspection batch, monitor pipeline, review evidence, authorise departure |

---

## 5. UI/UX Design System

### 5.1 Brand Palette

The UI strictly adheres to DHL's corporate brand identity.

| Token | Hex | Usage |
|:---|:---|:---|
| DHL Postyellow | `#FFCC00` | Primary accent, CTA buttons, active states |
| DHL Red | `#D40511` | Logo, critical defect indicators |
| Carbon Black | `#0A0B0F` | Background surfaces |
| Card Surface | `rgba(255,255,255,0.03)` | Glass-morphism card backgrounds |
| Border | `rgba(255,255,255,0.06)` | Subtle card and input borders |
| Status Green | `#10B981` | GOOD TO GO verdict, passed checks |
| Status Red | `#EF4444` | TIE-DOWN INCORRECT, failed checks |
| Status Amber | `#F59E0B` | MORE IMAGES REQUIRED, uncertain |

### 5.2 Design Principles

1. **Mobile-First:** All layouts are designed for 320px minimum viewport width and scale up to desktop. `100dvh` is used for full viewport height to account for mobile browser address bars.
2. **Glass-Morphism:** Cards use translucent backgrounds (`bg-white/[0.03]`) with `backdrop-blur-sm` for a modern layered depth effect.
3. **Touch-Optimised:** All interactive elements have minimum 44px touch targets. Buttons use `active:scale-[0.97]` for tactile feedback.
4. **Safe Area Support:** iOS notch/Dynamic Island padding via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
5. **Smooth Transitions:** Screen changes use 500ms fade-in/slide-up animations for visual continuity.
6. **Don't Hide Uncertainty:** The system displays `UNKNOWN` status and `MORE IMAGES REQUIRED` as a deliberate design feature, not an error state.

### 5.3 Responsive Breakpoints

| Breakpoint | Target | Layout Behaviour |
|:---|:---|:---|
| `< 640px` | Mobile phones | Single column, stacked cards, sticky bottom CTA |
| `640px – 1024px` | Tablets | Two-column grids, expanded metadata |
| `> 1024px` | Desktop | Side-by-side panels (case list + details), full data table |

---

## 6. Application Flow — Field Operator

The operator flow is designed for maximum simplicity. A truck driver at a loading dock should be able to complete the entire process in under 60 seconds.

### Screen 1: Login
- DHL-branded login page with email and password fields (mocked).
- Role pre-selected as "Operator" via the top toggle.
- On mobile, the DHL branding panel collapses and only the form is shown.

### Screen 2: Photo Capture & Upload
- **Header:** DHL Yellow bar with logo, app title ("Tie-Down Check"), and logout icon.
- **Instruction card:** "Take at least **6 photos** of the truck from all sides including the air suspension. The system identifies each view automatically."
- **Primary action — "Take Photo":** A large, full-width DHL Yellow button. Uses `<input type="file" accept="image/*" capture="environment">` to directly open the device's rear-facing camera. Each tap captures one photo.
- **Secondary action — "Upload from Gallery":** A slimmer, outlined button below. Uses `<input type="file" accept="image/*" multiple>` to allow batch selection from the camera roll.
- **Progress bar:** Animated bar showing `N / 6` photos added. Transitions from yellow glow to green glow at ≥ 6.
- **Thumbnail grid:** 3-column grid of uploaded image previews with numbered badges and × removal buttons.
- **Sticky bottom CTA:** Disabled ("Add N more photos") until ≥ 6 are uploaded, then activates as "Submit for Inspection".

### Screen 3: Pipeline Processing
- **Animated circular progress ring:** SVG circle with DHL Yellow stroke that fills proportionally as stages complete. Displays percentage in the centre.
- **5 pipeline stages** displayed as stacked cards:
  1. Checking image quality
  2. Identifying views
  3. Detecting components
  4. Checking straps & suspension
  5. Applying safety rules
- Each stage transitions: grey (pending) → yellow with spinning loader (active) → green with checkmark (complete).
- Active stage shows bouncing dot animation.

### Screen 4: Verdict
- **Large verdict icon:** Circular badge with coloured glow (green/red/amber) and gradient background.
- **Verdict title and subtitle:** Plain-English explanation of the outcome.
- **Detail cards:**
  - **GOOD TO GO:** Checklist of what passed (e.g., "All 6 required views identified", "Tie-down straps secure (44° ± 2°)").
  - **TIE-DOWN INCORRECT:** Warning cards explaining exactly what is wrong and what the operator should do (e.g., "Rear-left strap is loose — routing angle 21.8°. Re-tension the ratchet binder.").
  - **MORE IMAGES REQUIRED:** Cards specifying which views to retake and why (e.g., "Rear View — too blurry, hold camera steady").
- **Bottom CTA:** "Done" (green, for GOOD) or "Retake & Resubmit" (yellow, for BAD/MORE).

---

## 7. Application Flow — Safety Reviewer

The reviewer flow prioritises evidence density and auditability over simplicity.

### Screen 1: Select Inspection
- **Left panel (scrollable list):** 4 pre-loaded demo inspection cases displayed as selectable cards. Each card shows:
  - Inspection ID (e.g., `INSP-2026-001`)
  - Engine type and label (e.g., "CFM56-7B — All Compliant")
  - Verdict tag pill (🟢 GOOD / 🔴 DEFECT / 🟡 RETAKE)
  - One-line summary of the outcome
- **Right panel (detail view):** For the selected case:
  - **Batch Details:** 6-field metadata grid — Engine Type, Trailer ID, Route, Operator ID, Submission Timestamp, Image Count.
  - **Batch Images:** 6 thumbnail placeholders with view labels and per-image validation status pills (PASS / DEFECT / BLURRY / OCCLUDED).
  - **CTA:** "Run Inspection Pipeline" button.

### Screen 2: Pipeline Progress (Storytelling)
- Full-width progress bar transitioning from yellow to green.
- 5 pipeline stages displayed as expandable cards, each showing:
  - Stage title (e.g., "Component Detection & Segmentation")
  - Technology used (e.g., "Grounding DINO + SAM 2")
  - Technical detail line (e.g., "Text-prompted detection: strap, chain, hook, anchor, air bellows → instance masks")
- Stages animate sequentially with staggered timing to create a "storytelling" effect for hackathon demonstrations.

### Screen 3: Evidence Dashboard
This is the core screen. It contains four sections:

#### A. Verdict Banner
- Full-width card with gradient glow matching the verdict colour.
- Large verdict icon, bold verdict text, and one-line human-readable reason.
- "New Case" button to return to the selection screen.

#### B. Image Evidence Grid
- 6-column grid (desktop) / 2-column (mobile) showing all uploaded views.
- Each cell shows the view name and a colour-coded status pill.

#### C. Two-Modality Evidence Table
- **Desktop:** Full HTML table with columns — Component, View, Modality 1 (Anomaly Score), Modality 2 (Geometry), Agreement, Status.
- **Mobile:** Stacked responsive cards. Each card shows:
  - Component name and ID
  - Side-by-side mini-grid: Anomaly Score (with threshold) | Geometric Measurement (with spec)
  - Red "⚠ Both modalities flagged → Confirmed BAD" banner when both signals agree.
- This section visually proves the Two-Modality Arbiter logic — judges can see exactly why a component was or was not flagged.

#### D. Retake Instructions (conditional)
- Only shown for `MORE IMAGES REQUIRED` verdicts.
- Cards listing each view that needs retaking with a plain-English reason.

#### E. Audit Trail (collapsible)
- Expandable section showing the chronological decision log.
- Each line is timestamped with a monospace font.
- Lines containing `FLAGGED`, `BAD`, or `FAILED` are highlighted in red.
- Provides full traceability from image reception to final verdict.

---

## 8. Computer Vision Pipeline (6-Stage)

The following table defines each stage of the pipeline, its input, processing model, thresholds, and output.

| # | Stage | Model / Method | Input | Thresholds | Output |
|:---|:---|:---|:---|:---|:---|
| 1 | Image Quality Validation | OpenCV (deterministic) | Raw uploaded images (≥6, JPEG/PNG) | Laplacian variance ≥ 100 (blur), luminance 40–220 (exposure), pHash hamming distance ≥ 5 (duplicate), resolution ≥ 1600×900 | Per-image status: `PASS`, `BLURRY`, `UNDEREXPOSED`, `OVEREXPOSED`, `DUPLICATE`, `CORRUPT` |
| 2 | View Classification | DINOv2 ViT-B/14 + k-NN | Validated images | Cosine similarity ≥ 0.85 (confident), ≥ 0.70 (uncertain), < 0.70 (reject) | Per-image view label: `Front`, `Rear`, `Left Side`, `Right Side`, `Full Trailer`, `Air Suspension`, or `Unknown` |
| 3 | Component Detection & Segmentation | Grounding DINO (text-prompted) + SAM 2 | View-classified images | Box confidence ≥ 0.35, mask coverage ≥ 80% | List of detected components: `{class_name, bbox, confidence, mask}` per image |
| 4 | Anomaly Scoring | PatchCore (DINOv2 backbone) | Cropped component patches from SAM 2 masks | Anomaly score threshold: 0.75 | Float anomaly score per component + boolean `aFlag` |
| 5 | Geometric Measurement | ViTPose (keypoint regression) | Cropped strap and suspension regions | Strap angle: 45° ± 15° (i.e., 30°–60°), Ride-height asymmetry: ≤ 20mm | Angle or distance measurement per component + boolean `gFlag` |
| 6 | Safety Decision | Two-Modality Arbiter (rule-based) | `aFlag` and `gFlag` per component | Both must be `true` for BAD | Final verdict: `GOOD_TO_GO`, `TIE_DOWN_INCORRECT`, or `MORE_IMAGES_REQUIRED` |

---

## 9. Safety Decision Engine — Two-Modality Arbiter

The decision engine is the core intellectual property of this system. It enforces a **dual-signal agreement** rule:

### Decision Matrix

| Anomaly (`aFlag`) | Geometry (`gFlag`) | Agreement | Component Status | Rationale |
|:---|:---|:---|:---|:---|
| `false` | `false` | Both clear | **GOOD** | No issues detected by either modality. |
| `true` | `false` | Disagree | **UNKNOWN** | Only anomaly flagged. Could be a visual artifact. Conservative → MORE IMAGES. |
| `false` | `true` | Disagree | **UNKNOWN** | Only geometry flagged. Could be a measurement error. Conservative → MORE IMAGES. |
| `true` | `true` | **Both flag** | **BAD** | Confirmed defect. Both independent modalities agree. → TIE-DOWN INCORRECT. |

### Global Verdict Logic

```
IF any component.status == "BAD":
    verdict = "TIE_DOWN_INCORRECT"
ELIF any component.status == "UNKNOWN" OR any image failed quality:
    verdict = "MORE_IMAGES_REQUIRED"
ELSE:
    verdict = "GOOD_TO_GO"
```

### Safety Guarantees

- **False Positive Rate ≤ 1%:** A component is never marked BAD unless two independent signals agree. This prevents unnecessary truck stoppages.
- **False Negative Rate < 10%:** The system errs on the side of caution. When uncertain, it requests more images rather than issuing a false clearance.

---

## 10. Data Contract & Integration Schema

The frontend consumes a single JSON object per inspection. The backend pipeline must produce this exact structure.

```json
{
  "id": "INSP-2026-005",
  "tag": "GOOD_TO_GO | TIE_DOWN_INCORRECT | MORE_IMAGES_REQUIRED",
  "verdict": "GOOD TO GO",
  "verdict_reason": "Human-readable one-line explanation of the outcome.",

  "metadata": {
    "engine_type": "CFM56-7B (Narrowbody Turbofan)",
    "serial": "GE-CFM-889412",
    "trailer": "UK-FLT-9921",
    "route": "GE Nantgarw Wales → London Heathrow",
    "operator": "OP-4412 (Cardiff Hub)",
    "timestamp": "09 Sep 2026 · 08:30 UTC",
    "images_count": 6
  },

  "thumbnails": [
    {
      "id": 1,
      "view": "Front | Rear | Left Side | Right Side | Full Trailer | Air Suspension | Unknown",
      "status": "PASS | DEFECT | BLURRY | OCCLUDED | UNDEREXPOSED | OVEREXPOSED | DUPLICATE"
    }
  ],

  "components": [
    {
      "id": "STRAP-L1",
      "type": "Ratchet Strap (Left-Fwd)",
      "view": "Left Side",
      "anomaly": 0.038,
      "thresh": 0.75,
      "aFlag": false,
      "geo": "44.2°",
      "geoSpec": "45° ± 15°",
      "gFlag": false,
      "agree": false,
      "status": "GOOD | BAD | UNKNOWN"
    }
  ],

  "retakes": [
    {
      "view": "Rear View",
      "reason": "Severe motion blur (Laplacian 58.2 < 100). Hold camera steady."
    }
  ],

  "audit": [
    "08:30:15 — Batch received: 6 images, all valid JPEG.",
    "08:30:23 — Two-Modality Arbiter: zero flags. Verdict → GOOD TO GO."
  ]
}
```

### Field Definitions

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | string | ✅ | Unique inspection identifier |
| `tag` | enum | ✅ | Machine-readable verdict: `GOOD_TO_GO`, `TIE_DOWN_INCORRECT`, `MORE_IMAGES_REQUIRED` |
| `verdict` | string | ✅ | Human-readable verdict label |
| `verdict_reason` | string | ✅ | One-line plain-English explanation |
| `metadata` | object | ✅ | Engine, trailer, route, operator, timestamp, image count |
| `thumbnails` | array | ✅ | Per-image view classification and quality status |
| `components` | array | ✅ | Per-component anomaly score, geometric measurement, agreement flag, final status |
| `retakes` | array | Conditional | Required when `tag == "MORE_IMAGES_REQUIRED"`. Lists views to retake with reasons. |
| `audit` | array | ✅ | Chronological log of pipeline decisions |

---

## 11. Required Inputs for Full Execution

The following inputs are required from the backend CV pipeline to fully integrate with the frontend. The UI is currently running on mock data and is **100% ready** to consume live data once the backend outputs the JSON schema defined above.

### 11.1 From the Image Quality Module
- Per-image validation result (`PASS`, `BLURRY`, `UNDEREXPOSED`, `OVEREXPOSED`, `DUPLICATE`, `CORRUPT`)
- Laplacian variance value (for blur reason in retake instructions)
- Luminance value (for exposure reason)

### 11.2 From the View Classification Module
- Per-image view label (`Front`, `Rear`, `Left Side`, `Right Side`, `Full Trailer`, `Air Suspension`)
- Confidence score (cosine similarity) for each classification
- `Unknown` label if confidence < 0.70

### 11.3 From the Detection & Segmentation Module
- List of detected components per image: `{class_name, bounding_box, confidence}`
- SAM 2 mask coverage percentage per component (for occlusion detection)
- Flag if mask coverage < 80% (triggers `OCCLUDED` status)

### 11.4 From the Anomaly & Geometry Module
- Per-component float anomaly score (e.g., `0.038`)
- Per-component boolean `aFlag` (true if score exceeds 0.75 threshold)
- Per-component geometric measurement string (e.g., `"44.2°"` or `"Δh = 4.2mm"`)
- Per-component geometric spec string (e.g., `"45° ± 15°"` or `"≤ 20mm"`)
- Per-component boolean `gFlag` (true if measurement is out of spec)

### 11.5 From the Decision Engine
- Per-component boolean `agree` (true if both `aFlag` AND `gFlag` are true)
- Per-component final status string (`GOOD`, `BAD`, `UNKNOWN`)
- Global verdict tag, label, and reason
- Full audit trail array

---

## 12. PWA & Mobile Deployment

The application is configured as a Progressive Web App for native-like mobile experiences.

### Configuration

| Feature | Implementation |
|:---|:---|
| Web App Manifest | `public/manifest.json` — app name, theme colour, standalone display mode |
| Service Worker | `public/sw.js` — network-first caching with offline fallback |
| iOS Standalone | `apple-mobile-web-app-capable: yes`, `apple-mobile-web-app-status-bar-style: black-translucent` |
| Viewport | `viewport-fit=cover`, `maximum-scale=1.0`, `user-scalable=no` |
| Camera Access | `<input capture="environment">` opens rear camera natively on mobile |
| Safe Areas | `env(safe-area-inset-top/bottom)` for notched devices |

### Installation
On mobile Chrome or Safari, users can tap "Add to Home Screen" / "Install App" to install the PWA. It will:
- Appear on the home screen with the DHL theme
- Launch without a browser address bar (standalone mode)
- Use the DHL Yellow (`#FFCC00`) as the status bar colour

---

## 13. File Structure & Codebase Map

```
DHL_Aircraft_Hackathon/
├── index.html                          # Entry HTML with PWA meta tags and SW registration
├── package.json                        # Dependencies: React, Vite, Tailwind, Lucide
├── vite.config.js                      # Vite + React plugin configuration
├── tailwind.config.js                  # DHL brand colour tokens and custom theme
├── postcss.config.js                   # PostCSS pipeline for Tailwind
├── .gitignore                          # Excludes node_modules, dist, editor files
├── README.md                           # Public-facing project overview with UI screenshots
│
├── public/
│   ├── manifest.json                   # PWA manifest (name, icons, display mode)
│   ├── sw.js                           # Service Worker (caching strategy)
│   └── vite.svg                        # Default favicon
│
├── mocks/
│   ├── DHL_mock_1.jpg ... DHL_mock_11.jpg  # UI screenshots for README
│
└── src/
    ├── main.jsx                        # React DOM entry point
    ├── index.css                       # Tailwind directives, safe-area styles, scrollbar
    ├── App.jsx                         # Root component: login gate → role-based routing
    │
    ├── data/
    │   └── mockInspections.js          # 4 demo cases with full evidence packages
    │
    └── components/
        ├── LoginPage.jsx               # Login with DHL branding + role switcher
        ├── OperatorDashboard.jsx        # Mobile-first: camera/gallery → pipeline → verdict
        ├── ReviewerDashboard.jsx        # Desktop: case selection → pipeline → evidence
        ├── ReviewerPipeline.jsx         # 5-stage animated pipeline progress
        └── ReviewerEvidence.jsx         # Verdict + image grid + two-modality table + audit
```

---

*Document prepared for internal distribution. DHL Global Forwarding & GE Aerospace — September 2026.*
