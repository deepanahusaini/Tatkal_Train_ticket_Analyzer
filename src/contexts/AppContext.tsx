import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type {
  ClassAvailability,
  DataProvenance,
  QuotaCode,
  Station,
  TrainRecord,
  TravelClass,
} from '../types/railway';

export type NavSection = 'overview' | 'routes' | 'search' | 'tatkal' | 'predictions' | 'tracking';

export interface PinnedTrain {
  id: string;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destinationCode: string;
  travelClass: TravelClass;
  quota: QuotaCode;
}

interface AppContextValue {
  activeSection: NavSection;
  setActiveSection: (s: NavSection) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  routeQuery: { boarding: string; destination: string };
  setRouteQuery: (q: { boarding: string; destination: string }) => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  trains: TrainRecord[];
  stations: Station[];
  trainsLoading: boolean;
  trainsError: string | null;
  wsStatus: 'CONNECTING' | 'CONNECTED' | 'RECONNECTING';
  provenance: DataProvenance;
  refreshTrains: () => Promise<void>;

  pinnedTrains: PinnedTrain[];
  togglePinTrain: (item: Omit<PinnedTrain, 'id'>) => void;
  isTrainPinned: (trainNumber: string) => boolean;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PINNED_STORAGE_KEY = 'railpulse_pinned_trains_v1';

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [routeQuery, setRouteQuery] = useState<{ boarding: string; destination: string }>({
    boarding: 'Delhi',
    destination: 'Mumbai',
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [trains, setTrains] = useState<TrainRecord[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [trainsLoading, setTrainsLoading] = useState(true);
  const [trainsError, setTrainsError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<'CONNECTING' | 'CONNECTED' | 'RECONNECTING'>('CONNECTING');
  const [provenance, setProvenance] = useState<DataProvenance>('DEMO_SIMULATED');

  const [pinnedTrains, setPinnedTrains] = useState<PinnedTrain[]>(() => {
    try {
      const saved = localStorage.getItem(PINNED_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as PinnedTrain[]) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 3200);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedTrains));
    } catch {
      // Ignore storage quota errors
    }
  }, [pinnedTrains]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const refreshTrains = useCallback(async () => {
    try {
      setTrainsError(null);
      const [trainsRes, stationsRes] = await Promise.all([
        fetch('/api/trains'),
        fetch('/api/stations'),
      ]);
      if (!trainsRes.ok) throw new Error(`Server returned ${trainsRes.status}`);
      const trainsJson = await trainsRes.json();
      setTrains(trainsJson.trains || []);
      if (trainsJson.provenance) setProvenance(trainsJson.provenance);
      if (stationsRes.ok) {
        const stJson = await stationsRes.json();
        setStations(stJson.stations || []);
      }
    } catch (err) {
      setTrainsError(err instanceof Error ? err.message : 'Unable to fetch railway catalog');
    } finally {
      setTrainsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTrains();
  }, [refreshTrains]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${proto}//${window.location.host}/ws`);

      ws.onopen = () => {
        if (!disposed) setWsStatus('CONNECTED');
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'snapshot:init') {
            if (Array.isArray(msg.trains)) {
              setTrains(msg.trains);
              setTrainsLoading(false);
            }
            if (msg.provenance) setProvenance(msg.provenance);
          } else if (msg.type === 'feed:delta') {
            const avDelta = msg.availabilityDelta as
              | { trainNumber: string; record: ClassAvailability }
              | undefined;
            const corrDelta = msg.corridorDelta;

            setTrains((prev) =>
              prev.map((train) => {
                let updated = train;
                if (avDelta && train.trainNumber === avDelta.trainNumber) {
                  updated = {
                    ...updated,
                    availability: updated.availability.map((a) =>
                      a.travelClass === avDelta.record.travelClass && a.quota === avDelta.record.quota
                        ? avDelta.record
                        : a
                    ),
                  };
                }
                if (corrDelta && train.trainNumber === corrDelta.trainNumber) {
                  updated = { ...updated, runningStatus: corrDelta };
                }
                return updated;
              })
            );
          }
        } catch {
          // Ignore malformed WS message
        }
      };

      ws.onclose = () => {
        if (!disposed) {
          setWsStatus('RECONNECTING');
          reconnectTimer = window.setTimeout(connect, 3500);
        }
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();
    return () => {
      disposed = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  const togglePinTrain = useCallback(
    (item: Omit<PinnedTrain, 'id'>) => {
      setPinnedTrains((prev) => {
        const exists = prev.some((p) => p.trainNumber === item.trainNumber);
        if (exists) {
          showToast(`Removed ${item.trainNumber} from quick pins.`);
          return prev.filter((p) => p.trainNumber !== item.trainNumber);
        }
        showToast(`Pinned ${item.trainNumber} to your dashboard.`);
        return [{ ...item, id: `${item.trainNumber}_${Date.now()}` }, ...prev].slice(0, 8);
      });
    },
    [showToast]
  );

  const isTrainPinned = useCallback(
    (trainNumber: string) => pinnedTrains.some((p) => p.trainNumber === trainNumber),
    [pinnedTrains]
  );

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        globalSearchQuery,
        setGlobalSearchQuery,
        routeQuery,
        setRouteQuery,
        theme,
        toggleTheme,
        trains,
        stations,
        trainsLoading,
        trainsError,
        wsStatus,
        provenance,
        refreshTrains,
        pinnedTrains,
        togglePinTrain,
        isTrainPinned,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
