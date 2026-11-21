# RailPulse AI — Real-Time Tatkal Train Ticket Analysis & Intelligence Platform

RailPulse AI is a full-stack Indian Railway intelligence, Tatkal availability monitoring, waitlist confirmation probability estimation, and live passenger & Dedicated Freight Corridor (WDFC/EDFC) analytics platform.

## Architecture Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4 (dual dark/light theme), Lucide icons, Recharts interactive visualizations.
- **Backend & Real-Time Engine (`server.ts`)**: Node.js + Express REST API + native `ws` WebSocket server on port `3000` broadcasting server-authoritative availability and corridor telemetry deltas (`/ws`), with sliding-window IP rate limiting and TTL caching.
- **Persistence & Authentication**: Firebase Authentication (Google Sign-In) + Cloud Firestore with hardened Eight-Pillars security rules (`firestore.rules`, `firebase-blueprint.json`, `security_spec.md`). A normalized PostgreSQL DDL reference schema is also included in `docs/postgres_schema.sql`.
- **AI & ML Pipeline**:
  - Calibrated Waitlist Confirmation Probability Ensemble (`src/server/mlEngine.ts`) with feature attribution, confidence intervals, Tatkal depletion anomaly detection, evaluation metrics (AUC-ROC, Brier Score, Log Loss, ECE), and live retraining.
  - Server-side Gemini AI reasoning (`src/server/geminiService.ts`) powered by `@google/genai` (`gemini-4-hydrogen`) generating tactical advice and risk signals.

## Ethical Data Provenance & Compliance

- RailPulse AI **clearly separates** live authorized feeds, cached snapshots, historical records, `DEMO MODE` simulated feeds, and AI-generated statistical estimates.
- Predictions are explicitly presented as probabilistic estimates — never guarantees.
- No CAPTCHA bypass, unauthorized scraping, or IRCTC credential automation is performed.

## REST & WebSocket API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service health and active data mode (`DEMO_MODE` / `AUTHORIZED_API`) |
| `/api/stations` | `GET` | Indian railway stations, zones, coordinates, and nearby hub mappings |
| `/api/trains` | `GET` | Filterable search (`q`, `source`, `destination`, `travelClass`, `quota`, `category`, `serviceType`) |
| `/api/trains/:trainNumber` | `GET` | Full schedule, stops, availability matrix, and live running telemetry |
| `/api/trains/:trainNumber/history` | `GET` | Timestamped availability, RAC, waitlist, and depletion rate snapshots |
| `/api/analytics/demand` | `GET` | Popularity rankings, high-demand corridors, 28-day heatmap, class & seasonal analytics |
| `/api/recommendations` | `GET` | Ranked alternate trains, nearby terminal hubs, optimal classes, and alternate dates |
| `/api/predictions/estimate` | `POST` | Calibrated ML confirmation probability + optional Gemini AI tactical explanation |
| `/api/ml/retrain` | `POST` | Recalibrate ML weights on historical snapshots and return updated evaluation metrics |
| `/api/admin/telemetry` | `GET` | WebSocket clients, cache hit ratio, rate-limit status, freshness, API logs, ML metrics |
| `/ws` | `WS` | Live WebSocket stream emitting `snapshot:init` and `feed:delta` events |

## Local Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```
