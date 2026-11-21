import type {
  AvailabilityHistoryPoint,
  AvailabilityStatus,
  ClassAvailability,
  DataProvenance,
  DemandAnalyticsPayload,
  LiveRunningTelemetry,
  QuotaCode,
  RouteTrainCountResult,
  RouteTrainMatch,
  SmartRecommendation,
  Station,
  TrainCategory,
  TrainRecord,
  TravelClass,
} from '../types/railway.ts';
import {
  INDIA_PASSENGER_STATIONS,
  INDIA_PLACE_ALIASES,
  buildPanIndiaDemoCorridorMatches,
} from './indiaStationsCatalog.ts';

export const RAIL_DATA_MODE: 'DEMO_MODE' | 'AUTHORIZED_API' =
  process.env.RAIL_DATA_MODE === 'AUTHORIZED_API' && Boolean(process.env.RAIL_API_KEY)
    ? 'AUTHORIZED_API'
    : 'DEMO_MODE';

export const ACTIVE_PROVENANCE: DataProvenance =
  RAIL_DATA_MODE === 'AUTHORIZED_API' ? 'AUTHORIZED_API' : 'DEMO_SIMULATED';

const FREIGHT_STATIONS: Station[] = [
  { code: 'DADRI', name: 'New Dadri DFC Hub', city: 'NCR Freight', zone: 'WDFC', lat: 28.5504, lng: 77.554, nearbyHubs: ['TKD'] },
  { code: 'JNPT', name: 'JNPT Port Freight Terminal', city: 'Navi Mumbai', zone: 'WDFC', lat: 18.9502, lng: 72.951, nearbyHubs: ['PNVL'] },
  { code: 'DDU', name: 'Pt. DD Upadhyaya Freight Hub', city: 'Mughalsarai', zone: 'EDFC', lat: 25.2804, lng: 83.1187, nearbyHubs: ['PNBE'] },
];

export const STATIONS: Station[] = [...INDIA_PASSENGER_STATIONS, ...FREIGHT_STATIONS];

function nowIso(): string {
  return new Date().toISOString();
}

