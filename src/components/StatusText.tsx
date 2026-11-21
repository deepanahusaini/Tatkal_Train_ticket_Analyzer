import React from 'react';
import type { AvailabilityStatus, DataProvenance } from '../types/railway';

export function getStatusColorClass(status: AvailabilityStatus): string {
  switch (status) {
    case 'AVAILABLE':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'RAC':
      return 'text-amber-600 dark:text-amber-400';
    case 'WAITLIST':
      return 'text-orange-600 dark:text-orange-400';
    case 'REGRET':
      return 'text-rose-600 dark:text-rose-400';
    case 'NOT AVAILABLE':
    case 'DATA UNAVAILABLE':
    default:
      return 'text-slate-500 dark:text-slate-400';
  }
}

export function getDemandColorClass(demand: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'): string {
  switch (demand) {
    case 'LOW':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'MODERATE':
      return 'text-blue-600 dark:text-blue-400';
    case 'HIGH':
      return 'text-amber-600 dark:text-amber-400';
    case 'CRITICAL':
      return 'text-rose-600 dark:text-rose-400';
  }
}

export function formatProvenanceLabel(provenance: DataProvenance): string {
  switch (provenance) {
    case 'AUTHORIZED_API':
      return 'Authorized Live Feed';
    case 'CACHED':
      return 'Cached Snapshot';
    case 'HISTORICAL':
      return 'Historical Archive';
    case 'AI_PREDICTION':
      return 'AI Statistical Estimate';
    case 'DEMO_SIMULATED':
    default:
      return 'DEMO MODE · Simulated Feed';
  }
}

export const AvailabilityLabel: React.FC<{
  status: AvailabilityStatus;
  statusText: string;
}> = ({ status, statusText }) => {
  return (
    <span className={`font-mono text-xs font-semibold tabular-nums whitespace-nowrap ${getStatusColorClass(status)}`}>
      {statusText}
    </span>
  );
};

export const ProvenanceInline: React.FC<{ provenance: DataProvenance }> = ({ provenance }) => {
  const color =
    provenance === 'AUTHORIZED_API'
      ? 'text-emerald-600 dark:text-emerald-400'
      : provenance === 'AI_PREDICTION'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-amber-600 dark:text-amber-400';

  return (
    <span className={`text-xs font-medium whitespace-nowrap ${color}`}>
      {formatProvenanceLabel(provenance)}
    </span>
  );
};
