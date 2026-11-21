import React, { useMemo, useState } from 'react';
import { Gauge, MapPin, Navigation } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const GLASS_CARD =
  'rounded-2xl bg-white/45 dark:bg-[#081226]/42 backdrop-blur-md border border-slate-900/12 dark:border-white/12';

function projectIndia(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 68) / (92 - 68)) * 480 + 40;
  const y = ((32 - lat) / (32 - 8)) * 440 + 40;
  return { x, y };
}

const CORRIDOR_LINES: [string, string][] = [
  ['NDLS', 'BRC'],
  ['BRC', 'MMCT'],
  ['NDLS', 'CNB'],
  ['CNB', 'DDU'],
  ['DDU', 'HWH'],
  ['NDLS', 'BPL'],
  ['BPL', 'NGP'],
  ['NGP', 'SC'],
  ['SC', 'SBC'],
  ['SBC', 'MAS'],
  ['HWH', 'NGP'],
  ['NGP', 'CSMT'],
];

export const LiveTrackingPage: React.FC = () => {
  const { trains, stations } = useApp();
  const [selectedTrainNum, setSelectedTrainNum] = useState<string>('12952');

  const activeTrain = useMemo(
    () => trains.find((t) => t.trainNumber === selectedTrainNum) || trains[0] || null,
    [trains, selectedTrainNum]
  );

  const stationByCode = useMemo(() => {
    const map = new Map<string, (typeof stations)[number]>();
    for (const s of stations) map.set(s.code, s);
    return map;
  }, [stations]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Live Train Running Map
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200/80 mt-1">
          Click any train marker on the map to check live location, speed, delay, and next station
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Transparent Corridor Map */}
        <section className={`${GLASS_CARD} xl:col-span-7 p-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Indian Railway Corridor Map
            </h3>
            <div className="flex items-center gap-4 text-xs text-slate-700 dark:text-slate-200">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Passenger
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Freight
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl bg-slate-950/55 border border-white/12">
            <svg
              viewBox="0 0 560 520"
              className="w-full h-[380px] sm:h-[430px]"
              role="img"
              aria-label="Live Indian Railway Corridor Map"
            >
              <path
                d="M175,65 L235,55 L295,95 L345,120 L420,165 L455,215 L425,265 L370,320 L315,395 L265,470 L225,435 L190,345 L135,285 L105,235 L135,190 L125,135 Z"
                fill="rgba(15,23,42,0.45)"
                stroke="rgba(148,163,184,0.3)"
                strokeWidth="1.2"
              />

              {CORRIDOR_LINES.map(([fromCode, toCode], idx) => {
                const a = stationByCode.get(fromCode);
                const b = stationByCode.get(toCode);
                if (!a || !b) return null;
                const p1 = projectIndia(a.lat, a.lng);
                const p2 = projectIndia(b.lat, b.lng);
                return (
                  <line
                    key={idx}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(96,165,250,0.42)"
                    strokeWidth="1.8"
                  />
                );
              })}

              {stations
                .filter((s) =>
                  ['NDLS', 'MMCT', 'HWH', 'MAS', 'SBC', 'SC', 'ADI', 'BPL', 'NGP', 'CNB'].includes(s.code)
                )
                .map((st) => {
                  const pt = projectIndia(st.lat, st.lng);
                  return (
                    <g key={st.code}>
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#CBD5E1" />
                      <text
                        x={pt.x + 6}
                        y={pt.y + 3}
                        fill="#CBD5E1"
                        fontSize="9"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {st.code}
                      </text>
                    </g>
                  );
                })}

              {trains.map((t) => {
                const pt = projectIndia(t.runningStatus.lat, t.runningStatus.lng);
                const isSelected = activeTrain?.trainNumber === t.trainNumber;
                const fill = t.serviceType === 'FREIGHT' ? '#F59E0B' : '#3B82F6';
                return (
                  <g
                    key={t.trainNumber}
                    onClick={() => setSelectedTrainNum(t.trainNumber)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="13"
                        fill="none"
                        stroke={fill}
                        strokeWidth="1.6"
                        opacity="0.8"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 6.5 : 5}
                      fill={fill}
                      stroke="#090E1A"
                      strokeWidth="1.5"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize={isSelected ? '10.5' : '9'}
                      fontWeight={isSelected ? '700' : '500'}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {t.trainNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Live Telemetry Card */}
        <section className={`${GLASS_CARD} xl:col-span-5 p-5 space-y-5 flex flex-col`}>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Choose Train
            </label>
            <select
              value={activeTrain?.trainNumber || ''}
              onChange={(e) => setSelectedTrainNum(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white/55 dark:bg-[#050C1A]/55 border border-slate-900/12 dark:border-white/15 text-slate-900 dark:text-white"
            >
              {trains.map((t) => (
                <option key={t.trainNumber} value={t.trainNumber}>
                  {t.trainNumber} — {t.trainName}
                </option>
              ))}
            </select>
          </div>

          {activeTrain && (
            <>
              <div className="space-y-1.5 pb-4 border-b border-slate-900/10 dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {activeTrain.trainNumber} · {activeTrain.zone}
                  </span>
                  <span
                    className={`font-semibold ${
                      activeTrain.runningStatus.delayMinutes === 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {activeTrain.runningStatus.delayMinutes === 0
                      ? 'On Time'
                      : `Delayed +${activeTrain.runningStatus.delayMinutes}m`}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {activeTrain.trainName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                  <Navigation className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{activeTrain.runningStatus.currentLocation}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/35 dark:bg-white/6">
                  <div className="text-slate-600 dark:text-slate-300">Next Station</div>
                  <div className="font-medium text-slate-900 dark:text-white mt-1 truncate">
                    {activeTrain.runningStatus.nextStation}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/35 dark:bg-white/6">
                  <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    Speed
                  </div>
                  <div className="font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white mt-1">
                    {activeTrain.runningStatus.speedKmh} km/h
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Route Progress</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {activeTrain.runningStatus.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${activeTrain.runningStatus.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pt-2 border-t border-slate-900/10 dark:border-white/10">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Upcoming & Passed Stops
                </div>
                <ol className="space-y-3">
                  {activeTrain.stops.map((stop) => (
                    <li key={stop.stationCode} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            stop.status === 'PASSED'
                              ? 'bg-emerald-500'
                              : stop.status === 'CURRENT'
                                ? 'bg-blue-500 ring-4 ring-blue-500/25'
                                : 'bg-slate-400/50'
                          }`}
                        />
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          <span className="font-mono mr-1.5">{stop.stationCode}</span>
                          {stop.stationName}
                        </span>
                      </div>
                      <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200 shrink-0">
                        {stop.arrivalTime}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