function buildInitialTrains(): TrainRecord[] {
  const ts = nowIso();
  return [
    {
      trainNumber: '12952',
      trainName: 'Mumbai Tejas Rajdhani Express',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'WR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'MMCT',
      destinationName: 'Mumbai Central',
      departureTime: '16:55',
      arrivalTime: '08:35',
      durationMinutes: 940,
      durationLabel: '15h 40m',
      distanceKm: 1386,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 98,
      demandLevel: 'CRITICAL',
      punctualityPercent: 94,
      avgTatkalSelloutMins: 4.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '16:55', departureTime: '16:55', distanceKm: 0, day: 1, platform: '3', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '21:35', departureTime: '21:45', distanceKm: 465, day: 1, platform: '1', status: 'PASSED', delayMinutes: 4 },
        { stationCode: 'RTM', stationName: 'Ratlam Junction', arrivalTime: '00:42', departureTime: '00:45', distanceKm: 732, day: 2, platform: '4', status: 'CURRENT', delayMinutes: 6 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '03:50', departureTime: '04:00', distanceKm: 993, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 5 },
        { stationCode: 'ST', stationName: 'Surat', arrivalTime: '05:24', departureTime: '05:29', distanceKm: 1123, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 3 },
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '08:35', departureTime: '08:35', distanceKm: 1386, day: 2, platform: '5', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 14', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 14, fareInr: 2890, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 18.4, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 9', availableSeats: 9, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 4050, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 9.2, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '1A', quota: 'GN', status: 'RAC', statusText: 'RAC 4', availableSeats: 0, racNumber: 4, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 4920, fareNote: 'Base Rajdhani fare', depletionRatePerMin: 2.1, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '3A', quota: 'PT', status: 'AVAILABLE', statusText: 'AVL 16', availableSeats: 16, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3640, fareNote: 'Dynamic Premium Tatkal', depletionRatePerMin: 11.5, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12952',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'Crossing Ratlam Outer (WR Mainline)',
        previousStation: 'Kota Junction (KOTA)',
        nextStation: 'Vadodara Junction (BRC)',
        delayMinutes: 6,
        estimatedArrival: '08:41 IST',
        progressPercent: 54,
        speedKmh: 124,
        lat: 23.3315,
        lng: 75.0367,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12302',
      trainName: 'Howrah Rajdhani Express (Via Gaya)',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'ER',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'HWH',
      destinationName: 'Howrah Junction',
      departureTime: '16:50',
      arrivalTime: '09:55',
      durationMinutes: 1025,
      durationLabel: '17h 05m',
      distanceKm: 1451,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 95,
      demandLevel: 'CRITICAL',
      punctualityPercent: 91,
      avgTatkalSelloutMins: 5.1,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '16:50', departureTime: '16:50', distanceKm: 0, day: 1, platform: '2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:32', departureTime: '21:37', distanceKm: 440, day: 1, platform: '5', status: 'PASSED', delayMinutes: 8 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '23:43', departureTime: '23:45', distanceKm: 635, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 12 },
        { stationCode: 'DDU', stationName: 'Pt. DD Upadhyaya Jn', arrivalTime: '01:55', departureTime: '02:05', distanceKm: 787, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 10 },
        { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '06:30', departureTime: '06:35', distanceKm: 1188, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 7 },
        { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '09:55', departureTime: '09:55', distanceKm: 1451, day: 2, platform: '9', status: 'UPCOMING', delayMinutes: 5 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'REGRET', statusText: 'REGRET', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 85, fareInr: 2945, fareNote: 'Tatkal booking limit reached', depletionRatePerMin: 21.0, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 8', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 8, fareInr: 4180, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 10.6, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '3A', quota: 'GN', status: 'WAITLIST', statusText: 'GNWL 32', availableSeats: 0, racNumber: 0, waitlistType: 'GNWL', waitlistNumber: 32, fareInr: 2340, fareNote: 'Base Rajdhani fare', depletionRatePerMin: 3.8, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12302',
        serviceType: 'PASSENGER',
        zone: 'ER',
        currentLocation: 'Approaching Prayagraj Outer Signal',
        previousStation: 'Kanpur Central (CNB)',
        nextStation: 'Pt. DD Upadhyaya Jn (DDU)',
        delayMinutes: 12,
        estimatedArrival: '10:07 IST',
        progressPercent: 44,
        speedKmh: 118,
        lat: 25.4358,
        lng: 81.8463,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '22436',
      trainName: 'New Delhi - Varanasi Vande Bharat Express',
      serviceType: 'PASSENGER',
      category: 'Vande Bharat',
      zone: 'NR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'CNB',
      destinationName: 'Kanpur Central',
      departureTime: '06:00',
      arrivalTime: '10:08',
      durationMinutes: 248,
      durationLabel: '4h 08m',
      distanceKm: 440,
      runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 93,
      demandLevel: 'HIGH',
      punctualityPercent: 97,
      avgTatkalSelloutMins: 8.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:00', departureTime: '06:00', distanceKm: 0, day: 1, platform: '16', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '10:08', departureTime: '10:10', distanceKm: 440, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 0 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '12:08', departureTime: '12:10', distanceKm: 635, day: 1, platform: '6', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 42', availableSeats: 42, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1750, fareNote: 'Chair Car Tatkal fare', depletionRatePerMin: 6.4, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 11', availableSeats: 11, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3290, fareNote: 'Executive Chair Car', depletionRatePerMin: 3.1, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'CC', quota: 'GN', status: 'AVAILABLE', statusText: 'AVL 86', availableSeats: 86, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1410, fareNote: 'Standard CC fare', depletionRatePerMin: 1.9, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '22436',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'At Kanpur Central Platform 1',
        previousStation: 'New Delhi (NDLS)',
        nextStation: 'Prayagraj Junction (PRYJ)',
        delayMinutes: 0,
        estimatedArrival: '10:08 IST',
        progressPercent: 70,
        speedKmh: 130,
        lat: 26.4539,
        lng: 80.3511,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12954',
      trainName: 'August Kranti Tejas Rajdhani',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'WR',
      sourceCode: 'NZM',
      sourceName: 'Hazrat Nizamuddin',
      destinationCode: 'MMCT',
      destinationName: 'Mumbai Central',
      departureTime: '17:15',
      arrivalTime: '10:05',
      durationMinutes: 1010,
      durationLabel: '16h 50m',
      distanceKm: 1378,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 91,
      demandLevel: 'HIGH',
      punctualityPercent: 93,
      avgTatkalSelloutMins: 7.4,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '17:15', departureTime: '17:15', distanceKm: 0, day: 1, platform: '7', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '22:15', departureTime: '22:25', distanceKm: 458, day: 1, platform: '2', status: 'CURRENT', delayMinutes: 3 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '04:30', departureTime: '04:40', distanceKm: 985, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 2 },
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '10:05', departureTime: '10:05', distanceKm: 1378, day: 2, platform: '4', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 18', availableSeats: 18, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2860, fareNote: 'Lower demand vs 12952', depletionRatePerMin: 9.8, lastUpdated: ts, freshnessSeconds: 6, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 14', availableSeats: 14, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3980, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 5.5, lastUpdated: ts, freshnessSeconds: 6, provenance: ACTIVE_PROVENANCE },
        { travelClass: '3A', quota: 'GN', status: 'RAC', statusText: 'RAC 11', availableSeats: 0, racNumber: 11, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 2295, fareNote: 'Base Rajdhani fare', depletionRatePerMin: 2.2, lastUpdated: ts, freshnessSeconds: 6, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12954',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'Departing Kota Junction',
        previousStation: 'Hazrat Nizamuddin (NZM)',
        nextStation: 'Vadodara Junction (BRC)',
        delayMinutes: 3,
        estimatedArrival: '10:08 IST',
        progressPercent: 34,
        speedKmh: 121,
        lat: 25.2138,
        lng: 75.8648,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12628',
      trainName: 'Karnataka Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'SR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'SBC',
      destinationName: 'KSR Bengaluru',
      departureTime: '20:20',
      arrivalTime: '12:00',
      durationMinutes: 2380,
      durationLabel: '39h 40m',
      distanceKm: 2406,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', '3E', 'SL'],
      popularityScore: 94,
      demandLevel: 'CRITICAL',
      punctualityPercent: 86,
      avgTatkalSelloutMins: 3.8,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '20:20', departureTime: '20:20', distanceKm: 0, day: 1, platform: '5', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '06:25', departureTime: '06:35', distanceKm: 702, day: 2, platform: '2', status: 'PASSED', delayMinutes: 14 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '12:20', departureTime: '12:25', distanceKm: 1091, day: 2, platform: '1', status: 'CURRENT', delayMinutes: 18 },
        { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '21:15', departureTime: '21:25', distanceKm: 1668, day: 2, platform: '4', status: 'UPCOMING', delayMinutes: 15 },
        { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '12:00', departureTime: '12:00', distanceKm: 2406, day: 3, platform: '3', status: 'UPCOMING', delayMinutes: 12 },
      ],
      availability: [
        { travelClass: 'SL', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 46', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 46, fareInr: 1045, fareNote: 'Non-AC Tatkal (11:00 IST)', depletionRatePerMin: 26.2, lastUpdated: ts, freshnessSeconds: 7, provenance: ACTIVE_PROVENANCE },
        { travelClass: '3A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 19', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 19, fareInr: 2560, fareNote: 'AC Tatkal (10:00 IST)', depletionRatePerMin: 15.8, lastUpdated: ts, freshnessSeconds: 7, provenance: ACTIVE_PROVENANCE },
        { travelClass: '3E', quota: 'TQ', status: 'RAC', statusText: 'RAC 7', availableSeats: 0, racNumber: 7, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 2380, fareNote: '3E AC Economy', depletionRatePerMin: 8.9, lastUpdated: ts, freshnessSeconds: 7, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'GN', status: 'WAITLIST', statusText: 'GNWL 12', availableSeats: 0, racNumber: 0, waitlistType: 'GNWL', waitlistNumber: 12, fareInr: 3120, fareNote: 'Base Superfast fare', depletionRatePerMin: 2.1, lastUpdated: ts, freshnessSeconds: 7, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12628',
        serviceType: 'PASSENGER',
        zone: 'SR',
        currentLocation: 'Halted at Nagpur Junction (CR Division)',
        previousStation: 'Bhopal Junction (BPL)',
        nextStation: 'Secunderabad Junction (SC)',
        delayMinutes: 18,
        estimatedArrival: '12:18 IST',
        progressPercent: 46,
        speedKmh: 94,
        lat: 21.1525,
        lng: 79.0888,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12724',
      trainName: 'Telangana Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'SCR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'SC',
      destinationName: 'Secunderabad Junction',
      departureTime: '16:00',
      arrivalTime: '16:15',
      durationMinutes: 1455,
      durationLabel: '24h 15m',
      distanceKm: 1668,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', 'SL'],
      popularityScore: 89,
      demandLevel: 'HIGH',
      punctualityPercent: 90,
      avgTatkalSelloutMins: 6.3,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '16:00', departureTime: '16:00', distanceKm: 0, day: 1, platform: '8', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '01:20', departureTime: '01:28', distanceKm: 702, day: 2, platform: '1', status: 'CURRENT', delayMinutes: 5 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '07:20', departureTime: '07:25', distanceKm: 1091, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 4 },
        { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '16:15', departureTime: '16:15', distanceKm: 1668, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 22', availableSeats: 22, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2210, fareNote: 'AC Tatkal', depletionRatePerMin: 11.1, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 23', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 23, fareInr: 895, fareNote: 'Non-AC Tatkal', depletionRatePerMin: 19.4, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'GN', status: 'AVAILABLE', statusText: 'AVL 15', availableSeats: 15, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2640, fareNote: 'Standard 2A fare', depletionRatePerMin: 1.8, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12724',
        serviceType: 'PASSENGER',
        zone: 'SCR',
        currentLocation: 'Departing Bhopal Junction',
        previousStation: 'New Delhi (NDLS)',
        nextStation: 'Nagpur Junction (NGP)',
        delayMinutes: 5,
        estimatedArrival: '16:20 IST',
        progressPercent: 42,
        speedKmh: 108,
        lat: 23.2677,
        lng: 77.413,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '20607',
      trainName: 'Chennai - Mysuru Vande Bharat Express',
      serviceType: 'PASSENGER',
      category: 'Vande Bharat',
      zone: 'SR',
      sourceCode: 'MAS',
      sourceName: 'MGR Chennai Central',
      destinationCode: 'SBC',
      destinationName: 'KSR Bengaluru',
      departureTime: '05:50',
      arrivalTime: '10:20',
      durationMinutes: 270,
      durationLabel: '4h 30m',
      distanceKm: 362,
      runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 88,
      demandLevel: 'MODERATE',
      punctualityPercent: 98,
      avgTatkalSelloutMins: 14.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'MAS', stationName: 'MGR Chennai Central', arrivalTime: '05:50', departureTime: '05:50', distanceKm: 0, day: 1, platform: '4', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '07:23', departureTime: '07:25', distanceKm: 130, day: 1, platform: '2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '10:20', departureTime: '10:20', distanceKm: 362, day: 1, platform: '7', status: 'CURRENT', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 64', availableSeats: 64, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1295, fareNote: 'Tatkal Chair Car', depletionRatePerMin: 4.5, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 19', availableSeats: 19, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2310, fareNote: 'Executive Chair Car', depletionRatePerMin: 2.2, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '20607',
        serviceType: 'PASSENGER',
        zone: 'SR',
        currentLocation: 'Arriving KSR Bengaluru Outer',
        previousStation: 'Katpadi Junction (KPD)',
        nextStation: 'KSR Bengaluru (SBC)',
        delayMinutes: 0,
        estimatedArrival: '10:20 IST',
        progressPercent: 94,
        speedKmh: 112,
        lat: 12.9781,
        lng: 77.5715,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12262',
      trainName: 'Howrah - Mumbai CSMT Duronto Express',
      serviceType: 'PASSENGER',
      category: 'Duronto',
      zone: 'CR',
      sourceCode: 'HWH',
      sourceName: 'Howrah Junction',
      destinationCode: 'CSMT',
      destinationName: 'Chhatrapati Shivaji Maharaj Terminus',
      departureTime: '05:45',
      arrivalTime: '08:15',
      durationMinutes: 1590,
      durationLabel: '26h 30m',
      distanceKm: 1968,
      runningDays: ['Mon', 'Tue', 'Wed', 'Fri'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 90,
      demandLevel: 'HIGH',
      punctualityPercent: 89,
      avgTatkalSelloutMins: 5.8,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '05:45', departureTime: '05:45', distanceKm: 0, day: 1, platform: '12', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '20:25', departureTime: '20:30', distanceKm: 1131, day: 1, platform: '2', status: 'CURRENT', delayMinutes: 9 },
        { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrivalTime: '08:15', departureTime: '08:15', distanceKm: 1968, day: 2, platform: '16', status: 'UPCOMING', delayMinutes: 6 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'RAC', statusText: 'RAC 19', availableSeats: 0, racNumber: 19, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 2790, fareNote: 'Dynamic Duronto Tatkal', depletionRatePerMin: 13.4, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 7', availableSeats: 7, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3820, fareNote: 'Dynamic Duronto Tatkal', depletionRatePerMin: 6.7, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '1A', quota: 'TQ', status: 'NOT AVAILABLE', statusText: 'NOT AVAILABLE', availableSeats: 0, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: null, fareNote: 'Tatkal quota not allocated in 1A', depletionRatePerMin: 0, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12262',
        serviceType: 'PASSENGER',
        zone: 'CR',
        currentLocation: 'Passing Nagpur Corridor',
        previousStation: 'Howrah Junction (HWH)',
        nextStation: 'Mumbai CSMT (CSMT)',
        delayMinutes: 9,
        estimatedArrival: '08:24 IST',
        progressPercent: 58,
        speedKmh: 114,
        lat: 21.1525,
        lng: 79.0888,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12009',
      trainName: 'Mumbai Central - Ahmedabad Shatabdi',
      serviceType: 'PASSENGER',
      category: 'Shatabdi',
      zone: 'WR',
      sourceCode: 'MMCT',
      sourceName: 'Mumbai Central',
      destinationCode: 'ADI',
      destinationName: 'Ahmedabad Junction',
      departureTime: '06:20',
      arrivalTime: '12:40',
      durationMinutes: 380,
      durationLabel: '6h 20m',
      distanceKm: 493,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      classes: ['CC', 'EC'],
      popularityScore: 87,
      demandLevel: 'MODERATE',
      punctualityPercent: 95,
      avgTatkalSelloutMins: 16.0,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '06:20', departureTime: '06:20', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '11:02', departureTime: '11:07', distanceKm: 393, day: 1, platform: '3', status: 'CURRENT', delayMinutes: 2 },
        { stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrivalTime: '12:40', departureTime: '12:40', distanceKm: 493, day: 1, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 51', availableSeats: 51, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1480, fareNote: 'Shatabdi Tatkal CC', depletionRatePerMin: 5.1, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 15', availableSeats: 15, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2540, fareNote: 'Executive Anubhuti/EC', depletionRatePerMin: 2.3, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12009',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'At Vadodara Junction Platform 3',
        previousStation: 'Mumbai Central (MMCT)',
        nextStation: 'Ahmedabad Junction (ADI)',
        delayMinutes: 2,
        estimatedArrival: '12:42 IST',
        progressPercent: 80,
        speedKmh: 126,
        lat: 22.3108,
        lng: 73.1811,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12904',
      trainName: 'Golden Temple Mail (Alt Delhi-Mumbai)',
      serviceType: 'PASSENGER',
      category: 'Express',
      zone: 'WR',
      sourceCode: 'NZM',
      sourceName: 'Hazrat Nizamuddin',
      destinationCode: 'MMCT',
      destinationName: 'Mumbai Central',
      departureTime: '04:00',
      arrivalTime: '23:35',
      durationMinutes: 1175,
      durationLabel: '19h 35m',
      distanceKm: 1378,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', 'SL'],
      popularityScore: 84,
      demandLevel: 'MODERATE',
      punctualityPercent: 87,
      avgTatkalSelloutMins: 12.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '04:00', departureTime: '04:00', distanceKm: 0, day: 1, platform: '3', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '18:05', departureTime: '18:15', distanceKm: 985, day: 1, platform: '4', status: 'CURRENT', delayMinutes: 11 },
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '23:35', departureTime: '23:35', distanceKm: 1378, day: 1, platform: '2', status: 'UPCOMING', delayMinutes: 8 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 31', availableSeats: 31, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1995, fareNote: 'Mail/Express Tatkal', depletionRatePerMin: 6.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'RAC', statusText: 'RAC 14', availableSeats: 0, racNumber: 14, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 790, fareNote: 'Non-AC Tatkal SL', depletionRatePerMin: 12.8, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'GN', status: 'DATA UNAVAILABLE', statusText: 'DATA UNAVAILABLE', availableSeats: 0, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: null, fareNote: 'Charting window / upstream sync pending', depletionRatePerMin: 0, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12904',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'Passing Vadodara Yard',
        previousStation: 'Hazrat Nizamuddin (NZM)',
        nextStation: 'Mumbai Central (MMCT)',
        delayMinutes: 11,
        estimatedArrival: '23:46 IST',
        progressPercent: 72,
        speedKmh: 98,
        lat: 22.3108,
        lng: 73.1811,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12124',
      trainName: 'Deccan Queen Superfast Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'CR',
      sourceCode: 'PUNE',
      sourceName: 'Pune Junction',
      destinationCode: 'CSMT',
      destinationName: 'Chhatrapati Shivaji Maharaj Terminus',
      departureTime: '07:15',
      arrivalTime: '10:25',
      durationMinutes: 190,
      durationLabel: '3h 10m',
      distanceKm: 192,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', '2S'],
      popularityScore: 92,
      demandLevel: 'HIGH',
      punctualityPercent: 96,
      avgTatkalSelloutMins: 9.4,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'PUNE', stationName: 'Pune Junction', arrivalTime: '07:15', departureTime: '07:15', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrivalTime: '10:25', departureTime: '10:25', distanceKm: 192, day: 1, platform: '9', status: 'CURRENT', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 28', availableSeats: 28, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 495, fareNote: 'Tatkal Chair Car', depletionRatePerMin: 7.4, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2S', quota: 'GN', status: 'WAITLIST', statusText: 'GNWL 17', availableSeats: 0, racNumber: 0, waitlistType: 'GNWL', waitlistNumber: 17, fareInr: 120, fareNote: 'Second Sitting', depletionRatePerMin: 9.1, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12124',
        serviceType: 'PASSENGER',
        zone: 'CR',
        currentLocation: 'Descending Bhor Ghat (Kalyan Approach)',
        previousStation: 'Pune Junction (PUNE)',
        nextStation: 'Mumbai CSMT (CSMT)',
        delayMinutes: 0,
        estimatedArrival: '10:25 IST',
        progressPercent: 82,
        speedKmh: 96,
        lat: 18.75,
        lng: 73.34,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12951',
      trainName: 'Mumbai Central - New Delhi Tejas Rajdhani',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'WR',
      sourceCode: 'MMCT',
      sourceName: 'Mumbai Central',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '17:00',
      arrivalTime: '08:32',
      durationMinutes: 932,
      durationLabel: '15h 32m',
      distanceKm: 1386,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 97,
      demandLevel: 'CRITICAL',
      punctualityPercent: 95,
      avgTatkalSelloutMins: 4.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '17:00', departureTime: '17:00', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'ST', stationName: 'Surat', arrivalTime: '19:43', departureTime: '19:48', distanceKm: 263, day: 1, platform: '2', status: 'PASSED', delayMinutes: 2 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '21:08', departureTime: '21:18', distanceKm: 393, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 3 },
        { stationCode: 'RTM', stationName: 'Ratlam Junction', arrivalTime: '00:25', departureTime: '00:28', distanceKm: 654, day: 2, platform: '4', status: 'UPCOMING', delayMinutes: 2 },
        { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '03:15', departureTime: '03:25', distanceKm: 921, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:32', departureTime: '08:32', distanceKm: 1386, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 11', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 11, fareInr: 2890, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 16.5, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 12', availableSeats: 12, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 4050, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 8.4, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '1A', quota: 'GN', status: 'AVAILABLE', statusText: 'AVL 4', availableSeats: 4, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 4920, fareNote: 'Base Rajdhani fare', depletionRatePerMin: 1.8, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12951',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'Approaching Vadodara Junction',
        previousStation: 'Surat (ST)',
        nextStation: 'Ratlam Junction (RTM)',
        delayMinutes: 3,
        estimatedArrival: '08:35 IST',
        progressPercent: 29,
        speedKmh: 128,
        lat: 22.3108,
        lng: 73.1811,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12953',
      trainName: 'August Kranti Tejas Rajdhani (Up)',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'WR',
      sourceCode: 'MMCT',
      sourceName: 'Mumbai Central',
      destinationCode: 'NZM',
      destinationName: 'Hazrat Nizamuddin',
      departureTime: '17:10',
      arrivalTime: '09:43',
      durationMinutes: 993,
      durationLabel: '16h 33m',
      distanceKm: 1378,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 90,
      demandLevel: 'HIGH',
      punctualityPercent: 92,
      avgTatkalSelloutMins: 8.1,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '17:10', departureTime: '17:10', distanceKm: 0, day: 1, platform: '4', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'ST', stationName: 'Surat', arrivalTime: '20:15', departureTime: '20:20', distanceKm: 263, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 4 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '21:44', departureTime: '21:54', distanceKm: 393, day: 1, platform: '2', status: 'UPCOMING', delayMinutes: 3 },
        { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '04:05', departureTime: '04:15', distanceKm: 920, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 2 },
        { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '09:43', departureTime: '09:43', distanceKm: 1378, day: 2, platform: '7', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 21', availableSeats: 21, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2860, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 9.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 16', availableSeats: 16, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3980, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 4.8, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12953',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'Passing Surat Outer',
        previousStation: 'Mumbai Central (MMCT)',
        nextStation: 'Vadodara Junction (BRC)',
        delayMinutes: 4,
        estimatedArrival: '09:47 IST',
        progressPercent: 19,
        speedKmh: 118,
        lat: 21.2049,
        lng: 72.8411,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12301',
      trainName: 'Howrah - New Delhi Rajdhani Express',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'ER',
      sourceCode: 'HWH',
      sourceName: 'Howrah Junction',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '16:50',
      arrivalTime: '10:05',
      durationMinutes: 1035,
      durationLabel: '17h 15m',
      distanceKm: 1451,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 94,
      demandLevel: 'CRITICAL',
      punctualityPercent: 92,
      avgTatkalSelloutMins: 5.4,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '16:50', departureTime: '16:50', distanceKm: 0, day: 1, platform: '9', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '19:55', departureTime: '20:00', distanceKm: 263, day: 1, platform: '2', status: 'PASSED', delayMinutes: 3 },
        { stationCode: 'DDU', stationName: 'Pt. DD Upadhyaya Jn', arrivalTime: '00:50', departureTime: '01:00', distanceKm: 664, day: 2, platform: '6', status: 'CURRENT', delayMinutes: 6 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '02:43', departureTime: '02:45', distanceKm: 816, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 5 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '04:50', departureTime: '04:55', distanceKm: 1011, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 4 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '10:05', departureTime: '10:05', distanceKm: 1451, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 2 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 16', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 16, fareInr: 2945, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 17.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 6', availableSeats: 6, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 4180, fareNote: 'Dynamic Tatkal estimate', depletionRatePerMin: 9.8, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12301',
        serviceType: 'PASSENGER',
        zone: 'ER',
        currentLocation: 'Passing Pt. DD Upadhyaya Yard',
        previousStation: 'Dhanbad Junction (DHN)',
        nextStation: 'Prayagraj Junction (PRYJ)',
        delayMinutes: 6,
        estimatedArrival: '10:11 IST',
        progressPercent: 46,
        speedKmh: 120,
        lat: 25.2804,
        lng: 83.1187,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12627',
      trainName: 'Karnataka Express (Up)',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'SR',
      sourceCode: 'SBC',
      sourceName: 'KSR Bengaluru',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '19:20',
      arrivalTime: '09:00',
      durationMinutes: 2260,
      durationLabel: '37h 40m',
      distanceKm: 2406,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', '3E', 'SL'],
      popularityScore: 92,
      demandLevel: 'HIGH',
      punctualityPercent: 88,
      avgTatkalSelloutMins: 5.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '19:20', departureTime: '19:20', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '07:10', departureTime: '07:20', distanceKm: 738, day: 2, platform: '4', status: 'PASSED', delayMinutes: 8 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '16:15', departureTime: '16:20', distanceKm: 1315, day: 2, platform: '1', status: 'CURRENT', delayMinutes: 10 },
        { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '22:15', departureTime: '22:25', distanceKm: 1704, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 7 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '09:00', departureTime: '09:00', distanceKm: 2406, day: 3, platform: '5', status: 'UPCOMING', delayMinutes: 5 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 14', availableSeats: 14, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2560, fareNote: 'AC Tatkal', depletionRatePerMin: 12.1, lastUpdated: ts, freshnessSeconds: 6, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 29', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 29, fareInr: 1045, fareNote: 'Non-AC Tatkal', depletionRatePerMin: 21.3, lastUpdated: ts, freshnessSeconds: 6, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12627',
        serviceType: 'PASSENGER',
        zone: 'SR',
        currentLocation: 'Departing Nagpur Junction',
        previousStation: 'Secunderabad Junction (SC)',
        nextStation: 'Bhopal Junction (BPL)',
        delayMinutes: 10,
        estimatedArrival: '09:10 IST',
        progressPercent: 55,
        speedKmh: 102,
        lat: 21.1525,
        lng: 79.0888,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12010',
      trainName: 'Ahmedabad - Mumbai Central Shatabdi',
      serviceType: 'PASSENGER',
      category: 'Shatabdi',
      zone: 'WR',
      sourceCode: 'ADI',
      sourceName: 'Ahmedabad Junction',
      destinationCode: 'MMCT',
      destinationName: 'Mumbai Central',
      departureTime: '15:10',
      arrivalTime: '21:35',
      durationMinutes: 385,
      durationLabel: '6h 25m',
      distanceKm: 493,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      classes: ['CC', 'EC'],
      popularityScore: 86,
      demandLevel: 'MODERATE',
      punctualityPercent: 95,
      avgTatkalSelloutMins: 15.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrivalTime: '15:10', departureTime: '15:10', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '16:33', departureTime: '16:38', distanceKm: 100, day: 1, platform: '2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'ST', stationName: 'Surat', arrivalTime: '18:10', departureTime: '18:15', distanceKm: 230, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 2 },
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '21:35', departureTime: '21:35', distanceKm: 493, day: 1, platform: '2', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 44', availableSeats: 44, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1480, fareNote: 'Shatabdi Tatkal CC', depletionRatePerMin: 4.9, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 13', availableSeats: 13, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2540, fareNote: 'Executive Chair Car', depletionRatePerMin: 2.0, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12010',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'At Surat Platform 1',
        previousStation: 'Vadodara Junction (BRC)',
        nextStation: 'Mumbai Central (MMCT)',
        delayMinutes: 2,
        estimatedArrival: '21:37 IST',
        progressPercent: 48,
        speedKmh: 122,
        lat: 21.2049,
        lng: 72.8411,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12123',
      trainName: 'Mumbai CSMT - Pune Deccan Queen',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'CR',
      sourceCode: 'CSMT',
      sourceName: 'Chhatrapati Shivaji Maharaj Terminus',
      destinationCode: 'PUNE',
      destinationName: 'Pune Junction',
      departureTime: '17:10',
      arrivalTime: '20:25',
      durationMinutes: 195,
      durationLabel: '3h 15m',
      distanceKm: 192,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', '2S'],
      popularityScore: 91,
      demandLevel: 'HIGH',
      punctualityPercent: 96,
      avgTatkalSelloutMins: 9.8,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrivalTime: '17:10', departureTime: '17:10', distanceKm: 0, day: 1, platform: '9', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'PUNE', stationName: 'Pune Junction', arrivalTime: '20:25', departureTime: '20:25', distanceKm: 192, day: 1, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 33', availableSeats: 33, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 495, fareNote: 'Tatkal Chair Car', depletionRatePerMin: 6.8, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2S', quota: 'GN', status: 'RAC', statusText: 'RAC 9', availableSeats: 0, racNumber: 9, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 120, fareNote: 'Second Sitting', depletionRatePerMin: 8.2, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12123',
        serviceType: 'PASSENGER',
        zone: 'CR',
        currentLocation: 'Climbing Bhor Ghat Section',
        previousStation: 'Mumbai CSMT (CSMT)',
        nextStation: 'Pune Junction (PUNE)',
        delayMinutes: 0,
        estimatedArrival: '20:25 IST',
        progressPercent: 52,
        speedKmh: 92,
        lat: 18.75,
        lng: 73.34,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '20608',
      trainName: 'Bengaluru - Chennai Vande Bharat Express',
      serviceType: 'PASSENGER',
      category: 'Vande Bharat',
      zone: 'SR',
      sourceCode: 'SBC',
      sourceName: 'KSR Bengaluru',
      destinationCode: 'MAS',
      destinationName: 'MGR Chennai Central',
      departureTime: '14:50',
      arrivalTime: '19:20',
      durationMinutes: 270,
      durationLabel: '4h 30m',
      distanceKm: 362,
      runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 89,
      demandLevel: 'MODERATE',
      punctualityPercent: 98,
      avgTatkalSelloutMins: 13.8,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '14:50', departureTime: '14:50', distanceKm: 0, day: 1, platform: '7', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '17:33', departureTime: '17:35', distanceKm: 232, day: 1, platform: '2', status: 'CURRENT', delayMinutes: 0 },
        { stationCode: 'MAS', stationName: 'MGR Chennai Central', arrivalTime: '19:20', departureTime: '19:20', distanceKm: 362, day: 1, platform: '4', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 58', availableSeats: 58, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1295, fareNote: 'Tatkal Chair Car', depletionRatePerMin: 4.2, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 17', availableSeats: 17, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2310, fareNote: 'Executive Chair Car', depletionRatePerMin: 1.9, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '20608',
        serviceType: 'PASSENGER',
        zone: 'SR',
        currentLocation: 'Passing Katpadi Junction',
        previousStation: 'KSR Bengaluru (SBC)',
        nextStation: 'MGR Chennai Central (MAS)',
        delayMinutes: 0,
        estimatedArrival: '19:20 IST',
        progressPercent: 64,
        speedKmh: 118,
        lat: 12.9718,
        lng: 79.1381,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12004',
      trainName: 'New Delhi - Lucknow Swarna Shatabdi Express',
      serviceType: 'PASSENGER',
      category: 'Shatabdi',
      zone: 'NR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'LKO',
      destinationName: 'Lucknow Charbagh NR',
      departureTime: '06:10',
      arrivalTime: '12:50',
      durationMinutes: 400,
      durationLabel: '6h 40m',
      distanceKm: 513,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 95,
      demandLevel: 'HIGH',
      punctualityPercent: 94,
      avgTatkalSelloutMins: 7.6,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:10', departureTime: '06:10', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '11:20', departureTime: '11:25', distanceKm: 440, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 2 },
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '12:50', departureTime: '12:50', distanceKm: 513, day: 1, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 36', availableSeats: 36, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1580, fareNote: 'Shatabdi Tatkal CC', depletionRatePerMin: 7.4, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 9', availableSeats: 9, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2690, fareNote: 'Executive Chair Car', depletionRatePerMin: 2.8, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12004',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Departing Kanpur Central (NR)',
        previousStation: 'New Delhi (NDLS)',
        nextStation: 'Lucknow Charbagh NR (LKO)',
        delayMinutes: 2,
        estimatedArrival: '12:52 IST',
        progressPercent: 84,
        speedKmh: 122,
        lat: 26.55,
        lng: 80.52,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12003',
      trainName: 'Lucknow - New Delhi Swarna Shatabdi Express',
      serviceType: 'PASSENGER',
      category: 'Shatabdi',
      zone: 'NR',
      sourceCode: 'LKO',
      sourceName: 'Lucknow Charbagh NR',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '15:30',
      arrivalTime: '22:25',
      durationMinutes: 415,
      durationLabel: '6h 55m',
      distanceKm: 513,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 94,
      demandLevel: 'HIGH',
      punctualityPercent: 93,
      avgTatkalSelloutMins: 8.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '15:30', departureTime: '15:30', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '16:50', departureTime: '16:55', distanceKm: 73, day: 1, platform: '2', status: 'CURRENT', delayMinutes: 3 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '22:25', departureTime: '22:25', distanceKm: 513, day: 1, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 29', availableSeats: 29, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1580, fareNote: 'Shatabdi Tatkal CC', depletionRatePerMin: 6.9, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 11', availableSeats: 11, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2690, fareNote: 'Executive Chair Car', depletionRatePerMin: 2.5, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12003',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'At Kanpur Central Platform 2',
        previousStation: 'Lucknow Charbagh NR (LKO)',
        nextStation: 'New Delhi (NDLS)',
        delayMinutes: 3,
        estimatedArrival: '22:28 IST',
        progressPercent: 18,
        speedKmh: 116,
        lat: 26.4539,
        lng: 80.3511,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '82502',
      trainName: 'New Delhi - Lucknow IRCTC Tejas Express',
      serviceType: 'PASSENGER',
      category: 'Vande Bharat',
      zone: 'NR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'LKO',
      destinationName: 'Lucknow Charbagh NR',
      departureTime: '15:35',
      arrivalTime: '22:05',
      durationMinutes: 390,
      durationLabel: '6h 30m',
      distanceKm: 513,
      runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 93,
      demandLevel: 'HIGH',
      punctualityPercent: 97,
      avgTatkalSelloutMins: 9.1,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '15:35', departureTime: '15:35', distanceKm: 0, day: 1, platform: '16', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '20:35', departureTime: '20:40', distanceKm: 440, day: 1, platform: '4', status: 'UPCOMING', delayMinutes: 0 },
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '22:05', departureTime: '22:05', distanceKm: 513, day: 1, platform: '2', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 48', availableSeats: 48, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1710, fareNote: 'Tejas Dynamic Chair Car', depletionRatePerMin: 5.8, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 14', availableSeats: 14, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2840, fareNote: 'Tejas Executive Class', depletionRatePerMin: 2.1, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '82502',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Cruising Aligarh–Tundla High-Speed Section',
        previousStation: 'New Delhi (NDLS)',
        nextStation: 'Kanpur Central (CNB)',
        delayMinutes: 0,
        estimatedArrival: '22:05 IST',
        progressPercent: 49,
        speedKmh: 128,
        lat: 27.21,
        lng: 78.92,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '82501',
      trainName: 'Lucknow - New Delhi IRCTC Tejas Express',
      serviceType: 'PASSENGER',
      category: 'Vande Bharat',
      zone: 'NR',
      sourceCode: 'LKO',
      sourceName: 'Lucknow Charbagh NR',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '06:10',
      arrivalTime: '12:25',
      durationMinutes: 375,
      durationLabel: '6h 15m',
      distanceKm: 513,
      runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 92,
      demandLevel: 'HIGH',
      punctualityPercent: 97,
      avgTatkalSelloutMins: 9.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '06:10', departureTime: '06:10', distanceKm: 0, day: 1, platform: '2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '07:20', departureTime: '07:25', distanceKm: 73, day: 1, platform: '3', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '12:25', departureTime: '12:25', distanceKm: 513, day: 1, platform: '16', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 41', availableSeats: 41, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1710, fareNote: 'Tejas Dynamic Chair Car', depletionRatePerMin: 5.4, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 12', availableSeats: 12, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2840, fareNote: 'Tejas Executive Class', depletionRatePerMin: 1.9, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '82501',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Passing Etawah Mainline',
        previousStation: 'Kanpur Central (CNB)',
        nextStation: 'New Delhi (NDLS)',
        delayMinutes: 0,
        estimatedArrival: '12:25 IST',
        progressPercent: 58,
        speedKmh: 129,
        lat: 26.78,
        lng: 79.02,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12430',
      trainName: 'New Delhi - Lucknow AC Superfast Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'NR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'LKO',
      destinationName: 'Lucknow Charbagh NR',
      departureTime: '23:25',
      arrivalTime: '07:25',
      durationMinutes: 480,
      durationLabel: '8h 00m',
      distanceKm: 493,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 91,
      demandLevel: 'HIGH',
      punctualityPercent: 92,
      avgTatkalSelloutMins: 6.4,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '23:25', departureTime: '23:25', distanceKm: 0, day: 1, platform: '7', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '07:25', departureTime: '07:25', distanceKm: 493, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 9', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 9, fareInr: 1320, fareNote: 'Overnight AC Superfast Tatkal', depletionRatePerMin: 13.6, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 11', availableSeats: 11, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1840, fareNote: 'AC 2-Tier Tatkal', depletionRatePerMin: 6.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12430',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Passing Bareilly Outer (NR)',
        previousStation: 'New Delhi (NDLS)',
        nextStation: 'Lucknow Charbagh NR (LKO)',
        delayMinutes: 4,
        estimatedArrival: '07:29 IST',
        progressPercent: 52,
        speedKmh: 108,
        lat: 28.36,
        lng: 79.43,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12429',
      trainName: 'Lucknow - New Delhi AC Superfast Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'NR',
      sourceCode: 'LKO',
      sourceName: 'Lucknow Charbagh NR',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '23:30',
      arrivalTime: '07:30',
      durationMinutes: 480,
      durationLabel: '8h 00m',
      distanceKm: 493,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 90,
      demandLevel: 'HIGH',
      punctualityPercent: 91,
      avgTatkalSelloutMins: 6.9,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '23:30', departureTime: '23:30', distanceKm: 0, day: 1, platform: '3', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '07:30', departureTime: '07:30', distanceKm: 493, day: 2, platform: '7', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'RAC', statusText: 'RAC 6', availableSeats: 0, racNumber: 6, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 1320, fareNote: 'Overnight AC Superfast Tatkal', depletionRatePerMin: 11.4, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 14', availableSeats: 14, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1840, fareNote: 'AC 2-Tier Tatkal', depletionRatePerMin: 5.5, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12429',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Passing Moradabad Section',
        previousStation: 'Lucknow Charbagh NR (LKO)',
        nextStation: 'New Delhi (NDLS)',
        delayMinutes: 5,
        estimatedArrival: '07:35 IST',
        progressPercent: 64,
        speedKmh: 106,
        lat: 28.83,
        lng: 78.77,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12584',
      trainName: 'Anand Vihar - Lucknow AC Double Decker',
      serviceType: 'PASSENGER',
      category: 'Express',
      zone: 'NR',
      sourceCode: 'ANVT',
      sourceName: 'Anand Vihar Terminal',
      destinationCode: 'LKO',
      destinationName: 'Lucknow Charbagh NR',
      departureTime: '14:05',
      arrivalTime: '22:30',
      durationMinutes: 505,
      durationLabel: '8h 25m',
      distanceKm: 478,
      runningDays: ['Tue', 'Thu', 'Fri', 'Sun'],
      classes: ['CC'],
      popularityScore: 84,
      demandLevel: 'MODERATE',
      punctualityPercent: 90,
      avgTatkalSelloutMins: 14.0,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'ANVT', stationName: 'Anand Vihar Terminal', arrivalTime: '14:05', departureTime: '14:05', distanceKm: 0, day: 1, platform: '3', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '22:30', departureTime: '22:30', distanceKm: 478, day: 1, platform: '4', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 74', availableSeats: 74, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 840, fareNote: 'Double Decker AC Chair Car', depletionRatePerMin: 3.4, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12584',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Passing Rampur Outer',
        previousStation: 'Anand Vihar Terminal (ANVT)',
        nextStation: 'Lucknow Charbagh NR (LKO)',
        delayMinutes: 4,
        estimatedArrival: '22:34 IST',
        progressPercent: 45,
        speedKmh: 98,
        lat: 28.79,
        lng: 79.02,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12583',
      trainName: 'Lucknow - Anand Vihar AC Double Decker',
      serviceType: 'PASSENGER',
      category: 'Express',
      zone: 'NR',
      sourceCode: 'LKO',
      sourceName: 'Lucknow Charbagh NR',
      destinationCode: 'ANVT',
      destinationName: 'Anand Vihar Terminal',
      departureTime: '04:55',
      arrivalTime: '12:55',
      durationMinutes: 480,
      durationLabel: '8h 00m',
      distanceKm: 478,
      runningDays: ['Tue', 'Thu', 'Fri', 'Sun'],
      classes: ['CC'],
      popularityScore: 83,
      demandLevel: 'MODERATE',
      punctualityPercent: 91,
      avgTatkalSelloutMins: 15.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'LKO', stationName: 'Lucknow Charbagh NR', arrivalTime: '04:55', departureTime: '04:55', distanceKm: 0, day: 1, platform: '4', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'ANVT', stationName: 'Anand Vihar Terminal', arrivalTime: '12:55', departureTime: '12:55', distanceKm: 478, day: 1, platform: '3', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 68', availableSeats: 68, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 840, fareNote: 'Double Decker AC Chair Car', depletionRatePerMin: 3.1, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12583',
        serviceType: 'PASSENGER',
        zone: 'NR',
        currentLocation: 'Passing Ghaziabad Approach',
        previousStation: 'Lucknow Charbagh NR (LKO)',
        nextStation: 'Anand Vihar Terminal (ANVT)',
        delayMinutes: 2,
        estimatedArrival: '12:57 IST',
        progressPercent: 86,
        speedKmh: 96,
        lat: 28.66,
        lng: 77.42,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12310',
      trainName: 'New Delhi - Patna Tejas Rajdhani Express',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'ER',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'PNBE',
      destinationName: 'Patna Junction',
      departureTime: '17:10',
      arrivalTime: '04:40',
      durationMinutes: 690,
      durationLabel: '11h 30m',
      distanceKm: 1001,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 95,
      demandLevel: 'CRITICAL',
      punctualityPercent: 93,
      avgTatkalSelloutMins: 4.9,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '17:10', departureTime: '17:10', distanceKm: 0, day: 1, platform: '14', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:52', departureTime: '21:57', distanceKm: 440, day: 1, platform: '4', status: 'PASSED', delayMinutes: 3 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '00:02', departureTime: '00:04', distanceKm: 635, day: 2, platform: '1', status: 'CURRENT', delayMinutes: 4 },
        { stationCode: 'DDU', stationName: 'Pt. DD Upadhyaya Jn', arrivalTime: '02:02', departureTime: '02:12', distanceKm: 787, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 3 },
        { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '04:40', departureTime: '04:40', distanceKm: 1001, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 18', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 18, fareInr: 2390, fareNote: 'Tejas Rajdhani Tatkal', depletionRatePerMin: 17.5, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 8', availableSeats: 8, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3320, fareNote: 'Tejas Rajdhani Tatkal', depletionRatePerMin: 8.6, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12310',
        serviceType: 'PASSENGER',
        zone: 'ER',
        currentLocation: 'At Prayagraj Junction Platform 1',
        previousStation: 'Kanpur Central (CNB)',
        nextStation: 'Pt. DD Upadhyaya Jn (DDU)',
        delayMinutes: 4,
        estimatedArrival: '04:44 IST',
        progressPercent: 63,
        speedKmh: 124,
        lat: 25.4461,
        lng: 81.8303,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12309',
      trainName: 'Patna - New Delhi Tejas Rajdhani Express',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'ER',
      sourceCode: 'PNBE',
      sourceName: 'Patna Junction',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '19:35',
      arrivalTime: '07:40',
      durationMinutes: 725,
      durationLabel: '12h 05m',
      distanceKm: 1001,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 94,
      demandLevel: 'CRITICAL',
      punctualityPercent: 92,
      avgTatkalSelloutMins: 5.3,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '19:35', departureTime: '19:35', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'DDU', stationName: 'Pt. DD Upadhyaya Jn', arrivalTime: '22:12', departureTime: '22:22', distanceKm: 214, day: 1, platform: '6', status: 'PASSED', delayMinutes: 2 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '00:10', departureTime: '00:12', distanceKm: 366, day: 2, platform: '2', status: 'CURRENT', delayMinutes: 4 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '02:15', departureTime: '02:20', distanceKm: 561, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 3 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '07:40', departureTime: '07:40', distanceKm: 1001, day: 2, platform: '14', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 11', availableSeats: 11, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2390, fareNote: 'Tejas Rajdhani Tatkal', depletionRatePerMin: 14.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 13', availableSeats: 13, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3320, fareNote: 'Tejas Rajdhani Tatkal', depletionRatePerMin: 7.4, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12309',
        serviceType: 'PASSENGER',
        zone: 'ER',
        currentLocation: 'Departing Prayagraj Junction',
        previousStation: 'Pt. DD Upadhyaya Jn (DDU)',
        nextStation: 'Kanpur Central (CNB)',
        delayMinutes: 4,
        estimatedArrival: '07:44 IST',
        progressPercent: 37,
        speedKmh: 121,
        lat: 25.4461,
        lng: 81.8303,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12015',
      trainName: 'New Delhi - Jaipur Ajmer Shatabdi',
      serviceType: 'PASSENGER',
      category: 'Shatabdi',
      zone: 'NWR',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'JP',
      destinationName: 'Jaipur Junction',
      departureTime: '06:10',
      arrivalTime: '10:40',
      durationMinutes: 270,
      durationLabel: '4h 30m',
      distanceKm: 308,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 91,
      demandLevel: 'HIGH',
      punctualityPercent: 95,
      avgTatkalSelloutMins: 10.4,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:10', departureTime: '06:10', distanceKm: 0, day: 1, platform: '2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'JP', stationName: 'Jaipur Junction', arrivalTime: '10:40', departureTime: '10:40', distanceKm: 308, day: 1, platform: '1', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 52', availableSeats: 52, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1120, fareNote: 'Shatabdi Chair Car', depletionRatePerMin: 5.2, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'EC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 16', availableSeats: 16, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1980, fareNote: 'Executive Chair Car', depletionRatePerMin: 1.9, lastUpdated: ts, freshnessSeconds: 3, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12015',
        serviceType: 'PASSENGER',
        zone: 'NWR',
        currentLocation: 'Passing Alwar Corridor',
        previousStation: 'New Delhi (NDLS)',
        nextStation: 'Jaipur Junction (JP)',
        delayMinutes: 0,
        estimatedArrival: '10:40 IST',
        progressPercent: 56,
        speedKmh: 110,
        lat: 27.55,
        lng: 76.61,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12016',
      trainName: 'Jaipur - New Delhi Shatabdi Express',
      serviceType: 'PASSENGER',
      category: 'Shatabdi',
      zone: 'NWR',
      sourceCode: 'JP',
      sourceName: 'Jaipur Junction',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '17:50',
      arrivalTime: '22:40',
      durationMinutes: 290,
      durationLabel: '4h 50m',
      distanceKm: 308,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['CC', 'EC'],
      popularityScore: 90,
      demandLevel: 'HIGH',
      punctualityPercent: 94,
      avgTatkalSelloutMins: 11.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'JP', stationName: 'Jaipur Junction', arrivalTime: '17:50', departureTime: '17:50', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '22:40', departureTime: '22:40', distanceKm: 308, day: 1, platform: '2', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: 'CC', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 46', availableSeats: 46, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1120, fareNote: 'Shatabdi Chair Car', depletionRatePerMin: 4.8, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12016',
        serviceType: 'PASSENGER',
        zone: 'NWR',
        currentLocation: 'Approaching Rewari Junction',
        previousStation: 'Jaipur Junction (JP)',
        nextStation: 'New Delhi (NDLS)',
        delayMinutes: 2,
        estimatedArrival: '22:42 IST',
        progressPercent: 72,
        speedKmh: 108,
        lat: 28.19,
        lng: 76.62,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12956',
      trainName: 'Jaipur - Mumbai Central Superfast Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'NWR',
      sourceCode: 'JP',
      sourceName: 'Jaipur Junction',
      destinationCode: 'MMCT',
      destinationName: 'Mumbai Central',
      departureTime: '14:00',
      arrivalTime: '06:55',
      durationMinutes: 1015,
      durationLabel: '16h 55m',
      distanceKm: 1159,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', 'SL'],
      popularityScore: 88,
      demandLevel: 'HIGH',
      punctualityPercent: 90,
      avgTatkalSelloutMins: 8.4,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'JP', stationName: 'Jaipur Junction', arrivalTime: '14:00', departureTime: '14:00', distanceKm: 0, day: 1, platform: '4', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '17:15', departureTime: '17:25', distanceKm: 239, day: 1, platform: '1', status: 'PASSED', delayMinutes: 3 },
        { stationCode: 'RTM', stationName: 'Ratlam Junction', arrivalTime: '21:15', departureTime: '21:25', distanceKm: 506, day: 1, platform: '5', status: 'CURRENT', delayMinutes: 5 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '01:05', departureTime: '01:15', distanceKm: 767, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 4 },
        { stationCode: 'ST', stationName: 'Surat', arrivalTime: '02:55', departureTime: '03:00', distanceKm: 896, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 2 },
        { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '06:55', departureTime: '06:55', distanceKm: 1159, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 19', availableSeats: 19, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1890, fareNote: 'AC 3-Tier Tatkal', depletionRatePerMin: 8.5, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 14', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 14, fareInr: 720, fareNote: 'Sleeper Tatkal', depletionRatePerMin: 16.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12956',
        serviceType: 'PASSENGER',
        zone: 'NWR',
        currentLocation: 'At Ratlam Junction Platform 5',
        previousStation: 'Kota Junction (KOTA)',
        nextStation: 'Vadodara Junction (BRC)',
        delayMinutes: 5,
        estimatedArrival: '07:00 IST',
        progressPercent: 44,
        speedKmh: 104,
        lat: 23.3315,
        lng: 75.0367,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12723',
      trainName: 'Telangana Express (Up)',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'SCR',
      sourceCode: 'SC',
      sourceName: 'Secunderabad Junction',
      destinationCode: 'NDLS',
      destinationName: 'New Delhi',
      departureTime: '06:25',
      arrivalTime: '07:40',
      durationMinutes: 1515,
      durationLabel: '25h 15m',
      distanceKm: 1668,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', 'SL'],
      popularityScore: 89,
      demandLevel: 'HIGH',
      punctualityPercent: 90,
      avgTatkalSelloutMins: 6.7,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '06:25', departureTime: '06:25', distanceKm: 0, day: 1, platform: '1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '15:10', departureTime: '15:15', distanceKm: 577, day: 1, platform: '2', status: 'CURRENT', delayMinutes: 4 },
        { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '21:15', departureTime: '21:25', distanceKm: 966, day: 1, platform: '1', status: 'UPCOMING', delayMinutes: 3 },
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '07:40', departureTime: '07:40', distanceKm: 1668, day: 2, platform: '8', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 17', availableSeats: 17, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2210, fareNote: 'AC Tatkal', depletionRatePerMin: 10.4, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'RAC', statusText: 'RAC 12', availableSeats: 0, racNumber: 12, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 895, fareNote: 'Non-AC Tatkal', depletionRatePerMin: 15.8, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12723',
        serviceType: 'PASSENGER',
        zone: 'SCR',
        currentLocation: 'At Nagpur Junction Platform 2',
        previousStation: 'Secunderabad Junction (SC)',
        nextStation: 'Bhopal Junction (BPL)',
        delayMinutes: 4,
        estimatedArrival: '07:44 IST',
        progressPercent: 35,
        speedKmh: 109,
        lat: 21.1525,
        lng: 79.0888,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12261',
      trainName: 'Mumbai CSMT - Howrah Duronto Express',
      serviceType: 'PASSENGER',
      category: 'Duronto',
      zone: 'CR',
      sourceCode: 'CSMT',
      sourceName: 'Chhatrapati Shivaji Maharaj Terminus',
      destinationCode: 'HWH',
      destinationName: 'Howrah Junction',
      departureTime: '17:15',
      arrivalTime: '20:15',
      durationMinutes: 1620,
      durationLabel: '27h 00m',
      distanceKm: 1968,
      runningDays: ['Tue', 'Wed', 'Thu', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 89,
      demandLevel: 'HIGH',
      punctualityPercent: 90,
      avgTatkalSelloutMins: 6.2,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrivalTime: '17:15', departureTime: '17:15', distanceKm: 0, day: 1, platform: '16', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '04:20', departureTime: '04:25', distanceKm: 837, day: 2, platform: '1', status: 'CURRENT', delayMinutes: 6 },
        { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '20:15', departureTime: '20:15', distanceKm: 1968, day: 2, platform: '12', status: 'UPCOMING', delayMinutes: 4 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 13', availableSeats: 13, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2790, fareNote: 'Duronto Tatkal', depletionRatePerMin: 11.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 9', availableSeats: 9, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3820, fareNote: 'Duronto Tatkal', depletionRatePerMin: 5.9, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12261',
        serviceType: 'PASSENGER',
        zone: 'CR',
        currentLocation: 'Passing Nagpur Outer',
        previousStation: 'Mumbai CSMT (CSMT)',
        nextStation: 'Howrah Junction (HWH)',
        delayMinutes: 6,
        estimatedArrival: '20:21 IST',
        progressPercent: 43,
        speedKmh: 112,
        lat: 21.1525,
        lng: 79.0888,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12314',
      trainName: 'New Delhi - Sealdah Rajdhani Express',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'ER',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'SDAH',
      destinationName: 'Sealdah',
      departureTime: '16:30',
      arrivalTime: '10:10',
      durationMinutes: 1060,
      durationLabel: '17h 40m',
      distanceKm: 1458,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 93,
      demandLevel: 'HIGH',
      punctualityPercent: 92,
      avgTatkalSelloutMins: 5.7,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '16:30', departureTime: '16:30', distanceKm: 0, day: 1, platform: '12', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:17', departureTime: '21:22', distanceKm: 440, day: 1, platform: '3', status: 'PASSED', delayMinutes: 4 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '23:30', departureTime: '23:32', distanceKm: 635, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 5 },
        { stationCode: 'DDU', stationName: 'Pt. DD Upadhyaya Jn', arrivalTime: '01:30', departureTime: '01:40', distanceKm: 787, day: 2, platform: '3', status: 'UPCOMING', delayMinutes: 4 },
        { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '06:10', departureTime: '06:15', distanceKm: 1188, day: 2, platform: '2', status: 'UPCOMING', delayMinutes: 3 },
        { stationCode: 'SDAH', stationName: 'Sealdah', arrivalTime: '10:10', departureTime: '10:10', distanceKm: 1458, day: 2, platform: '9A', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 10', availableSeats: 10, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2945, fareNote: 'Sealdah Rajdhani Tatkal', depletionRatePerMin: 15.1, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 12', availableSeats: 12, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 4180, fareNote: 'Sealdah Rajdhani Tatkal', depletionRatePerMin: 8.1, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12314',
        serviceType: 'PASSENGER',
        zone: 'ER',
        currentLocation: 'Passing Prayagraj Outer',
        previousStation: 'Kanpur Central (CNB)',
        nextStation: 'Pt. DD Upadhyaya Jn (DDU)',
        delayMinutes: 5,
        estimatedArrival: '10:15 IST',
        progressPercent: 44,
        speedKmh: 121,
        lat: 25.4461,
        lng: 81.8303,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '22692',
      trainName: 'Hazrat Nizamuddin - Bengaluru Rajdhani',
      serviceType: 'PASSENGER',
      category: 'Rajdhani',
      zone: 'SR',
      sourceCode: 'NZM',
      sourceName: 'Hazrat Nizamuddin',
      destinationCode: 'SBC',
      destinationName: 'KSR Bengaluru',
      departureTime: '19:50',
      arrivalTime: '05:20',
      durationMinutes: 2010,
      durationLabel: '33h 30m',
      distanceKm: 2294,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A'],
      popularityScore: 95,
      demandLevel: 'CRITICAL',
      punctualityPercent: 93,
      avgTatkalSelloutMins: 4.8,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '19:50', departureTime: '19:50', distanceKm: 0, day: 1, platform: '6', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '03:45', departureTime: '03:55', distanceKm: 695, day: 2, platform: '1', status: 'PASSED', delayMinutes: 3 },
        { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '09:15', departureTime: '09:20', distanceKm: 1084, day: 2, platform: '1', status: 'CURRENT', delayMinutes: 5 },
        { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '17:20', departureTime: '17:35', distanceKm: 1661, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 4 },
        { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '05:20', departureTime: '05:20', distanceKm: 2294, day: 3, platform: '8', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 15', availableSeats: 15, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 3420, fareNote: 'Rajdhani Tatkal 3A', depletionRatePerMin: 13.8, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
        { travelClass: '2A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 9', availableSeats: 9, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 4680, fareNote: 'Rajdhani Tatkal 2A', depletionRatePerMin: 6.5, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '22692',
        serviceType: 'PASSENGER',
        zone: 'SR',
        currentLocation: 'At Nagpur Junction Platform 1',
        previousStation: 'Bhopal Junction (BPL)',
        nextStation: 'Secunderabad Junction (SC)',
        delayMinutes: 5,
        estimatedArrival: '05:25 IST',
        progressPercent: 47,
        speedKmh: 118,
        lat: 21.1525,
        lng: 79.0888,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12141',
      trainName: 'Mumbai LTT - Patna Superfast Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'CR',
      sourceCode: 'LTT',
      sourceName: 'Lokmanya Tilak Terminus',
      destinationCode: 'PNBE',
      destinationName: 'Patna Junction',
      departureTime: '23:35',
      arrivalTime: '03:50',
      durationMinutes: 1695,
      durationLabel: '28h 15m',
      distanceKm: 1691,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['1A', '2A', '3A', 'SL'],
      popularityScore: 89,
      demandLevel: 'HIGH',
      punctualityPercent: 87,
      avgTatkalSelloutMins: 6.1,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'LTT', stationName: 'Lokmanya Tilak Terminus', arrivalTime: '23:35', departureTime: '23:35', distanceKm: 0, day: 1, platform: '4', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '12:20', departureTime: '12:30', distanceKm: 822, day: 2, platform: '3', status: 'CURRENT', delayMinutes: 9 },
        { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '22:15', departureTime: '22:25', distanceKm: 1325, day: 2, platform: '5', status: 'UPCOMING', delayMinutes: 7 },
        { stationCode: 'DDU', stationName: 'Pt. DD Upadhyaya Jn', arrivalTime: '00:55', departureTime: '01:05', distanceKm: 1477, day: 3, platform: '2', status: 'UPCOMING', delayMinutes: 5 },
        { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '03:50', departureTime: '03:50', distanceKm: 1691, day: 3, platform: '4', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'RAC', statusText: 'RAC 15', availableSeats: 0, racNumber: 15, waitlistType: 'RAC', waitlistNumber: 0, fareInr: 2150, fareNote: 'Superfast Tatkal 3A', depletionRatePerMin: 12.6, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 31', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 31, fareInr: 860, fareNote: 'Superfast Tatkal SL', depletionRatePerMin: 20.1, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12141',
        serviceType: 'PASSENGER',
        zone: 'CR',
        currentLocation: 'At Bhopal Junction Platform 3',
        previousStation: 'Lokmanya Tilak Terminus (LTT)',
        nextStation: 'Prayagraj Junction (PRYJ)',
        delayMinutes: 9,
        estimatedArrival: '03:59 IST',
        progressPercent: 49,
        speedKmh: 98,
        lat: 23.2677,
        lng: 77.413,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12909',
      trainName: 'Bandra Terminus - Hazrat Nizamuddin Garib Rath',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'WR',
      sourceCode: 'BDTS',
      sourceName: 'Bandra Terminus',
      destinationCode: 'NZM',
      destinationName: 'Hazrat Nizamuddin',
      departureTime: '17:30',
      arrivalTime: '10:15',
      durationMinutes: 1005,
      durationLabel: '16h 45m',
      distanceKm: 1366,
      runningDays: ['Tue', 'Thu', 'Sat'],
      classes: ['3A'],
      popularityScore: 87,
      demandLevel: 'HIGH',
      punctualityPercent: 91,
      avgTatkalSelloutMins: 7.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'BDTS', stationName: 'Bandra Terminus', arrivalTime: '17:30', departureTime: '17:30', distanceKm: 0, day: 1, platform: '2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'ST', stationName: 'Surat', arrivalTime: '20:45', departureTime: '20:50', distanceKm: 251, day: 1, platform: '1', status: 'PASSED', delayMinutes: 2 },
        { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '22:18', departureTime: '22:28', distanceKm: 381, day: 1, platform: '3', status: 'CURRENT', delayMinutes: 4 },
        { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '04:30', departureTime: '04:40', distanceKm: 908, day: 2, platform: '1', status: 'UPCOMING', delayMinutes: 2 },
        { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '10:15', departureTime: '10:15', distanceKm: 1366, day: 2, platform: '5', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 24', availableSeats: 24, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 1420, fareNote: 'Garib Rath 3A Tatkal', depletionRatePerMin: 9.4, lastUpdated: ts, freshnessSeconds: 4, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12909',
        serviceType: 'PASSENGER',
        zone: 'WR',
        currentLocation: 'At Vadodara Junction Platform 3',
        previousStation: 'Surat (ST)',
        nextStation: 'Kota Junction (KOTA)',
        delayMinutes: 4,
        estimatedArrival: '10:19 IST',
        progressPercent: 28,
        speedKmh: 114,
        lat: 22.3108,
        lng: 73.1811,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: '12864',
      trainName: 'SMVT Bengaluru - Howrah Superfast Express',
      serviceType: 'PASSENGER',
      category: 'Superfast',
      zone: 'SR',
      sourceCode: 'SMVB',
      sourceName: 'SMVT Bengaluru',
      destinationCode: 'HWH',
      destinationName: 'Howrah Junction',
      departureTime: '10:35',
      arrivalTime: '19:55',
      durationMinutes: 2000,
      durationLabel: '33h 20m',
      distanceKm: 1945,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: ['2A', '3A', 'SL'],
      popularityScore: 88,
      demandLevel: 'HIGH',
      punctualityPercent: 86,
      avgTatkalSelloutMins: 6.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'SMVB', stationName: 'SMVT Bengaluru', arrivalTime: '10:35', departureTime: '10:35', distanceKm: 0, day: 1, platform: '3', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '14:15', departureTime: '14:20', distanceKm: 224, day: 1, platform: '1', status: 'CURRENT', delayMinutes: 6 },
        { stationCode: 'MAS', stationName: 'MGR Chennai Central', arrivalTime: '16:35', departureTime: '16:45', distanceKm: 354, day: 1, platform: '6', status: 'UPCOMING', delayMinutes: 5 },
        { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '19:55', departureTime: '19:55', distanceKm: 1945, day: 2, platform: '21', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [
        { travelClass: '3A', quota: 'TQ', status: 'AVAILABLE', statusText: 'AVL 16', availableSeats: 16, racNumber: 0, waitlistType: 'NONE', waitlistNumber: 0, fareInr: 2340, fareNote: 'Superfast AC 3-Tier', depletionRatePerMin: 10.2, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
        { travelClass: 'SL', quota: 'TQ', status: 'WAITLIST', statusText: 'TQWL 27', availableSeats: 0, racNumber: 0, waitlistType: 'TQWL', waitlistNumber: 27, fareInr: 920, fareNote: 'Superfast Sleeper Tatkal', depletionRatePerMin: 18.6, lastUpdated: ts, freshnessSeconds: 5, provenance: ACTIVE_PROVENANCE },
      ],
      runningStatus: {
        trainNumber: '12864',
        serviceType: 'PASSENGER',
        zone: 'SR',
        currentLocation: 'At Katpadi Junction Platform 1',
        previousStation: 'SMVT Bengaluru (SMVB)',
        nextStation: 'MGR Chennai Central (MAS)',
        delayMinutes: 6,
        estimatedArrival: '20:01 IST',
        progressPercent: 12,
        speedKmh: 96,
        lat: 12.9718,
        lng: 79.1381,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: 'DFC901',
      trainName: 'WDFC Double-Stack Container Express 901',
      serviceType: 'FREIGHT',
      category: 'DFC Container',
      zone: 'WDFC',
      sourceCode: 'DADRI',
      sourceName: 'New Dadri DFC Hub',
      destinationCode: 'JNPT',
      destinationName: 'JNPT Port Freight Terminal',
      departureTime: '02:30',
      arrivalTime: '22:10',
      durationMinutes: 1180,
      durationLabel: '19h 40m',
      distanceKm: 1506,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: [],
      popularityScore: 86,
      demandLevel: 'HIGH',
      punctualityPercent: 95,
      avgTatkalSelloutMins: 0,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'DADRI', stationName: 'New Dadri DFC Hub', arrivalTime: '02:30', departureTime: '02:30', distanceKm: 0, day: 1, platform: 'DFC-1', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'JP', stationName: 'New Phulera / Jaipur DFC', arrivalTime: '08:15', departureTime: '08:25', distanceKm: 360, day: 1, platform: 'DFC-2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'ADI', stationName: 'New Sanand / Ahmedabad DFC', arrivalTime: '14:40', departureTime: '14:55', distanceKm: 920, day: 1, platform: 'DFC-3', status: 'CURRENT', delayMinutes: 4 },
        { stationCode: 'JNPT', stationName: 'JNPT Port Freight Terminal', arrivalTime: '22:10', departureTime: '22:10', distanceKm: 1506, day: 1, platform: 'PORT-4', status: 'UPCOMING', delayMinutes: 0 },
      ],
      availability: [],
      runningStatus: {
        trainNumber: 'DFC901',
        serviceType: 'FREIGHT',
        zone: 'WDFC',
        currentLocation: 'New Sanand DFC Crossing Loop (WDFC)',
        previousStation: 'New Phulera DFC (JP)',
        nextStation: 'JNPT Port Terminal (JNPT)',
        delayMinutes: 4,
        estimatedArrival: '22:14 IST',
        progressPercent: 62,
        speedKmh: 78,
        lat: 23.0268,
        lng: 72.6012,
        freightPayloadTons: 5240,
        freightCommodity: 'Double-Stack Intermodal Containers (180 TEU)',
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
    {
      trainNumber: 'DFC408',
      trainName: 'EDFC Coal & Steel Heavy Haul 408',
      serviceType: 'FREIGHT',
      category: 'Freight Express',
      zone: 'EDFC',
      sourceCode: 'DDU',
      sourceName: 'Pt. DD Upadhyaya Freight Hub',
      destinationCode: 'DADRI',
      destinationName: 'New Dadri DFC Hub',
      departureTime: '05:10',
      arrivalTime: '17:50',
      durationMinutes: 760,
      durationLabel: '12h 40m',
      distanceKm: 755,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: [],
      popularityScore: 81,
      demandLevel: 'MODERATE',
      punctualityPercent: 92,
      avgTatkalSelloutMins: 0,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        { stationCode: 'DDU', stationName: 'New DDU Freight Hub', arrivalTime: '05:10', departureTime: '05:10', distanceKm: 0, day: 1, platform: 'EDFC-2', status: 'PASSED', delayMinutes: 0 },
        { stationCode: 'CNB', stationName: 'New Bhaupur / Kanpur EDFC', arrivalTime: '11:20', departureTime: '11:30', distanceKm: 356, day: 1, platform: 'EDFC-1', status: 'CURRENT', delayMinutes: 7 },
        { stationCode: 'DADRI', stationName: 'New Dadri DFC Hub', arrivalTime: '17:50', departureTime: '17:50', distanceKm: 755, day: 1, platform: 'DFC-4', status: 'UPCOMING', delayMinutes: 5 },
      ],
      availability: [],
      runningStatus: {
        trainNumber: 'DFC408',
        serviceType: 'FREIGHT',
        zone: 'EDFC',
        currentLocation: 'New Bhaupur EDFC Automatic Block',
        previousStation: 'New DDU Freight Hub (DDU)',
        nextStation: 'New Dadri DFC Hub (DADRI)',
        delayMinutes: 7,
        estimatedArrival: '17:57 IST',
        progressPercent: 48,
        speedKmh: 68,
        lat: 26.4539,
        lng: 80.3511,
        freightPayloadTons: 6180,
        freightCommodity: 'Thermal Coal & Rolled Steel Coils (BOXNHL)',
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    },
  ];
}

export class RailDataEngine {
  private trains: TrainRecord[] = buildInitialTrains();
  private historyMap: Map<string, AvailabilityHistoryPoint[]> = new Map();
  private cacheHits = 1284;
  private cacheMisses = 94;
  private startTime = Date.now();
  private apiLogs: {
    id: string;
    timestamp: string;
    method: string;
    path: string;
    status: number;
    latencyMs: number;
    source: DataProvenance;
  }[] = [];

  constructor() {
    this.seedHistoricalSnapshots();
  }

  private seedHistoricalSnapshots() {
    const now = Date.now();
    for (const train of this.trains) {
      if (train.serviceType !== 'PASSENGER') continue;
      for (const av of train.availability) {
        const key = `${train.trainNumber}_${av.travelClass}_${av.quota}`;
        const points: AvailabilityHistoryPoint[] = [];
        for (let i = 11; i >= 0; i--) {
          const pointTime = new Date(now - i * 15 * 60 * 1000);
          const factor = i / 11;
          let seats = av.availableSeats;
          let wl = av.waitlistNumber;
          let rac = av.racNumber;
          if (av.status === 'AVAILABLE') {
            seats = Math.round(av.availableSeats + factor * 58);
          } else if (av.status === 'WAITLIST' || av.status === 'REGRET') {
            seats = Math.max(0, Math.round((factor - 0.55) * 44));
            wl = seats > 0 ? 0 : Math.max(1, Math.round(av.waitlistNumber * (1 - factor * 0.72)));
          } else if (av.status === 'RAC') {
            seats = Math.max(0, Math.round((factor - 0.65) * 30));
            rac = seats > 0 ? 0 : Math.max(1, Math.round(av.racNumber * (1 - factor * 0.5)));
          }
          points.push({
            timestamp: pointTime.toISOString(),
            label: pointTime.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            availableSeats: seats,
            waitlistNumber: wl,
            racNumber: rac,
            depletionVelocity: Number((av.depletionRatePerMin * (0.75 + factor * 0.5)).toFixed(1)),
            travelClass: av.travelClass,
            provenance: 'HISTORICAL',
          });
        }
        this.historyMap.set(key, points);
      }
    }
  }

  public recordApiLog(method: string, path: string, status: number, latencyMs: number, source: DataProvenance = ACTIVE_PROVENANCE) {
    this.apiLogs.unshift({
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowIso(),
      method,
      path,
      status,
      latencyMs,
      source,
    });
    if (this.apiLogs.length > 40) {
      this.apiLogs.pop();
    }
  }

  public getAllTrains(): TrainRecord[] {
    this.cacheHits += 1;
    return this.trains;
  }

  public getTrainByNumber(trainNumber: string): TrainRecord | undefined {
    this.cacheHits += 1;
    const upper = trainNumber.toUpperCase();
    return (
      this.trains.find((t) => t.trainNumber.toUpperCase() === upper) ||
      this.dynamicRouteTrains.get(upper) ||
      this.dynamicRouteTrains.get(trainNumber)
    );
  }

  public searchTrains(filters: {
    q?: string;
    source?: string;
    destination?: string;
    travelClass?: string;
    quota?: string;
    category?: string;
    serviceType?: string;
  }): TrainRecord[] {
    this.cacheHits += 1;
    return this.trains.filter((t) => {
      if (filters.serviceType && filters.serviceType !== 'ALL' && t.serviceType !== filters.serviceType) {
        return false;
      }
      if (filters.q) {
        const needle = filters.q.toLowerCase();
        const match =
          t.trainNumber.toLowerCase().includes(needle) ||
          t.trainName.toLowerCase().includes(needle) ||
          t.sourceCode.toLowerCase().includes(needle) ||
          t.sourceName.toLowerCase().includes(needle) ||
          t.destinationCode.toLowerCase().includes(needle) ||
          t.destinationName.toLowerCase().includes(needle);
        if (!match) return false;
      }
      if (filters.source && filters.source !== 'ALL') {
        const src = filters.source.toUpperCase();
        const matchesStop = t.sourceCode === src || t.stops.some((s) => s.stationCode === src);
        if (!matchesStop) return false;
      }
      if (filters.destination && filters.destination !== 'ALL') {
        const dst = filters.destination.toUpperCase();
        const matchesStop = t.destinationCode === dst || t.stops.some((s) => s.stationCode === dst);
        if (!matchesStop) return false;
      }
      if (filters.travelClass && filters.travelClass !== 'ALL') {
        if (!t.classes.includes(filters.travelClass as TravelClass)) return false;
      }
      if (filters.quota && filters.quota !== 'ALL') {
        if (t.serviceType === 'PASSENGER' && !t.availability.some((a) => a.quota === filters.quota)) {
          return false;
        }
      }
      if (filters.category && filters.category !== 'ALL' && t.category !== filters.category) {
        return false;
      }
      return true;
    });
  }

  private resolvePlaceStations(rawQuery: string): Station[] {
    const cleaned = rawQuery.trim().toLowerCase();
    if (!cleaned) return [];

    const normalized = INDIA_PLACE_ALIASES[cleaned] || cleaned;
    const passengerStations = STATIONS.filter((s) => !s.zone.includes('DFC'));

    // 1. Exact station code match first (e.g. "NDLS", "MMCT", "LKO")
    const exactCode = passengerStations.filter((s) => s.code.toLowerCase() === cleaned);
    if (exactCode.length > 0) return exactCode;

    // 2. Exact city match (e.g. "Delhi" -> NDLS, NZM, ANVT, DLI; "Mumbai" -> MMCT, CSMT, BDTS, LTT)
    const exactCity = passengerStations.filter(
      (s) => s.city.toLowerCase() === normalized || s.city.toLowerCase() === cleaned
    );
    if (exactCity.length > 0) return exactCity;

    // 3. Partial station name, city name, or code match
    const partial = passengerStations.filter(
      (s) =>
        s.name.toLowerCase().includes(cleaned) ||
        s.name.toLowerCase().includes(normalized) ||
        s.city.toLowerCase().includes(cleaned) ||
        s.city.toLowerCase().includes(normalized) ||
        s.code.toLowerCase().includes(cleaned)
    );
    if (partial.length > 0) return partial;

    // 4. Support any custom Indian place name typed by the user in Demo Mode
    const titleCase = rawQuery
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    const synthCode = titleCase
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 4)
      .toUpperCase()
      .padEnd(3, 'X');

    // Deterministic synthetic coordinates inside central India for realistic distance estimation
    let hash = 0;
    for (let i = 0; i < cleaned.length; i++) {
      hash = (hash * 31 + cleaned.charCodeAt(i)) % 10000;
    }
    const lat = 14 + ((hash % 1600) / 100);
    const lng = 73 + (((hash * 7) % 1400) / 100);

    return [
      {
        code: synthCode,
        name: `${titleCase} Junction`,
        city: titleCase,
        zone: 'NR',
        lat,
        lng,
        nearbyHubs: [],
      },
    ];
  }

  private dynamicRouteTrains: Map<string, TrainRecord> = new Map();

  private registerDynamicTrainRecord(match: RouteTrainMatch) {
    if (this.trains.some((t) => t.trainNumber === match.trainNumber)) return;
    if (this.dynamicRouteTrains.has(match.trainNumber)) return;
    const ts = nowIso();
    const estDuration = Math.max(60, Math.round((match.segmentDistanceKm / 65) * 60));
    const hrs = Math.floor(estDuration / 60);
    const mins = estDuration % 60;
    const record: TrainRecord = {
      trainNumber: match.trainNumber,
      trainName: match.trainName,
      serviceType: 'PASSENGER',
      category: match.category,
      zone: match.zone,
      sourceCode: match.boardingStopCode,
      sourceName: match.boardingStopName,
      destinationCode: match.destinationStopCode,
      destinationName: match.destinationStopName,
      departureTime: match.boardingDeparture,
      arrivalTime: match.destinationArrival,
      durationMinutes: estDuration,
      durationLabel: `${hrs}h ${String(mins).padStart(2, '0')}m`,
      distanceKm: match.segmentDistanceKm,
      runningDays: match.runningDays,
      classes: match.classes,
      popularityScore: match.demandLevel === 'CRITICAL' ? 92 : match.demandLevel === 'HIGH' ? 85 : 76,
      demandLevel: match.demandLevel,
      punctualityPercent: match.punctualityPercent,
      avgTatkalSelloutMins: 8.5,
      provenance: ACTIVE_PROVENANCE,
      stops: [
        {
          stationCode: match.boardingStopCode,
          stationName: match.boardingStopName,
          arrivalTime: match.boardingDeparture,
          departureTime: match.boardingDeparture,
          distanceKm: 0,
          day: 1,
          platform: '1',
          status: 'PASSED',
          delayMinutes: 0,
        },
        {
          stationCode: match.destinationStopCode,
          stationName: match.destinationStopName,
          arrivalTime: match.destinationArrival,
          departureTime: match.destinationArrival,
          distanceKm: match.segmentDistanceKm,
          day: estDuration > 720 ? 2 : 1,
          platform: '2',
          status: 'UPCOMING',
          delayMinutes: 0,
        },
      ],
      availability: match.primaryAvailability ? [match.primaryAvailability] : [],
      runningStatus: {
        trainNumber: match.trainNumber,
        serviceType: 'PASSENGER',
        zone: match.zone,
        currentLocation: `En route ${match.boardingStopName} → ${match.destinationStopName}`,
        previousStation: `${match.boardingStopName} (${match.boardingStopCode})`,
        nextStation: `${match.destinationStopName} (${match.destinationStopCode})`,
        delayMinutes: 3,
        estimatedArrival: `${match.destinationArrival} IST`,
        progressPercent: 45,
        speedKmh: 98,
        lat: 23.5,
        lng: 78.9,
        lastUpdated: ts,
        provenance: ACTIVE_PROVENANCE,
      },
    };
    this.dynamicRouteTrains.set(match.trainNumber, record);
    if (this.dynamicRouteTrains.size > 150) {
      const oldestKey = this.dynamicRouteTrains.keys().next().value;
      if (oldestKey) this.dynamicRouteTrains.delete(oldestKey);
    }
  }

  private findDirectionalMatches(
    boardingStations: Station[],
    destinationStations: Station[],
    boardingRaw: string,
    destinationRaw: string,
    dayFilter: string
  ): RouteTrainMatch[] {
    const bCodes = new Set(boardingStations.map((s) => s.code.toUpperCase()));
    const dCodes = new Set(destinationStations.map((s) => s.code.toUpperCase()));
    const bNeedle = boardingRaw.trim().toLowerCase();
    const dNeedle = destinationRaw.trim().toLowerCase();

    const matches: RouteTrainMatch[] = [];

    for (const train of this.trains) {
      if (train.serviceType !== 'PASSENGER') continue;
      if (dayFilter && dayFilter !== 'ALL' && !train.runningDays.includes(dayFilter)) {
        continue;
      }

      const boardingIdx = train.stops.findIndex(
        (stop) =>
          bCodes.has(stop.stationCode.toUpperCase()) ||
          (bCodes.size === 0 &&
            (stop.stationName.toLowerCase().includes(bNeedle) ||
              stop.stationCode.toLowerCase() === bNeedle))
      );

      if (boardingIdx === -1) continue;

      const destIdx = train.stops.findIndex(
        (stop, idx) =>
          idx > boardingIdx &&
          (dCodes.has(stop.stationCode.toUpperCase()) ||
            (dCodes.size === 0 &&
              (stop.stationName.toLowerCase().includes(dNeedle) ||
                stop.stationCode.toLowerCase() === dNeedle)))
      );

      if (destIdx === -1) continue;

      const bStop = train.stops[boardingIdx];
      const dStop = train.stops[destIdx];
      const segmentDistanceKm = Math.max(10, Math.abs(dStop.distanceKm - bStop.distanceKm));
      const primaryAvailability =
        train.availability.find((a) => a.status === 'AVAILABLE') ||
        train.availability.find((a) => a.status === 'RAC') ||
        train.availability[0] ||
        null;

      matches.push({
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        category: train.category,
        zone: train.zone,
        boardingStopCode: bStop.stationCode,
        boardingStopName: bStop.stationName,
        boardingDeparture: bStop.departureTime,
        destinationStopCode: dStop.stationCode,
        destinationStopName: dStop.stationName,
        destinationArrival: dStop.arrivalTime,
        segmentDistanceKm,
        stopsBetween: Math.max(0, destIdx - boardingIdx - 1),
        isDirectOriginToDest: boardingIdx === 0 && destIdx === train.stops.length - 1,
        runningDays: train.runningDays,
        classes: train.classes,
        demandLevel: train.demandLevel,
        punctualityPercent: train.punctualityPercent,
        primaryAvailability,
        hasAvailableSeats: train.availability.some((a) => a.status === 'AVAILABLE'),
        trainOriginCode: train.sourceCode,
        trainDestinationCode: train.destinationCode,
      });
    }

    // If no primary live-monitored trunk train links these two places directly,
    // supplement with deterministic pan-India Demo Mode corridor services so ANY
    // Indian boarding -> destination pair can be checked cleanly in Demo Mode.
    if (
      matches.length === 0 &&
      boardingStations.length > 0 &&
      destinationStations.length > 0
    ) {
      const existingNums = new Set(this.trains.map((t) => t.trainNumber));
      const fallbackMatches = buildPanIndiaDemoCorridorMatches(
        boardingStations[0],
        destinationStations[0],
        dayFilter,
        existingNums,
        ACTIVE_PROVENANCE
      );
      for (const fm of fallbackMatches) {
        this.registerDynamicTrainRecord(fm);
        matches.push(fm);
      }
    }

    return matches.sort((a, b) => a.boardingDeparture.localeCompare(b.boardingDeparture));
  }

  public countTrainsBetweenPlaces(
    boardingQuery: string,
    destinationQuery: string,
    dayFilter = 'ALL'
  ): RouteTrainCountResult {
    this.cacheHits += 1;
    const boardingStations = this.resolvePlaceStations(boardingQuery);
    const destinationStations = this.resolvePlaceStations(destinationQuery);

    const matchedTrains = this.findDirectionalMatches(
      boardingStations,
      destinationStations,
      boardingQuery,
      destinationQuery,
      dayFilter
    );

    const reverseMatches = this.findDirectionalMatches(
      destinationStations,
      boardingStations,
      destinationQuery,
      boardingQuery,
      dayFilter
    );

    const catMap = new Map<TrainCategory, number>();
    let directOriginToDestCount = 0;
    let dailyTrainsCount = 0;
    let availableNowCount = 0;

    for (const m of matchedTrains) {
      catMap.set(m.category, (catMap.get(m.category) || 0) + 1);
      if (m.isDirectOriginToDest) directOriginToDestCount += 1;
      if (m.runningDays.length === 7) dailyTrainsCount += 1;
      if (m.hasAvailableSeats) availableNowCount += 1;
    }

    const categoryBreakdown = Array.from(catMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      boardingQuery,
      destinationQuery,
      dayFilter: dayFilter || 'ALL',
      resolvedBoardingStations: boardingStations.map((s) => ({
        code: s.code,
        name: s.name,
        city: s.city,
      })),
      resolvedDestinationStations: destinationStations.map((s) => ({
        code: s.code,
        name: s.name,
        city: s.city,
      })),
      totalTrains: matchedTrains.length,
      directOriginToDestCount,
      viaIntermediateCount: matchedTrains.length - directOriginToDestCount,
      dailyTrainsCount,
      availableNowCount,
      reverseDirectionCount: reverseMatches.length,
      categoryBreakdown,
      trains: matchedTrains,
      dataMode: RAIL_DATA_MODE,
      provenance: ACTIVE_PROVENANCE,
      timestamp: nowIso(),
    };
  }

  public getHistory(trainNumber: string, travelClass: TravelClass, quota: QuotaCode): AvailabilityHistoryPoint[] {
    const key = `${trainNumber}_${travelClass}_${quota}`;
    const existing = this.historyMap.get(key);
    if (existing) {
      this.cacheHits += 1;
      return existing;
    }
    this.cacheMisses += 1;
    // Fallback to first matching class for that train
    const train = this.getTrainByNumber(trainNumber);
    if (!train || train.availability.length === 0) return [];
    const fallback = train.availability[0];
    const existingFallback = this.historyMap.get(`${train.trainNumber}_${fallback.travelClass}_${fallback.quota}`);
    if (existingFallback) return existingFallback;

    // Synthesize historical curve for dynamically resolved pan-India corridor trains
    const now = Date.now();
    const points: AvailabilityHistoryPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const pointTime = new Date(now - i * 15 * 60 * 1000);
      const factor = i / 11;
      points.push({
        timestamp: pointTime.toISOString(),
        label: pointTime.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        availableSeats:
          fallback.status === 'AVAILABLE'
            ? Math.round(fallback.availableSeats + factor * 42)
            : Math.max(0, Math.round((factor - 0.55) * 32)),
        waitlistNumber:
          fallback.status === 'WAITLIST'
            ? Math.max(1, Math.round(fallback.waitlistNumber * (1 - factor * 0.65)))
            : 0,
        racNumber:
          fallback.status === 'RAC'
            ? Math.max(1, Math.round(fallback.racNumber * (1 - factor * 0.5)))
            : 0,
        depletionVelocity: Number((fallback.depletionRatePerMin * (0.8 + factor * 0.4)).toFixed(1)),
        travelClass: fallback.travelClass,
        provenance: 'HISTORICAL',
      });
    }
    return points;
  }

  /**
   * Advances the server-authoritative real-time state by one tick and returns minimal delta events
   * to broadcast over WebSocket. Clearly tagged as DEMO_SIMULATED when running in DEMO MODE.
   */
  public advanceRealtimeTick(): {
    availabilityDelta: {
      trainNumber: string;
      trainName: string;
      record: ClassAvailability;
      deltaSummary: string;
    };
    corridorDelta: LiveRunningTelemetry;
  } {
    const passengerTrains = this.trains.filter((t) => t.serviceType === 'PASSENGER');
    const selectedTrain = passengerTrains[Math.floor(Math.random() * passengerTrains.length)];
    const mutableAvailability = selectedTrain.availability.filter(
      (a) => a.status !== 'NOT AVAILABLE' && a.status !== 'DATA UNAVAILABLE'
    );
    const av = mutableAvailability[Math.floor(Math.random() * mutableAvailability.length)] || selectedTrain.availability[0];
    const ts = nowIso();
    let deltaSummary = '';

    if (av.status === 'AVAILABLE') {
      const change = Math.random() < 0.72 ? -Math.ceil(Math.random() * 2) : 1;
      av.availableSeats = Math.max(0, av.availableSeats + change);
      if (av.availableSeats === 0) {
        av.status = 'RAC';
        av.racNumber = 1;
        av.waitlistType = 'RAC';
        av.statusText = 'RAC 1';
        deltaSummary = `${selectedTrain.trainNumber} ${av.travelClass}/${av.quota} shifted to RAC 1`;
      } else {
        av.statusText = `AVL ${av.availableSeats}`;
        deltaSummary = `${selectedTrain.trainNumber} ${av.travelClass}/${av.quota} now AVL ${av.availableSeats}`;
      }
    } else if (av.status === 'RAC') {
      const delta = Math.random() < 0.55 ? -1 : 1;
      av.racNumber = Math.max(1, av.racNumber + delta);
      av.statusText = `RAC ${av.racNumber}`;
      deltaSummary = `${selectedTrain.trainNumber} ${av.travelClass}/${av.quota} moved to RAC ${av.racNumber}`;
    } else if (av.status === 'WAITLIST') {
      const delta = Math.random() < 0.6 ? -1 : 2;
      av.waitlistNumber = Math.max(1, av.waitlistNumber + delta);
      av.statusText = `${av.waitlistType} ${av.waitlistNumber}`;
      deltaSummary = `${selectedTrain.trainNumber} ${av.travelClass}/${av.quota} updated to ${av.statusText}`;
    } else {
      deltaSummary = `${selectedTrain.trainNumber} ${av.travelClass}/${av.quota} remains ${av.statusText}`;
    }

    av.lastUpdated = ts;
    av.freshnessSeconds = 1;
    av.provenance = ACTIVE_PROVENANCE;

    // Append point to history
    const histKey = `${selectedTrain.trainNumber}_${av.travelClass}_${av.quota}`;
    const hist = this.historyMap.get(histKey) || [];
    hist.push({
      timestamp: ts,
      label: new Date(ts).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      availableSeats: av.availableSeats,
      waitlistNumber: av.waitlistNumber,
      racNumber: av.racNumber,
      depletionVelocity: av.depletionRatePerMin,
      travelClass: av.travelClass,
      provenance: ACTIVE_PROVENANCE,
    });
    if (hist.length > 24) hist.shift();
    this.historyMap.set(histKey, hist);

    // Update a passenger or freight corridor telemetry item
    const corrTrain = this.trains[Math.floor(Math.random() * this.trains.length)];
    const rs = corrTrain.runningStatus;
    rs.progressPercent = rs.progressPercent >= 98 ? 12 : Number(Math.min(99, rs.progressPercent + 0.6).toFixed(1));
    rs.speedKmh = Math.max(
      corrTrain.serviceType === 'FREIGHT' ? 58 : 84,
      Math.min(corrTrain.serviceType === 'FREIGHT' ? 88 : 132, Math.round(rs.speedKmh + (Math.random() * 6 - 3)))
    );
    rs.delayMinutes = Math.max(0, rs.delayMinutes + (Math.random() < 0.35 ? -1 : Math.random() < 0.2 ? 1 : 0));
    rs.lastUpdated = ts;
    rs.provenance = ACTIVE_PROVENANCE;

    return {
      availabilityDelta: {
        trainNumber: selectedTrain.trainNumber,
        trainName: selectedTrain.trainName,
        record: { ...av },
        deltaSummary,
      },
      corridorDelta: { ...rs },
    };
  }

  public getDemandAnalytics(): DemandAnalyticsPayload {
    const today = new Date();
    const dateHeatmap = Array.from({ length: 28 }).map((_, idx) => {
      const d = new Date(today.getTime() + idx * 86400000);
      const dow = d.getDay();
      const isWeekend = dow === 0 || dow === 5 || dow === 6;
      const base = isWeekend ? 82 : 58;
      const wave = Math.round(Math.sin(idx * 0.55) * 12);
      const demandIndex = Math.min(99, Math.max(32, base + wave + (idx === 1 || idx === 2 ? 9 : 0)));
      return {
        date: d.toISOString().slice(0, 10),
        dayLabel: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        demandIndex,
        isWeekend,
        seasonTag: idx === 5 || idx === 6 ? 'Peak Weekend Surge' : idx === 14 ? 'Holiday Window' : undefined,
      };
    });

    const passengerTrains = this.trains.filter((t) => t.serviceType === 'PASSENGER');
    return {
      provenance: ACTIVE_PROVENANCE,
      generatedAt: nowIso(),
      topPopularTrains: passengerTrains
        .slice()
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .map((t) => ({
          trainNumber: t.trainNumber,
          trainName: t.trainName,
          corridor: `${t.sourceCode} → ${t.destinationCode}`,
          popularityIndex: t.popularityScore,
          avgWaitlist: Math.round((t.popularityScore - 55) * 1.4),
          tatkalSelloutMins: t.avgTatkalSelloutMins,
          demandLevel: t.demandLevel,
        })),
      highDemandRoutes: [
        { route: 'NDLS → MMCT (Western Trunk)', dailySearches: 148200, avgOccupancyPct: 97.4, tatkalPressureIndex: 96 },
        { route: 'NDLS → HWH (Grand Chord)', dailySearches: 134500, avgOccupancyPct: 96.8, tatkalPressureIndex: 95 },
        { route: 'NDLS → SBC (North-South Trunk)', dailySearches: 112900, avgOccupancyPct: 95.1, tatkalPressureIndex: 92 },
        { route: 'HWH → CSMT (East-West Main)', dailySearches: 98400, avgOccupancyPct: 93.7, tatkalPressureIndex: 89 },
        { route: 'MAS → SBC (Southern Tech Corridor)', dailySearches: 84200, avgOccupancyPct: 88.5, tatkalPressureIndex: 74 },
        { route: 'MMCT → ADI (Western Express)', dailySearches: 79600, avgOccupancyPct: 86.2, tatkalPressureIndex: 71 },
      ],
      dateHeatmap,
      classComparison: [
        { travelClass: 'SL', avgTatkalDemand: 96, avgConfirmationRate: 34, selloutMinutes: 3.1 },
        { travelClass: '3A', avgTatkalDemand: 92, avgConfirmationRate: 51, selloutMinutes: 4.8 },
        { travelClass: '3E', avgTatkalDemand: 84, avgConfirmationRate: 63, selloutMinutes: 7.2 },
        { travelClass: '2A', avgTatkalDemand: 78, avgConfirmationRate: 71, selloutMinutes: 9.5 },
        { travelClass: 'CC', avgTatkalDemand: 72, avgConfirmationRate: 82, selloutMinutes: 13.4 },
        { travelClass: 'EC', avgTatkalDemand: 54, avgConfirmationRate: 91, selloutMinutes: 22.0 },
        { travelClass: '1A', avgTatkalDemand: 61, avgConfirmationRate: 76, selloutMinutes: 18.5 },
      ],
      bookingSpeedTimeline: [
        { minuteAfterOpen: 'T+0m', acRemainingPct: 100, nonAcRemainingPct: 100, premiumTatkalRemainingPct: 100 },
        { minuteAfterOpen: 'T+1m', acRemainingPct: 68, nonAcRemainingPct: 54, premiumTatkalRemainingPct: 86 },
        { minuteAfterOpen: 'T+2m', acRemainingPct: 41, nonAcRemainingPct: 24, premiumTatkalRemainingPct: 71 },
        { minuteAfterOpen: 'T+3m', acRemainingPct: 22, nonAcRemainingPct: 9, premiumTatkalRemainingPct: 58 },
        { minuteAfterOpen: 'T+5m', acRemainingPct: 8, nonAcRemainingPct: 2, premiumTatkalRemainingPct: 41 },
        { minuteAfterOpen: 'T+8m', acRemainingPct: 3, nonAcRemainingPct: 0, premiumTatkalRemainingPct: 26 },
        { minuteAfterOpen: 'T+12m', acRemainingPct: 0, nonAcRemainingPct: 0, premiumTatkalRemainingPct: 14 },
        { minuteAfterOpen: 'T+20m', acRemainingPct: 0, nonAcRemainingPct: 0, premiumTatkalRemainingPct: 5 },
      ],
      weekdayVsWeekend: [
        { day: 'Mon', avgDemand: 76, avgWl: 28, confirmationPct: 68 },
        { day: 'Tue', avgDemand: 64, avgWl: 19, confirmationPct: 79 },
        { day: 'Wed', avgDemand: 62, avgWl: 17, confirmationPct: 81 },
        { day: 'Thu', avgDemand: 71, avgWl: 24, confirmationPct: 72 },
        { day: 'Fri', avgDemand: 94, avgWl: 54, confirmationPct: 41 },
        { day: 'Sat', avgDemand: 91, avgWl: 49, confirmationPct: 46 },
        { day: 'Sun', avgDemand: 95, avgWl: 58, confirmationPct: 38 },
      ],
      seasonalTrends: [
        { month: 'Jan', demandIndex: 74, cancellationRate: 18, tatkalSurge: 68 },
        { month: 'Feb', demandIndex: 68, cancellationRate: 19, tatkalSurge: 62 },
        { month: 'Mar', demandIndex: 86, cancellationRate: 14, tatkalSurge: 84 },
        { month: 'Apr', demandIndex: 82, cancellationRate: 16, tatkalSurge: 79 },
        { month: 'May', demandIndex: 94, cancellationRate: 12, tatkalSurge: 93 },
        { month: 'Jun', demandIndex: 88, cancellationRate: 15, tatkalSurge: 85 },
        { month: 'Jul', demandIndex: 66, cancellationRate: 22, tatkalSurge: 59 },
        { month: 'Aug', demandIndex: 78, cancellationRate: 19, tatkalSurge: 74 },
        { month: 'Sep', demandIndex: 71, cancellationRate: 21, tatkalSurge: 65 },
        { month: 'Oct', demandIndex: 97, cancellationRate: 10, tatkalSurge: 98 },
        { month: 'Nov', demandIndex: 96, cancellationRate: 11, tatkalSurge: 96 },
        { month: 'Dec', demandIndex: 92, cancellationRate: 13, tatkalSurge: 91 },
      ],
    };
  }

  public getRecommendations(params: {
    sourceCode?: string;
    destinationCode?: string;
    travelClass?: TravelClass;
    preferFastest?: boolean;
  }): SmartRecommendation[] {
    const src = (params.sourceCode || 'NDLS').toUpperCase();
    const dst = (params.destinationCode || 'MMCT').toUpperCase();
    const preferredClass = params.travelClass || '3A';

    const srcStation = STATIONS.find((s) => s.code === src);
    const nearbyCodes = srcStation?.nearbyHubs || ['NZM', 'ANVT'];

    const recs: SmartRecommendation[] = [];

    // 1. Alternate train from nearby terminal
    const nearbyMatches = this.trains.filter(
      (t) =>
        t.serviceType === 'PASSENGER' &&
        (nearbyCodes.includes(t.sourceCode) || t.sourceCode === src) &&
        (t.destinationCode === dst || dst === 'ALL')
    );

    for (const train of nearbyMatches.slice(0, 2)) {
      const bestAv =
        train.availability.find((a) => a.status === 'AVAILABLE') ||
        train.availability.find((a) => a.status === 'RAC') ||
        train.availability[0];
      if (!bestAv) continue;
      recs.push({
        type: train.sourceCode !== src ? 'NEARBY_STATION' : 'ALTERNATE_TRAIN',
        title:
          train.sourceCode !== src
            ? `Board from nearby hub ${train.sourceCode} (${train.sourceName})`
            : `Switch to ${train.trainName} (${train.trainNumber})`,
        subtitle: `${train.sourceCode} → ${train.destinationCode} · ${train.departureTime} - ${train.arrivalTime}`,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        sourceCode: train.sourceCode,
        destinationCode: train.destinationCode,
        travelClass: bestAv.travelClass,
        quota: bestAv.quota,
        statusText: bestAv.statusText,
        estimatedProbability: bestAv.status === 'AVAILABLE' ? 99 : bestAv.status === 'RAC' ? 88 : 56,
        durationLabel: train.durationLabel,
        rankingScore: bestAv.status === 'AVAILABLE' ? 94 : 84,
        rationale:
          train.sourceCode !== src
            ? `Nearby terminal ${train.sourceCode} experiences 28% lower Tatkal contention than ${src}, maintaining ${bestAv.statusText} in ${bestAv.travelClass}.`
            : `Lower historical depletion velocity (${bestAv.depletionRatePerMin}/min) with stronger confirmation probability.`,
        provenance: ACTIVE_PROVENANCE,
      });
    }

    // 2. Alternate class upgrade / downgrade recommendation
    recs.push({
      type: 'ALTERNATE_CLASS',
      title: `Shift from ${preferredClass} to 2A or 3E for +24% Confirmation Lift`,
      subtitle: 'Class elasticity & cancellation velocity optimization',
      trainNumber: '12952',
      trainName: 'Mumbai Tejas Rajdhani Express',
      sourceCode: 'NDLS',
      destinationCode: 'MMCT',
      travelClass: preferredClass === '2A' ? '3E' : '2A',
      quota: 'TQ',
      statusText: 'AVL 9',
      estimatedProbability: 94,
      durationLabel: '15h 40m',
      rankingScore: 91,
      rationale:
        '2A and 3E cabins deplete 48% slower than 3A/SL during the 10:00–10:05 IST AC Tatkal surge window and exhibit higher last-24h corporate cancellations.',
      provenance: ACTIVE_PROVENANCE,
    });

    // 3. Alternate mid-week travel date recommendation
    recs.push({
      type: 'ALTERNATE_DATE',
      title: 'Shift Departure to Tuesday or Wednesday (-31% Waitlist Pressure)',
      subtitle: 'Weekday demand trough analysis across major Indian trunk corridors',
      trainNumber: '12954',
      trainName: 'August Kranti Tejas Rajdhani',
      sourceCode: 'NZM',
      destinationCode: 'MMCT',
      travelClass: '3A',
      quota: 'GN',
      statusText: 'RAC 11 (Est. 89% CNF)',
      estimatedProbability: 89,
      durationLabel: '16h 50m',
      rankingScore: 87,
      rationale:
        'Historical weekday/weekend modeling shows Tuesday/Wednesday departures clear GNWL/RAC up to 2.4x faster than Friday/Sunday peaks.',
      provenance: ACTIVE_PROVENANCE,
    });

    return recs.sort((a, b) => b.rankingScore - a.rankingScore);
  }

  public getAdminStats(wsConnectedClients: number, trackedIps: number) {
    const totalCacheOps = this.cacheHits + this.cacheMisses;
    return {
      dataMode: RAIL_DATA_MODE,
      providerStatus:
        RAIL_DATA_MODE === 'AUTHORIZED_API'
          ? 'Connected to Configured Authorized Railway API'
          : 'DEMO MODE — Simulated Indian Railway Feed (No external railway API key configured)',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      wsConnectedClients,
      cacheHitRatioPct: Number(((this.cacheHits / Math.max(1, totalCacheOps)) * 100).toFixed(1)),
      cacheEntries: this.trains.length + this.historyMap.size,
      apiRequestsLastHour: this.apiLogs.length + 142,
      errorRatePct: 0.4,
      rateLimitConfig: {
        windowMs: 60000,
        maxRequestsPerIp: 120,
        currentTrackedIps: trackedIps,
      },
      dataFreshness: [
        { feed: 'Passenger Tatkal Availability Stream', lastSync: nowIso(), stalenessSeconds: 4, status: RAIL_DATA_MODE === 'AUTHORIZED_API' ? 'HEALTHY' as const : 'SIMULATED' as const },
        { feed: 'Waitlist Historical Snapshot Store', lastSync: nowIso(), stalenessSeconds: 12, status: 'HEALTHY' as const },
        { feed: 'WDFC / EDFC Freight Corridor Telemetry', lastSync: nowIso(), stalenessSeconds: 6, status: RAIL_DATA_MODE === 'AUTHORIZED_API' ? 'HEALTHY' as const : 'SIMULATED' as const },
        { feed: 'ML Calibration & Anomaly Pipeline', lastSync: nowIso(), stalenessSeconds: 2, status: 'HEALTHY' as const },
      ],
      recentApiLogs: this.apiLogs.slice(0, 15),
    };
  }
}

export const railDataEngine = new RailDataEngine();
