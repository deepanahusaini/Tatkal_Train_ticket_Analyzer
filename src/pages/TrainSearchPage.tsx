import React, { useMemo, useState } from 'react';
import { Pin, Search, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AvailabilityLabel, getDemandColorClass } from '../components/StatusText';
import type { QuotaCode, TravelClass } from '../types/railway';

const GLASS_CARD =
  'rounded-2xl bg-white/45 dark:bg-[#081226]/42 backdrop-blur-md border border-slate-900/12 dark:border-white/12';

const GLASS_INPUT =
  'w-full px-3 py-2 text-sm rounded-xl bg-white/55 dark:bg-[#050C1A]/55 border border-slate-900/12 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50';

export const TrainSearchPage: React.FC<{
  onSelectTrainForPrediction: (trainNumber: string) => void;
  onSelectTrainForMonitor: (trainNumber: string) => void;
}> = ({ onSelectTrainForPrediction, onSelectTrainForMonitor }) => {
  const {
    trains,
    stations,
    globalSearchQuery,
    setGlobalSearchQuery,
    togglePinTrain,
    isTrainPinned,
  } = useApp();

  const [source, setSource] = useState('ALL');
  const [destination, setDestination] = useState('ALL');
  const [travelClass, setTravelClass] = useState<'ALL' | TravelClass>('ALL');
  const [quota, setQuota] = useState<'ALL' | QuotaCode>('ALL');

  const filteredTrains = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    return trains
      .filter((t) => t.serviceType === 'PASSENGER')
      .filter((t) => {
        if (q) {
          const hit =
            t.trainNumber.toLowerCase().includes(q) ||
            t.trainName.toLowerCase().includes(q) ||
            t.sourceCode.toLowerCase().includes(q) ||
            t.sourceName.toLowerCase().includes(q) ||
            t.destinationCode.toLowerCase().includes(q) ||
            t.destinationName.toLowerCase().includes(q);
          if (!hit) return false;
        }
        if (source !== 'ALL' && t.sourceCode !== source && !t.stops.some((s) => s.stationCode === source)) {
          return false;
        }
        if (
          destination !== 'ALL' &&
          t.destinationCode !== destination &&
          !t.stops.some((s) => s.stationCode === destination)
        ) {
          return false;
        }
        if (travelClass !== 'ALL' && !t.classes.includes(travelClass)) return false;
        if (quota !== 'ALL' && !t.availability.some((a) => a.quota === quota)) return false;
        return true;
      });
  }, [trains, globalSearchQuery, source, destination, travelClass, quota]);

  const passengerStations = useMemo(
    () => stations.filter((s) => !s.zone.includes('DFC')),
    [stations]
  );

  const resetFilters = () => {
    setGlobalSearchQuery('');
    setSource('ALL');
    setDestination('ALL');
    setTravelClass('ALL');
    setQuota('ALL');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Find Trains & Seat Availability
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200/80 mt-1 font-mono tabular-nums">
          Showing {filteredTrains.length} passenger trains
        </p>
      </div>

      {/* Simple Filter Bar */}
      <div className={`${GLASS_CARD} p-5`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Train Name / Number
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="12952 or Rajdhani"
                className={`${GLASS_INPUT} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              From Station
            </label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className={GLASS_INPUT}>
              <option value="ALL">Any Origin</option>
              {passengerStations.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              To Station
            </label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className={GLASS_INPUT}>
              <option value="ALL">Any Destination</option>
              {passengerStations.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Class & Quota
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value as 'ALL' | TravelClass)}
                className={`${GLASS_INPUT} font-mono text-xs`}
              >
                <option value="ALL">All</option>
                {(['1A', '2A', '3A', '3E', 'CC', 'EC', 'SL', '2S'] as TravelClass[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value as 'ALL' | QuotaCode)}
                className={`${GLASS_INPUT} font-mono text-xs`}
              >
                <option value="ALL">All</option>
                <option value="TQ">TQ</option>
                <option value="PT">PT</option>
                <option value="GN">GN</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/45 dark:bg-white/10 hover:bg-white/65 dark:hover:bg-white/15 border border-slate-900/12 dark:border-white/15 text-slate-800 dark:text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredTrains.length === 0 ? (
        <div className={`${GLASS_CARD} p-10 text-center space-y-3`}>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            No trains matched your search filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            Show All Trains
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrains.map((train) => {
            const pinned = isTrainPinned(train.trainNumber);
            const primary = train.availability[0];
            return (
              <article key={train.trainNumber} className={`${GLASS_CARD} p-5 space-y-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {train.trainNumber}
                      </span>
                      <span>·</span>
                      <span>{train.category}</span>
                      <span>·</span>
                      <span className={getDemandColorClass(train.demandLevel)}>
                        {train.demandLevel} Demand
                      </span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{train.punctualityPercent}% On-Time</span>
                    </div>
                    <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white mt-0.5">
                      {train.trainName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-5 font-mono tabular-nums text-sm">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{train.departureTime}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">{train.sourceCode}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-600 dark:text-slate-300">{train.durationLabel}</div>
                      <div className="w-16 h-px bg-slate-400/50 my-1" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{train.arrivalTime}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">{train.destinationCode}</div>
                    </div>
                  </div>
                </div>

                {/* Availability Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-900/10 dark:border-white/10">
                  {train.availability.map((av) => (
                    <div
                      key={`${train.trainNumber}_${av.travelClass}_${av.quota}`}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/35 dark:bg-white/6 border border-slate-900/8 dark:border-white/8"
                    >
                      <div>
                        <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                          {av.travelClass} · {av.quota}
                        </div>
                        <div className="text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {av.fareInr ? `₹${av.fareInr.toLocaleString('en-IN')}` : 'Fare N/A'}
                        </div>
                      </div>
                      <AvailabilityLabel status={av.status} statusText={av.statusText} />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <span className="text-slate-600 dark:text-slate-300">
                    Runs: {train.runningDays.join(', ')}
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onSelectTrainForMonitor(train.trainNumber)}
                      className="font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                    >
                      View History
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTrainForPrediction(train.trainNumber)}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Predict Waitlist
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
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                        pinned
                          ? 'bg-blue-600/20 text-blue-700 dark:text-blue-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-current' : ''}`} />
                      {pinned ? 'Pinned' : 'Pin Train'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
