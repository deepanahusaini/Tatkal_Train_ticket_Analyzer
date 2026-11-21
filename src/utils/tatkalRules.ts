export interface IstClockSnapshot {
  istTimeString: string;
  istDateString: string;
  istHours: number;
  istMinutes: number;
  istSeconds: number;
  acWindowStatus: 'OPEN' | 'OPENING_SOON' | 'SCHEDULED';
  nonAcWindowStatus: 'OPEN' | 'OPENING_SOON' | 'SCHEDULED';
  secondsToAcOpen: number;
  secondsToNonAcOpen: number;
  nextAcOpenLabel: string;
  nextNonAcOpenLabel: string;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function getIstNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + IST_OFFSET_MS);
}

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function computeIstTatkalState(): IstClockSnapshot {
  const ist = getIstNow();
  const h = ist.getHours();
  const m = ist.getMinutes();
  const s = ist.getSeconds();
  const currentSecOfDay = h * 3600 + m * 60 + s;

  const acOpenSec = 10 * 3600; // 10:00:00 IST
  const nonAcOpenSec = 11 * 3600; // 11:00:00 IST
  const daySec = 24 * 3600;

  let secondsToAcOpen = acOpenSec - currentSecOfDay;
  let acWindowStatus: 'OPEN' | 'OPENING_SOON' | 'SCHEDULED' = 'SCHEDULED';
  let nextAcOpenLabel = 'Today 10:00 IST';

  if (currentSecOfDay >= acOpenSec && currentSecOfDay < acOpenSec + 3600) {
    acWindowStatus = 'OPEN';
    secondsToAcOpen = 0;
    nextAcOpenLabel = 'Active AC Tatkal Window (10:00–11:00 IST)';
  } else if (secondsToAcOpen > 0 && secondsToAcOpen <= 1800) {
    acWindowStatus = 'OPENING_SOON';
  } else if (secondsToAcOpen < 0) {
    secondsToAcOpen += daySec;
    nextAcOpenLabel = 'Tomorrow 10:00 IST';
  }

  let secondsToNonAcOpen = nonAcOpenSec - currentSecOfDay;
  let nonAcWindowStatus: 'OPEN' | 'OPENING_SOON' | 'SCHEDULED' = 'SCHEDULED';
  let nextNonAcOpenLabel = 'Today 11:00 IST';

  if (currentSecOfDay >= nonAcOpenSec && currentSecOfDay < nonAcOpenSec + 3600) {
    nonAcWindowStatus = 'OPEN';
    secondsToNonAcOpen = 0;
    nextNonAcOpenLabel = 'Active Non-AC Tatkal Window (11:00–12:00 IST)';
  } else if (secondsToNonAcOpen > 0 && secondsToNonAcOpen <= 1800) {
    nonAcWindowStatus = 'OPENING_SOON';
  } else if (secondsToNonAcOpen < 0) {
    secondsToNonAcOpen += daySec;
    nextNonAcOpenLabel = 'Tomorrow 11:00 IST';
  }

  const istTimeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} IST`;
  const istDateString = ist.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    istTimeString,
    istDateString,
    istHours: h,
    istMinutes: m,
    istSeconds: s,
    acWindowStatus,
    nonAcWindowStatus,
    secondsToAcOpen,
    secondsToNonAcOpen,
    nextAcOpenLabel,
    nextNonAcOpenLabel,
  };
}

/**
 * Official Indian Railways Tatkal Rule:
 * Tatkal booking opens 1 day in advance of the journey date from the train originating station (T-1):
 * - AC Classes (1A, 2A, 3A, 3E, CC, EC): 10:00 AM IST
 * - Non-AC Classes (SL, 2S): 11:00 AM IST
 */
export function computeBookingOpenDate(journeyDateIso: string, isAcClass: boolean): {
  openDateIso: string;
  openTimeIst: string;
  ruleSummary: string;
} {
  const journey = new Date(`${journeyDateIso}T00:00:00Z`);
  if (Number.isNaN(journey.getTime())) {
    return {
      openDateIso: journeyDateIso,
      openTimeIst: isAcClass ? '10:00 AM IST' : '11:00 AM IST',
      ruleSummary: 'Opens 1 day before train origin departure date.',
    };
  }
  const openDate = new Date(journey.getTime() - 86400000);
  const openDateIso = openDate.toISOString().slice(0, 10);
  const openTimeIst = isAcClass ? '10:00 AM IST' : '11:00 AM IST';
  return {
    openDateIso,
    openTimeIst,
    ruleSummary: `${isAcClass ? 'AC' : 'Non-AC'} Tatkal opens ${openDateIso} at ${openTimeIst} (T-1 from train origin station).`,
  };
}

export function getTomorrowIso(): string {
  const d = new Date(Date.now() + 86400000);
  return d.toISOString().slice(0, 10);
}

export function getFutureDateIso(daysAhead: number): string {
  const d = new Date(Date.now() + daysAhead * 86400000);
  return d.toISOString().slice(0, 10);
}
