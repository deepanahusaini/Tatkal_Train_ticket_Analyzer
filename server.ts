import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { railDataEngine, STATIONS, RAIL_DATA_MODE, ACTIVE_PROVENANCE } from './src/server/railDataEngine.ts';
import { railMLEngine } from './src/server/mlEngine.ts';
import { generatePredictionExplanation } from './src/server/geminiService.ts';
import type { QuotaCode, TravelClass } from './src/types/railway.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

// Simple sliding-window in-memory IP rate limiter for /api routes
const rateLimitWindowMs = 60_000;
const maxRequestsPerWindow = 120;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimitMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    return next();
  }
  entry.count += 1;
  if (entry.count > maxRequestsPerWindow) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait before issuing additional requests.',
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    });
  }
  return next();
}

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json({ limit: '1mb' }));

  // Telemetry & timing logger for /api routes
  app.use('/api', rateLimitMiddleware, (req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      const latencyMs = Date.now() - started;
      railDataEngine.recordApiLog(req.method, req.originalUrl, res.statusCode, latencyMs, ACTIVE_PROVENANCE);
    });
    next();
  });

  // =========================================================================
  // REST API Routes
  // =========================================================================

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'RailPulse AI Intelligence Backend',
      dataMode: RAIL_DATA_MODE,
      provenance: ACTIVE_PROVENANCE,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/stations', (_req, res) => {
    res.json({
      stations: STATIONS,
      provenance: ACTIVE_PROVENANCE,
    });
  });

  app.get('/api/trains', (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const source = typeof req.query.source === 'string' ? req.query.source : undefined;
    const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
    const travelClass = typeof req.query.travelClass === 'string' ? req.query.travelClass : undefined;
    const quota = typeof req.query.quota === 'string' ? req.query.quota : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const serviceType = typeof req.query.serviceType === 'string' ? req.query.serviceType : undefined;

    const trains = railDataEngine.searchTrains({
      q,
      source,
      destination,
      travelClass,
      quota,
      category,
      serviceType,
    });

    res.json({
      trains,
      total: trains.length,
      dataMode: RAIL_DATA_MODE,
      provenance: ACTIVE_PROVENANCE,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/routes/count', (req, res) => {
    const boarding = typeof req.query.boarding === 'string' ? req.query.boarding.trim() : '';
    const destination = typeof req.query.destination === 'string' ? req.query.destination.trim() : '';
    const day = typeof req.query.day === 'string' ? req.query.day.trim() : 'ALL';

    if (!boarding || !destination) {
      return res.status(400).json({
        error: 'Both boarding and destination place names are required.',
      });
    }

    const result = railDataEngine.countTrainsBetweenPlaces(boarding, destination, day);
    res.json(result);
  });

  app.get('/api/trains/:trainNumber', (req, res) => {
    const train = railDataEngine.getTrainByNumber(req.params.trainNumber);
    if (!train) {
      return res.status(404).json({ error: `Train ${req.params.trainNumber} not found` });
    }
    res.json({ train, dataMode: RAIL_DATA_MODE, provenance: ACTIVE_PROVENANCE });
  });

  app.get('/api/trains/:trainNumber/history', (req, res) => {
    const travelClass = ((req.query.travelClass as string) || '3A') as TravelClass;
    const quota = ((req.query.quota as string) || 'TQ') as QuotaCode;
    const history = railDataEngine.getHistory(req.params.trainNumber, travelClass, quota);
    res.json({
      trainNumber: req.params.trainNumber,
      travelClass,
      quota,
      history,
      provenance: 'HISTORICAL',
    });
  });

  app.get('/api/analytics/demand', (_req, res) => {
    res.json(railDataEngine.getDemandAnalytics());
  });

  app.get('/api/recommendations', (req, res) => {
    const sourceCode = typeof req.query.source === 'string' ? req.query.source : 'NDLS';
    const destinationCode = typeof req.query.destination === 'string' ? req.query.destination : 'MMCT';
    const travelClass = (typeof req.query.travelClass === 'string' ? req.query.travelClass : '3A') as TravelClass;
    const recommendations = railDataEngine.getRecommendations({
      sourceCode,
      destinationCode,
      travelClass,
    });
    res.json({
      recommendations,
      dataMode: RAIL_DATA_MODE,
      provenance: ACTIVE_PROVENANCE,
    });
  });

  app.post('/api/predictions/estimate', async (req, res) => {
    try {
      const {
        trainNumber,
        travelDate,
        travelClass,
        quota,
        waitlistType,
        waitlistNumber,
        includeAiExplanation = true,
      } = req.body || {};

      const train = railDataEngine.getTrainByNumber(String(trainNumber || '12952'));
      if (!train) {
        return res.status(404).json({ error: 'Selected train not found in active catalog.' });
      }

      const validWlNum = Math.max(0, Math.min(500, Number(waitlistNumber ?? 14) || 0));
      const validDate =
        typeof travelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(travelDate)
          ? travelDate
          : new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);

      const prediction = railMLEngine.predictWaitlistConfirmation({
        train,
        travelDate: validDate,
        travelClass: (travelClass || train.classes[0] || '3A') as TravelClass,
        quota: (quota || 'TQ') as QuotaCode,
        waitlistType: waitlistType || (quota === 'TQ' ? 'TQWL' : 'GNWL'),
        waitlistNumber: validWlNum,
      });

      if (includeAiExplanation) {
        const aiResult = await generatePredictionExplanation(prediction);
        prediction.aiExplanation = aiResult.explanation;
        prediction.aiError = aiResult.error;
      }

      res.json(prediction);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Prediction engine error';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/ml/retrain', (_req, res) => {
    const metrics = railMLEngine.retrainFromHistoricalSnapshots(railDataEngine.getAllTrains().length);
    res.json({
      status: 'retrained',
      metrics,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/admin/telemetry', (_req, res) => {
    const stats = railDataEngine.getAdminStats(wss.clients.size, ipHits.size);
    res.json({
      ...stats,
      mlModelMetrics: railMLEngine.getMetrics(),
    });
  });

  // =========================================================================
  // Real-Time WebSocket Hub (/ws on port 3000)
  // =========================================================================

  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    // Initial authoritative snapshot sync
    ws.send(
      JSON.stringify({
        type: 'snapshot:init',
        dataMode: RAIL_DATA_MODE,
        provenance: ACTIVE_PROVENANCE,
        trains: railDataEngine.getAllTrains(),
        connectedClients: wss.clients.size,
        timestamp: new Date().toISOString(),
      })
    );

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        } else if (msg.type === 'request:sync') {
          ws.send(
            JSON.stringify({
              type: 'snapshot:init',
              dataMode: RAIL_DATA_MODE,
              provenance: ACTIVE_PROVENANCE,
              trains: railDataEngine.getAllTrains(),
              connectedClients: wss.clients.size,
              timestamp: new Date().toISOString(),
            })
          );
        }
      } catch {
        // Ignore malformed client frames
      }
    });
  });

  // Server-authoritative real-time broadcast interval (broadcasts minimal deltas to all connected WS clients)
  const broadcastInterval = setInterval(() => {
    if (wss.clients.size === 0) return;
    const { availabilityDelta, corridorDelta } = railDataEngine.advanceRealtimeTick();
    const payload = JSON.stringify({
      type: 'feed:delta',
      dataMode: RAIL_DATA_MODE,
      provenance: ACTIVE_PROVENANCE,
      availabilityDelta,
      corridorDelta,
      connectedClients: wss.clients.size,
      timestamp: new Date().toISOString(),
    });

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }, 5000);

  server.on('close', () => clearInterval(broadcastInterval));

  // =========================================================================
  // Frontend Asset Serving (Vite Dev Middleware or Production Dist)
  // =========================================================================

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`RailPulse AI server listening on http://0.0.0.0:${PORT} [${RAIL_DATA_MODE}]`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start RailPulse AI server:', err);
  process.exit(1);
});
