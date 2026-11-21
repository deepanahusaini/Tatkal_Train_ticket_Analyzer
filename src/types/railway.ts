export type TravelClass = '1A' | '2A' | '3A' | '3E' | 'CC' | 'EC' | 'SL' | '2S';
export type QuotaCode = 'TQ' | 'PT' | 'GN' | 'LD' | 'SS';
export type AvailabilityStatus =
  | 'AVAILABLE'
  | 'RAC'
  | 'WAITLIST'
  | 'NOT AVAILABLE'
  | 'REGRET'
  | 'DATA UNAVAILABLE';

export type DataProvenance =
  | 'DEMO_SIMULATED'
  | 'CACHED'
  | 'HISTORICAL'
  | 'AI_PREDICTION'
  | 'AUTHORIZED_API';

export type TrainCategory =
  | 'Rajdhani'
  | 'Vande Bharat'
  | 'Shatabdi'
  | 'Duronto'
  | 'Superfast'
  | 'Express'
  | 'Freight Express'
  | 'DFC Container';

export type RailwayZone =
  | 'NR'
  | 'WR'
  | 'CR'
  | 'ER'
  | 'SR'
  | 'SCR'
  | 'NWR'
  | 'NCR'
  | 'NER'
  | 'ECR'
  | 'SER'
  | 'ECoR'
  | 'WCR'
  | 'SWR'
  | 'NFR'
  | 'SECR'
  | 'KR'
  | 'WDFC'
  | 'EDFC';

export interface Station {
  code: string;
  name: string;
  city: string;
  zone: RailwayZone;
  lat: number;
  lng: number;
  nearbyHubs: string[];
}

export interface RouteStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  distanceKm: number;
  day: number;
  platform: string;
  status: 'PASSED' | 'CURRENT' | 'UPCOMING';
  delayMinutes: number;
}

export interface ClassAvailability {
  travelClass: TravelClass;
  quota: QuotaCode;
  status: AvailabilityStatus;
  statusText: string; // e.g. "AVL 24", "RAC 14", "TQWL 18", "REGRET"
  availableSeats: number;
  racNumber: number;
  waitlistType: 'GNWL' | 'TQWL' | 'RLWL' | 'PQWL' | 'RAC' | 'NONE';
  waitlistNumber: number;
  fareInr: number | null;
  fareNote: string;
  depletionRatePerMin: number;
  lastUpdated: string;
  freshnessSeconds: number;
  provenance: DataProvenance;
}

export interface AvailabilityHistoryPoint {
  timestamp: string;
  label: string;
  availableSeats: number;
  waitlistNumber: number;
  racNumber: number;
  depletionVelocity: number;
  travelClass: TravelClass;
  provenance: DataProvenance;
}

export interface LiveRunningTelemetry {
  trainNumber: string;
  serviceType: 'PASSENGER' | 'FREIGHT';
  zone: RailwayZone;
  currentLocation: string;
  previousStation: string;
  nextStation: string;
  delayMinutes: number;
  estimatedArrival: string;
  progressPercent: number;
  speedKmh: number;
  lat: number;
  lng: number;
  freightPayloadTons?: number;
  freightCommodity?: string;
  lastUpdated: string;
  provenance: DataProvenance;
}

export interface TrainRecord {
  trainNumber: string;
  trainName: string;
  serviceType: 'PASSENGER' | 'FREIGHT';
  category: TrainCategory;
  zone: RailwayZone;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  durationLabel: string;
  distanceKm: number;
  runningDays: string[];
  classes: TravelClass[];
  popularityScore: number; // 0-100
  demandLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  punctualityPercent: number;
  avgTatkalSelloutMins: number;
  stops: RouteStop[];
  availability: ClassAvailability[];
  runningStatus: LiveRunningTelemetry;
  provenance: DataProvenance;
}

export interface RouteTrainMatch {
  trainNumber: string;
  trainName: string;
  category: TrainCategory;
  zone: RailwayZone;
  boardingStopCode: string;
  boardingStopName: string;
  boardingDeparture: string;
  destinationStopCode: string;
  destinationStopName: string;
  destinationArrival: string;
  segmentDistanceKm: number;
  stopsBetween: number;
  isDirectOriginToDest: boolean;
  runningDays: string[];
  classes: TravelClass[];
  demandLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  punctualityPercent: number;
  primaryAvailability: ClassAvailability | null;
  hasAvailableSeats: boolean;
  trainOriginCode: string;
  trainDestinationCode: string;
}

export interface RouteTrainCountResult {
  boardingQuery: string;
  destinationQuery: string;
  dayFilter: string;
  resolvedBoardingStations: { code: string; name: string; city: string }[];
  resolvedDestinationStations: { code: string; name: string; city: string }[];
  totalTrains: number;
  directOriginToDestCount: number;
  viaIntermediateCount: number;
  dailyTrainsCount: number;
  availableNowCount: number;
  reverseDirectionCount: number;
  categoryBreakdown: { category: TrainCategory; count: number }[];
  trains: RouteTrainMatch[];
  dataMode: 'DEMO_MODE' | 'AUTHORIZED_API';
  provenance: DataProvenance;
  timestamp: string;
}

export interface PredictionFactor {
  name: string;
  impact: number; // -30 to +30
  direction: 'positive' | 'negative' | 'neutral';
  detail: string;
}

