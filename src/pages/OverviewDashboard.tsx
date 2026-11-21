import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, ArrowRight, LocateFixed, Pin, RefreshCw, Search, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PlaceSearchInput } from '../components/PlaceSearchInput';
import { AvailabilityLabel, getDemandColorClass } from '../components/StatusText';
import {
  findNearestPassengerStations,
  requestDeviceCoordinates,
  type NearbyStationMatch,
} from '../utils/nearestStation';
import { computeIstTatkalState, formatCountdown } from '../utils/tatkalRules';

const GLASS_CARD =
  'rounded-2xl bg-white/45 dark:bg-[#081226]/42 backdrop-blur-md border border-slate-900/12 dark:border-white/12';

export const OverviewDashboard: React.FC<{
  onSelectTrainForPrediction: (trainNumber: string) => void;
  onSelectTrainForMonitor: (trainNumber: string) => void;
}> = ({ onSelectTrainForPrediction, onSelectTrainForMonitor }) => {
  const {
    trains,
    stations,
    trainsLoading,
    trainsError,
    refreshTrains,
    pinnedTrains,
    togglePinTrain,
    isTrainPinned,
    setActiveSection,
    setRouteQuery,
  } = useApp();

  const [clock, setClock] = useState(computeIstTatkalState);
  const [quickBoarding, setQuickBoarding] = useState('Delhi');
  const [quickDestination, setQuickDestination] = useState('Mumbai');
  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState<string | null>(null);
  const [detectedNearest, setDetectedNearest] = useState<NearbyStationMatch | null>(null);
  const [destOpenTrigger, setDestOpenTrigger] = useState(0);

  const handleQuickCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBoarding.trim() || !quickDestination.trim()) return;
    setRouteQuery({
      boarding: quickBoarding.trim(),
      destination: quickDestination.trim(),
    });
    setActiveSection('routes');
  };

  const handleDashboardLocate = async () => {
    setLocating(true);
    setLocationMsg(null);
    try {
      const { lat, lng } = await requestDeviceCoordinates();
      const nearest = findNearestPassengerStations(lat, lng, stations, 1);
      if (nearest.length === 0) {
        setLocationMsg('Station directory is loading. Try again shortly.');
        return;
      }
      setDetectedNearest(nearest[0]);
      setQuickBoarding(nearest[0].station.name);
      setQuickDestination('');
      setDestOpenTrigger((prev) => prev + 1);
    } catch (err) {
      setLocationMsg(err instanceof Error ? err.message : 'Unable to get device location.');
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    const id = window.setInterval(() => setClock(computeIstTatkalState()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const passengerTrains = useMemo(
    () => trains.filter((t) => t.serviceType === 'PASSENGER'),
    [trains]
  );

  const openCount = useMemo(() => {
    let count = 0;
    for (const t of passengerTrains) {
      for (const a of t.availability) {
        if (a.status === 'AVAILABLE') count += 1;
      }
    }
    return count;
  }, [passengerTrains]);

  if (trainsLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/25 dark:bg-white/5" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-white/25 dark:bg-white/5" />
      </div>
    );
  }

  if (trainsError) {
    return (
      <div className={`${GLASS_CARD} p-6 space-y-3`}>
        <h2 className="text-base font-semibold text-rose-600 dark:text-rose-400">
          Unable to load train data
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">{trainsError}</p>
        <button
          type="button"
          onClick={refreshTrains}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Friendly Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Live Tatkal & Train Intelligence
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200/85 mt-1 font-mono tabular-nums">
            {clock.istTimeString} · {clock.istDateString}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSection('predictions')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Check Waitlist Chances
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('search')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/45 dark:bg-white/10 hover:bg-white/65 dark:hover:bg-white/15 border border-slate-900/12 dark:border-white/15 text-slate-900 dark:text-white backdrop-blur-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            Search Trains
          </button>
        </div>
      </div>

      {/* 3 Simple Transparent Glass KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${GLASS_CARD} p-5`}>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            AC Tatkal Window (10:00 AM IST)
          </div>
          <div className="mt-2 font-mono text-3xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
            {clock.acWindowStatus === 'OPEN' ? 'OPEN NOW' : formatCountdown(clock.secondsToAcOpen)}
          </div>
          <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-300/80">
            1A, 2A, 3A, 3E, CC, EC · {clock.nextAcOpenLabel}
          </div>
        </div>

        <div className={`${GLASS_CARD} p-5`}>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Non-AC Tatkal Window (11:00 AM IST)
          </div>
          <div className="mt-2 font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {clock.nonAcWindowStatus === 'OPEN' ? 'OPEN NOW' : formatCountdown(clock.secondsToNonAcOpen)}
          </div>
          <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-300/80">
            Sleeper (SL) & 2S · {clock.nextNonAcOpenLabel}
          </div>
        </div>

        <div className={`${GLASS_CARD} p-5`}>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Available Seat Classes Right Now
          </div>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {openCount}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              across {passengerTrains.length} monitored trains
            </span>
          </div>
          <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-300/80">
            {pinnedTrains.length} pinned to your browser watchlist
          </div>
        </div>
      </div>

      {/* Quick Boarding → Destination Train Count Bar */}
      <form
        onSubmit={handleQuickCountSubmit}
        className={`${GLASS_CARD} p-4 sm:p-5 space-y-3 relative z-20`}
      >
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          <div className="flex-1 min-w-0">
            <PlaceSearchInput
              id="quick-boarding-input"
              label="Boarding Place Name"
              labelAction={
                <button
                  type="button"
                  onClick={handleDashboardLocate}
                  disabled={locating}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  {locating ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <LocateFixed className="w-3 h-3" />
                  )}
                  {locating ? 'Locating...' : 'Use My Location'}
                </button>
              }
              value={quickBoarding}
              onChange={(val) => {
                setQuickBoarding(val);
                setLocationMsg(null);
              }}
              stations={stations}
              placeholder="Browse or type any boarding place..."
              compact
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setQuickBoarding(quickDestination);
              setQuickDestination(quickBoarding);
            }}
            aria-label="Swap boarding and destination"
            className="h-[38px] w-full lg:w-[38px] flex items-center justify-center rounded-xl bg-white/45 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/15 border border-slate-900/12 dark:border-white/15 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <PlaceSearchInput
              id="quick-destination-input"
              label="Destination Place Name"
              value={quickDestination}
              onChange={setQuickDestination}
              onSelectPlace={(chosen) => {
                if (quickBoarding.trim()) {
                  setRouteQuery({
                    boarding: quickBoarding.trim(),
                    destination: chosen,
                  });
                  setActiveSection('routes');
                }
              }}
              stations={stations}
              placeholder={
                detectedNearest && !quickDestination
                  ? 'Now pick your destination place...'
                  : 'Browse or type any destination place...'
              }
              autoOpenTrigger={destOpenTrigger}
              compact
            />
          </div>

          <button
            type="submit"
            className="h-[38px] inline-flex items-center justify-center gap-2 px-4 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            Count Trains
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {locationMsg && (
          <div className="text-xs text-rose-600 dark:text-rose-400">{locationMsg}</div>
        )}

        {detectedNearest && !locationMsg && (
          <div className="text-xs text-slate-700 dark:text-slate-200">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Nearest station set:
            </span>{' '}
            <span className="font-semibold">
              {detectedNearest.station.name} ({detectedNearest.station.code})
            </span>{' '}
            <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
              · {detectedNearest.distanceKm.toLocaleString('en-IN')} km away
            </span>
            {!quickDestination && (
              <span className="ml-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                — Now select your Destination Place to search live trains.
              </span>
            )}
          </div>
        )}
      </form>

      {/* Pinned Trains Strip (if any) */}
      {pinnedTrains.length > 0 && (
        <section className={`${GLASS_CARD} p-5 space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Your Pinned Trains
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-300">
              Saved locally in this browser
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pinnedTrains.map((pin) => {
              const live = trains.find((t) => t.trainNumber === pin.trainNumber);
              const av = live?.availability[0];
              return (
                <div
                  key={pin.id}
                  className="p-3.5 rounded-xl bg-white/35 dark:bg-white/6 border border-slate-900/10 dark:border-white/10 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {pin.trainNumber} · {pin.sourceCode}→{pin.destinationCode}
                      </div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {pin.trainName}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePinTrain(pin)}
                      aria-label={`Unpin ${pin.trainNumber}`}
                      className="text-blue-600 dark:text-blue-400 hover:opacity-75 cursor-pointer shrink-0"
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    {av ? (
                      <AvailabilityLabel status={av.status} statusText={`${av.travelClass} · ${av.statusText}`} />
                    ) : (
                      <span className="text-slate-400">Live</span>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectTrainForPrediction(pin.trainNumber)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                    >
                      Predict
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Clean Transparent Live Train Board */}
      <section className={`${GLASS_CARD} overflow-hidden`}>
        <div className="px-5 py-4 border-b border-slate-900/10 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
              Popular Indian Trains — Live Availability
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300/80 mt-0.5">
              Click History for seat depletion trends or Predict to check waitlist confirmation odds
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('tatkal')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
          >
            All Tatkal Feeds
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
                <th className="py-3 px-5 font-medium">Train</th>
                <th className="py-3 px-3 font-medium">Schedule</th>
                <th className="py-3 px-3 font-medium">Class / Quota</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Demand</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/8 dark:divide-white/8 text-sm">
              {passengerTrains.map((train) => {
                const primary = train.availability[0];
                const pinned = isTrainPinned(train.trainNumber);
                return (
                  <tr
                    key={train.trainNumber}
                    className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-slate-900 dark:text-white">
                        <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400 mr-2">
                          {train.trainNumber}
                        </span>
                        {train.trainName}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {train.sourceCode} {train.departureTime} → {train.destinationCode} {train.arrivalTime}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {primary ? `${primary.travelClass} / ${primary.quota}` : '—'}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {primary ? (
                        <AvailabilityLabel status={primary.status} statusText={primary.statusText} />
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`text-xs font-medium ${getDemandColorClass(train.demandLevel)}`}>
                        {train.demandLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-3 text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => onSelectTrainForMonitor(train.trainNumber)}
                          className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        >
                          History
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectTrainForPrediction(train.trainNumber)}
                          className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Predict
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (primary) {
                              togglePinTrain({
                                trainNumber: train.trainNumber,
                                trainName: train.trainName,
                                sourceCode: train.sourceCode,
                                destinationCode: train.destinationCode,
                                travelClass: primary.travelClass,
                                quota: primary.quota,
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
    </div>
  );
};
