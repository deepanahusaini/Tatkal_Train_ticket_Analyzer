import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeftRight, ArrowRight, LocateFixed, Pin, RefreshCw, Search, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PlaceSearchInput } from '../components/PlaceSearchInput';
import { AvailabilityLabel, getDemandColorClass } from '../components/StatusText';
import {
  findNearestPassengerStations,
  requestDeviceCoordinates,
  type NearbyStationMatch,
} from '../utils/nearestStation';
import type { RouteTrainCountResult } from '../types/railway';

const GLASS_CARD =
  'rounded-2xl bg-white/45 dark:bg-[#081226]/42 backdrop-blur-md border border-slate-900/12 dark:border-white/12';

const RUNNING_DAYS = ['ALL', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const POPULAR_CORRIDORS: { boarding: string; destination: string }[] = [
  { boarding: 'Delhi', destination: 'Lucknow' },
  { boarding: 'Delhi', destination: 'Mumbai' },
  { boarding: 'Delhi', destination: 'Varanasi' },
  { boarding: 'Delhi', destination: 'Bengaluru' },
  { boarding: 'Mumbai', destination: 'Goa' },
  { boarding: 'Delhi', destination: 'Jaipur' },
];

export const RouteCountPage: React.FC<{
  onSelectTrainForPrediction: (trainNumber: string) => void;
  onSelectTrainForMonitor: (trainNumber: string) => void;
}> = ({ onSelectTrainForPrediction, onSelectTrainForMonitor }) => {
  const {
    stations,
    routeQuery,
    setRouteQuery,
    togglePinTrain,
    isTrainPinned,
  } = useApp();

  const [boarding, setBoarding] = useState(routeQuery.boarding || 'Delhi');
  const [destination, setDestination] = useState(routeQuery.destination || 'Lucknow');
  const [dayFilter, setDayFilter] = useState<string>('ALL');

  const [result, setResult] = useState<RouteTrainCountResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyStations, setNearbyStations] = useState<NearbyStationMatch[]>([]);
  const [awaitingDestination, setAwaitingDestination] = useState(false);
  const [destAutoOpenTrigger, setDestAutoOpenTrigger] = useState(0);

  useEffect(() => {
    if (routeQuery.boarding && routeQuery.destination) {
      setBoarding(routeQuery.boarding);
      setDestination(routeQuery.destination);
    }
  }, [routeQuery.boarding, routeQuery.destination]);

  const fetchRouteCount = useCallback(
    async (b: string, d: string, day: string) => {
      const trimmedB = b.trim();
      const trimmedD = d.trim();
      if (!trimmedB || !trimmedD) {
        setError('Enter both a boarding place name and a destination place name.');
        setResult(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          boarding: trimmedB,
          destination: trimmedD,
          day,
        });
        const res = await fetch(`/api/routes/count?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Server returned ${res.status}`);
        }
        setResult(data as RouteTrainCountResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to count trains for this route.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRouteCount(boarding, destination, dayFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayFilter, routeQuery.boarding, routeQuery.destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRouteQuery({ boarding: boarding.trim(), destination: destination.trim() });
    fetchRouteCount(boarding, destination, dayFilter);
  };

  const handleSwap = () => {
    const nextBoarding = destination;
    const nextDest = boarding;
    setBoarding(nextBoarding);
    setDestination(nextDest);
    setRouteQuery({ boarding: nextBoarding, destination: nextDest });
    fetchRouteCount(nextBoarding, nextDest, dayFilter);
  };

  const handlePickCorridor = (b: string, d: string) => {
    setBoarding(b);
    setDestination(d);
    setAwaitingDestination(false);
    setRouteQuery({ boarding: b, destination: d });
    fetchRouteCount(b, d, dayFilter);
  };

  const handleUseMyLocation = async () => {
    setLocating(true);
    setLocationError(null);
    setError(null);
    try {
      const { lat, lng } = await requestDeviceCoordinates();
      const nearest = findNearestPassengerStations(lat, lng, stations, 3);
      if (nearest.length === 0) {
        setLocationError('Station list is still loading. Please try again in a moment.');
        return;
      }
      const closest = nearest[0];
      setNearbyStations(nearest);
      setBoarding(closest.station.name);
      setDestination('');
      setResult(null);
      setAwaitingDestination(true);
      setDestAutoOpenTrigger((prev) => prev + 1);
    } catch (err) {
      setLocationError(
        err instanceof Error ? err.message : 'Unable to detect your device location.'
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Trains Between Boarding & Destination
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200/80 mt-1">
          Click either field to browse all Indian cities & stations, or type any boarding and destination place name to search trains live.
        </p>
      </div>

      {/* Boarding & Destination Place Form */}
      <form onSubmit={handleSubmit} className={`${GLASS_CARD} p-5 space-y-4 relative z-20`}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
          <PlaceSearchInput
            id="boarding-place-input"
            label="Boarding Place Name"
            labelAction={
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                {locating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5" />
                )}
                {locating ? 'Locating...' : 'Use My Location'}
              </button>
            }
            value={boarding}
            onChange={(val) => {
              setBoarding(val);
              setLocationError(null);
            }}
            onSelectPlace={(chosen) => {
              if (destination.trim()) {
                setAwaitingDestination(false);
                setRouteQuery({ boarding: chosen, destination: destination.trim() });
                fetchRouteCount(chosen, destination.trim(), dayFilter);
              }
            }}
            stations={stations}
            placeholder="Browse or type any boarding city/station..."
          />

          <button
            type="button"
            onClick={handleSwap}
            title="Swap boarding and destination places"
            aria-label="Swap boarding and destination places"
            className="h-[42px] w-full md:w-[42px] flex items-center justify-center rounded-xl bg-white/50 dark:bg-white/10 hover:bg-white/75 dark:hover:bg-white/20 border border-slate-900/12 dark:border-white/15 text-slate-700 dark:text-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <PlaceSearchInput
            id="destination-place-input"
            label="Destination Place Name"
            value={destination}
            onChange={(val) => {
              setDestination(val);
              if (val.trim()) setAwaitingDestination(false);
            }}
            onSelectPlace={(chosen) => {
              setAwaitingDestination(false);
              if (boarding.trim()) {
                setRouteQuery({ boarding: boarding.trim(), destination: chosen });
                fetchRouteCount(boarding.trim(), chosen, dayFilter);
              }
            }}
            stations={stations}
            placeholder={
              awaitingDestination
                ? 'Now choose your destination place...'
                : 'Browse or type any destination city/station...'
            }
            autoOpenTrigger={destAutoOpenTrigger}
          />

          <button
            type="submit"
            disabled={loading}
            className="h-[42px] inline-flex items-center justify-center gap-2 px-5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Count Trains
          </button>
        </div>

        {/* Nearest Station Feedback & Destination Prompt */}
        {locationError && (
          <div className="text-xs text-rose-600 dark:text-rose-400 pt-1">
            {locationError}
          </div>
        )}

        {nearbyStations.length > 0 && (
          <div className="pt-3 border-t border-slate-900/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-slate-800 dark:text-slate-100">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Nearest station detected:
              </span>{' '}
              <span className="font-semibold">
                {nearbyStations[0].station.name} ({nearbyStations[0].station.code})
              </span>{' '}
              <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                · {nearbyStations[0].distanceKm.toLocaleString('en-IN')} km away
              </span>
              {awaitingDestination && (
                <span className="ml-2 font-medium text-emerald-700 dark:text-emerald-400">
                  — Now select your Destination Place to search live trains.
                </span>
              )}
            </div>
            {nearbyStations.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>Also nearby:</span>
                {nearbyStations.slice(1).map((item, idx) => (
                  <React.Fragment key={item.station.code}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <button
                      type="button"
                      onClick={() => {
                        setBoarding(item.station.name);
                        if (destination.trim()) {
                          setRouteQuery({ boarding: item.station.name, destination: destination.trim() });
                          fetchRouteCount(item.station.name, destination.trim(), dayFilter);
                        } else {
                          setAwaitingDestination(true);
                          setDestAutoOpenTrigger((p) => p + 1);
                        }
                      }}
                      className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      {item.station.name} ({item.station.code}, {item.distanceKm} km)
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Running Day Filter & Popular Quick Routes */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-900/10 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 mr-1.5">
              Running Day:
            </span>
            {RUNNING_DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDayFilter(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  dayFilter === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/35 dark:bg-white/8 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/15'
                }`}
              >
                {d === 'ALL' ? 'All Days' : d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">Popular:</span>
            {POPULAR_CORRIDORS.map((pair, idx) => (
              <React.Fragment key={`${pair.boarding}_${pair.destination}`}>
                {idx > 0 && <span aria-hidden="true" className="opacity-40">·</span>}
                <button
                  type="button"
                  onClick={() => handlePickCorridor(pair.boarding, pair.destination)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer whitespace-nowrap"
                >
                  {pair.boarding} → {pair.destination}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className={`${GLASS_CARD} p-5 text-sm text-rose-600 dark:text-rose-400`}>
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !result && (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 rounded-2xl bg-white/25 dark:bg-white/5" />
          <div className="h-64 rounded-2xl bg-white/25 dark:bg-white/5" />
        </div>
      )}

      {/* Count Result & Breakdown */}
      {result && (
        <>
          <section className={`${GLASS_CARD} p-6`}>
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center">
              {/* Focal Train Count Number */}
              <div className="pr-0 lg:pr-6 lg:border-r border-slate-900/10 dark:border-white/10">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Total Matching Trains
                </div>
                <div className="mt-1 flex items-baseline gap-2.5">
                  <span className="font-mono text-5xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
                    {result.totalTrains}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {result.totalTrains === 1 ? 'train' : 'trains'}
                  </span>
                </div>
                <div className="mt-1.5 text-xs text-slate-700 dark:text-slate-200/85 font-medium flex items-center gap-1.5">
                  <span>{result.boardingQuery}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>{result.destinationQuery}</span>
                  {result.dayFilter !== 'ALL' && (
                    <span className="text-slate-500 dark:text-slate-400">
                      · {result.dayFilter}
                    </span>
                  )}
                </div>
              </div>

              {/* Clean Unboxed Breakdown Metrics */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Direct Origin–Dest</div>
                    <div className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white mt-0.5">
                      {result.directOriginToDestCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Passing Through</div>
                    <div className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white mt-0.5">
                      {result.viaIntermediateCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Run Daily (7d)</div>
                    <div className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white mt-0.5">
                      {result.dailyTrainsCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Seats Open Now</div>
                    <div className="font-mono text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {result.availableNowCount}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3 border-t border-slate-900/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-800 dark:text-slate-100">Matched Hubs:</span>
                    <span>
                      {result.resolvedBoardingStations.length > 0
                        ? result.resolvedBoardingStations.map((s) => `${s.name} (${s.code})`).join(', ')
                        : result.boardingQuery}
                    </span>
                    <span aria-hidden="true">→</span>
                    <span>
                      {result.resolvedDestinationStations.length > 0
                        ? result.resolvedDestinationStations.map((s) => `${s.name} (${s.code})`).join(', ')
                        : result.destinationQuery}
                    </span>
                  </div>

                  {result.categoryBreakdown.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums">
                      {result.categoryBreakdown.map((item, i) => (
                        <React.Fragment key={item.category}>
                          {i > 0 && <span aria-hidden="true">·</span>}
                          <span>
                            {item.category}: {item.count}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                {result.reverseDirectionCount > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span>
                      Return direction ({result.destinationQuery} → {result.boardingQuery}) has{' '}
                      <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                        {result.reverseDirectionCount}
                      </strong>{' '}
                      {result.reverseDirectionCount === 1 ? 'train' : 'trains'}.
                    </span>
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      Check Return Direction
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Matching Trains Table or Empty State */}
          {result.trains.length === 0 ? (
            <div className={`${GLASS_CARD} p-10 text-center space-y-3`}>
              <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                Select two different Indian places to count trains
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Boarding place and destination place appear to resolve to the same city. Choose a different destination to see matching trains.
              </p>
              <button
                type="button"
                onClick={() => handlePickCorridor('Delhi', 'Lucknow')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Try Delhi → Lucknow
              </button>
            </div>
          ) : (
            <section className={`${GLASS_CARD} overflow-hidden`}>
              <div className="px-5 py-4 border-b border-slate-900/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    Matched Trains ({result.totalTrains})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300/80 mt-0.5">
                    Directional stop order ·{' '}
                    {result.dataMode === 'DEMO_MODE'
                      ? 'Demo Mode (Simulated Indian Railways Corridor Feed)'
                      : 'Authorized Live Railway Feed'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
                      <th className="py-3 px-5 font-medium">Train</th>
                      <th className="py-3 px-3 font-medium">Boarding → Destination</th>
                      <th className="py-3 px-3 font-medium">Distance & Stops</th>
                      <th className="py-3 px-3 font-medium">Running Days</th>
                      <th className="py-3 px-3 font-medium">Live Status</th>
                      <th className="py-3 px-5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/8 dark:divide-white/8 text-sm">
                    {result.trains.map((item) => {
                      const pinned = isTrainPinned(item.trainNumber);
                      return (
                        <tr
                          key={item.trainNumber}
                          className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3.5 px-5">
                            <div className="font-medium text-slate-900 dark:text-white">
                              <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400 mr-2">
                                {item.trainNumber}
                              </span>
                              {item.trainName}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span>{item.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className={getDemandColorClass(item.demandLevel)}>
                                {item.demandLevel} Demand
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {item.isDirectOriginToDest
                                  ? 'Origin to Destination'
                                  : `Via route (${item.trainOriginCode}–${item.trainDestinationCode})`}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-slate-800 dark:text-slate-100 whitespace-nowrap">
                            <div>
                              <strong>{item.boardingStopCode}</strong> {item.boardingDeparture} →{' '}
                              <strong>{item.destinationStopCode}</strong> {item.destinationArrival}
                            </div>
                            <div className="text-[11px] font-sans text-slate-600 dark:text-slate-300 mt-0.5">
                              {item.boardingStopName} → {item.destinationStopName}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            <div>{item.segmentDistanceKm.toLocaleString('en-IN')} km</div>
                            <div className="text-[11px] font-sans text-slate-500 dark:text-slate-400">
                              {item.stopsBetween === 0
                                ? 'Non-stop segment'
                                : `${item.stopsBetween} intermediate ${item.stopsBetween === 1 ? 'halt' : 'halts'}`}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap">
                            {item.runningDays.length === 7 ? 'Daily' : item.runningDays.join(', ')}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {item.primaryAvailability ? (
                              <AvailabilityLabel
                                status={item.primaryAvailability.status}
                                statusText={`${item.primaryAvailability.travelClass} · ${item.primaryAvailability.statusText}`}
                              />
                            ) : (
                              <span className="text-xs text-slate-400">N/A</span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <button
                                type="button"
                                onClick={() => onSelectTrainForMonitor(item.trainNumber)}
                                className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                              >
                                History
                              </button>
                              <button
                                type="button"
                                onClick={() => onSelectTrainForPrediction(item.trainNumber)}
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" />
                                Predict
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.primaryAvailability) {
                                    togglePinTrain({
                                      trainNumber: item.trainNumber,
                                      trainName: item.trainName,
                                      sourceCode: item.boardingStopCode,
                                      destinationCode: item.destinationStopCode,
                                      travelClass: item.primaryAvailability.travelClass,
                                      quota: item.primaryAvailability.quota,
                                    });
                                  }
                                }}
                                className={`inline-flex items-center gap-1 cursor-pointer ${
                                  pinned
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-current' : ''}`} />
                                {pinned ? 'Pinned' : 'Pin'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