export interface WaitlistPredictionResult {
  trainNumber: string;
  trainName: string;
  travelDate: string;
  travelClass: TravelClass;
  quota: QuotaCode;
  waitlistType: 'GNWL' | 'TQWL' | 'RLWL' | 'PQWL' | 'RAC';
  waitlistNumber: number;
  confirmationProbability: number; // 0-100
  confidenceInterval: [number, number];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedFinalStatus: string;
  anomalyDetected: boolean;
  anomalyNote?: string;
  factors: PredictionFactor[];
  historicalClearanceTrend: { daysBefore: string; clearanceRate: number; avgWlCleared: number }[];
  recommendation: string;
  disclaimer: string;
  modelVersion: string;
  provenance: DataProvenance;
  generatedAt: string;
  aiExplanation?: {
    summary: string;
    tacticalAdvice: string[];
    riskSignals: string[];
    modelUsed: string;
  } | null;
  aiError?: string | null;
}

export interface DemandAnalyticsPayload {
  provenance: DataProvenance;
  generatedAt: string;
  topPopularTrains: {
    trainNumber: string;
    trainName: string;
    corridor: string;
    popularityIndex: number;
    avgWaitlist: number;
    tatkalSelloutMins: number;
    demandLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  }[];
  highDemandRoutes: {
    route: string;
    dailySearches: number;
    avgOccupancyPct: number;
    tatkalPressureIndex: number;
  }[];
  dateHeatmap: {
    date: string;
    dayLabel: string;
    weekday: string;
    demandIndex: number; // 0-100
    isWeekend: boolean;
    seasonTag?: string;
  }[];
  classComparison: {
    travelClass: TravelClass;
    avgTatkalDemand: number;
    avgConfirmationRate: number;
    selloutMinutes: number;
  }[];
  bookingSpeedTimeline: {
    minuteAfterOpen: string;
    acRemainingPct: number;
    nonAcRemainingPct: number;
    premiumTatkalRemainingPct: number;
  }[];
  weekdayVsWeekend: {
    day: string;
    avgDemand: number;
    avgWl: number;
    confirmationPct: number;
  }[];
  seasonalTrends: {
    month: string;
    demandIndex: number;
    cancellationRate: number;
    tatkalSurge: number;
  }[];
}

export interface SmartRecommendation {
  type: 'ALTERNATE_TRAIN' | 'NEARBY_STATION' | 'ALTERNATE_DATE' | 'ALTERNATE_CLASS';
  title: string;
  subtitle: string;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destinationCode: string;
  travelClass: TravelClass;
  quota: QuotaCode;
  statusText: string;
  estimatedProbability: number;
  durationLabel: string;
  rankingScore: number;
  rationale: string;
  provenance: DataProvenance;
}

export interface AdminTelemetryPayload {
  dataMode: 'DEMO_MODE' | 'AUTHORIZED_API';
  providerStatus: string;
  uptimeSeconds: number;
  wsConnectedClients: number;
  cacheHitRatioPct: number;
  cacheEntries: number;
  apiRequestsLastHour: number;
  errorRatePct: number;
  rateLimitConfig: {
    windowMs: number;
    maxRequestsPerIp: number;
    currentTrackedIps: number;
  };
  dataFreshness: {
    feed: string;
    lastSync: string;
    stalenessSeconds: number;
    status: 'HEALTHY' | 'DEGRADED' | 'SIMULATED';
  }[];
  mlModelMetrics: {
    modelName: string;
    pipeline: string;
    version: string;
    lastTrainedAt: string;
    trainingSamples: number;
    aucRoc: number;
    brierScore: number;
    logLoss: number;
    calibrationError: number;
    featureImportances: { feature: string; weight: number }[];
  };
  recentApiLogs: {
    id: string;
    timestamp: string;
    method: string;
    path: string;
    status: number;
    latencyMs: number;
    source: DataProvenance;
  }[];
}

// Firestore persisted user documents
export interface UserPublicProfileDoc {
  uid: string;
  displayName: string;
  homeStation: string;
  preferredClass: TravelClass;
  preferredQuota: QuotaCode;
  theme: 'dark' | 'light';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserPrivateInfoDoc {
  uid: string;
  email: string;
  telegramHandle: string;
  emailAlerts: boolean;
  telegramAlerts: boolean;
  browserAlerts: boolean;
  windowReminderMinutes: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TrackedTrainDoc {
  id: string;
  userId: string;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destinationCode: string;
  travelDate: string;
  travelClass: TravelClass;
  quota: QuotaCode;
  targetStatus: 'AVAILABLE' | 'RAC' | 'WL_IMPROVEMENT' | 'WINDOW_OPEN';
  notes: string;
  status: 'active' | 'archived';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserAlertDoc {
  id: string;
  userId: string;
  trainNumber: string;
  title: string;
  message: string;
  category: 'AVAILABILITY' | 'WAITLIST' | 'BOOKING_WINDOW' | 'RUNNING_STATUS';
  severity: 'info' | 'warning' | 'critical';
  isRead: boolean;
  sourceType: 'DEMO_SIMULATED' | 'AUTHORIZED_API' | 'AI_PREDICTION' | 'SYSTEM_RULE';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SavedPredictionDoc {
  id: string;
  userId: string;
  trainNumber: string;
  trainName: string;
  travelDate: string;
  travelClass: TravelClass;
  quota: QuotaCode;
  waitlistType: 'GNWL' | 'TQWL' | 'RLWL' | 'PQWL' | 'RAC';
  waitlistNumber: number;
  probability: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  dataSourceLabel: string;
  createdAt?: unknown;
}

export interface AuditLogDoc {
  id: string;
  actorUid: string;
  action: string;
  target: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt?: unknown;
}
