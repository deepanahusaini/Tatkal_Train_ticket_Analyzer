import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AvailabilityLabel } from '../components/StatusText';
import type { AvailabilityHistoryPoint, AvailabilityStatus, QuotaCode, TravelClass } from '../types/railway';

const GLASS_CARD =
  'rounded-2xl bg-white/45 dark:bg-[#081226]/42 backdrop-blur-md border border-slate-900/12 dark:border-white/12';

export const TatkalMonitorPage: React.FC<{
  initialTrainNumber?: string;
}> = ({ initialTrainNumber }) => {
  const { trains } = useApp();

  const passengerTrains = useMemo(
    () => trains.filter((t) => t.serviceType === 'PASSENGER'),
    [trains]
  );

  const [statusFilter, setStatusFilter] = useState<'ALL' | AvailabilityStatus>('ALL');
  const [selectedRowKey, setSelectedRowKey] = useState<string>(
    initialTrainNumber ? `${initialTrainNumber}_3A_TQ` : '12952_3A_TQ'
  );
  const [historyData, setHistoryData] = useState<AvailabilityHistoryPoint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const flattenedRows = useMemo(() => {
    const rows: {
      key: string;
      trainNumber: string;
      trainName: string;
      corridor: string;
      travelClass: TravelClass;
      quota: QuotaCode;
      status: AvailabilityStatus;
      statusText: string;
      depletionRatePerMin: number;
      fareInr: number | null;
      lastUpdated: string;
    }[] = [];

    for (const train of passengerTrains) {
      for (const av of train.availability) {
        if (statusFilter !== 'ALL' && av.status !== statusFilter) continue;
        rows.push({
          key: `${train.trainNumber}_${av.travelClass}_${av.quota}`,
          trainNumber: train.trainNumber,
          trainName: train.trainName,
          corridor: `${train.sourceCode} → ${train.destinationCode}`,
          travelClass: av.travelClass,
          quota: av.quota,
          status: av.status,
          statusText: av.statusText,
          depletionRatePerMin: av.depletionRatePerMin,
          fareInr: av.fareInr,
          lastUpdated: av.lastUpdated,
        });
      }
    }
    return rows;
  }, [passengerTrains, statusFilter]);

  const activeRow = useMemo(() => {
    const exact = flattenedRows.find((r) => r.key === selectedRowKey);
    if (exact) return exact;
    if (initialTrainNumber) {
      const byTrain = flattenedRows.find((r) => r.trainNumber === initialTrainNumber);
      if (byTrain) return byTrain;
    }
    return flattenedRows[0] || null;
  }, [flattenedRows, selectedRowKey, initialTrainNumber]);

  useEffect(() => {
    if (!activeRow) return;
    let cancelled = false;
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await fetch(
          `/api/trains/${activeRow.trainNumber}/history?travelClass=${activeRow.travelClass}&quota=${activeRow.quota}`
        );
        if (res.ok && !cancelled) {
          const json = await res.json();
          setHistoryData(json.history || []);
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [activeRow?.trainNumber, activeRow?.travelClass, activeRow?.quota, activeRow?.lastUpdated]);

  const statuses: ('ALL' | AvailabilityStatus)[] = [
    'ALL',
    'AVAILABLE',
    'RAC',
    'WAITLIST',
    'REGRET',
    'NOT AVAILABLE',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tatkal Live Status & Seat History
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200/80 mt-1">
            Select any train below to view real-time availability and waitlist movement over time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/40 dark:bg-white/8 border border-slate-900/10 dark:border-white/12 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/15 backdrop-blur-md'
              }`}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Transparent Chart Panel */}
      {activeRow && (
        <section className={`${GLASS_CARD} p-5 space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                <span className="font-bold text-blue-600 dark:text-blue-400">{activeRow.trainNumber}</span>
                <span>·</span>
                <span>{activeRow.corridor}</span>
                <span>·</span>
                <span>{activeRow.travelClass}/{activeRow.quota}</span>
              </div>
              <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white mt-0.5">
                {activeRow.trainName}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
              <AvailabilityLabel status={activeRow.status} statusText={activeRow.statusText} />
              <span className="text-slate-600 dark:text-slate-300">
                {activeRow.depletionRatePerMin.toFixed(1)} seats/min
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {historyLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 dark:text-slate-300">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Loading history...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(8, 18, 38, 0.9)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#F1F5F9',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="availableSeats" name="Available Seats" stroke="#10B981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="waitlistNumber" name="Waitlist" stroke="#F97316" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="racNumber" name="RAC" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      )}

      {/* Live Availability Table */}
      <section className={`${GLASS_CARD} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
                <th className="py-3 px-5 font-medium">Train</th>
                <th className="py-3 px-3 font-medium">Route</th>
                <th className="py-3 px-3 font-medium">Class / Quota</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium text-right">Est. Fare</th>
                <th className="py-3 px-5 font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/8 dark:divide-white/8 text-sm">
              {flattenedRows.map((row) => {
                const isSelected = activeRow?.key === row.key;
                return (
                  <tr
                    key={row.key}
                    onClick={() => setSelectedRowKey(row.key)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600/15 dark:bg-blue-500/20'
                        : 'hover:bg-white/30 dark:hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3 px-5">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mr-2">
                        {row.trainNumber}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">{row.trainName}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {row.corridor}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs whitespace-nowrap">
                      {row.travelClass} / {row.quota}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <AvailabilityLabel status={row.status} statusText={row.statusText} />
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {row.fareInr ? `₹${row.fareInr.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(row.lastUpdated).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
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
