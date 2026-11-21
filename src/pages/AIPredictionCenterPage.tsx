import React, { useEffect, useMemo, useState } from 'react';
import { Info, RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getFutureDateIso } from '../utils/tatkalRules';
import type { QuotaCode, TravelClass, WaitlistPredictionResult } from '../types/railway';

const GLASS_CARD =
  'rounded-2xl bg-white/45 dark:bg-[#081226]/42 backdrop-blur-md border border-slate-900/12 dark:border-white/12';

const GLASS_INPUT =
  'w-full px-3 py-2 text-sm rounded-xl bg-white/55 dark:bg-[#050C1A]/55 border border-slate-900/12 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50';

export const AIPredictionCenterPage: React.FC<{
  initialTrainNumber?: string;
}> = ({ initialTrainNumber }) => {
  const { trains } = useApp();
  const passengerTrains = useMemo(
    () => trains.filter((t) => t.serviceType === 'PASSENGER'),
    [trains]
  );

  const [trainNumber, setTrainNumber] = useState(initialTrainNumber || '12952');
  const [travelDate, setTravelDate] = useState(getFutureDateIso(3));
  const [travelClass, setTravelClass] = useState<TravelClass>('3A');
  const [quota, setQuota] = useState<QuotaCode>('TQ');
  const [waitlistType, setWaitlistType] = useState<'GNWL' | 'TQWL' | 'RLWL' | 'PQWL' | 'RAC'>('TQWL');
  const [waitlistNumber, setWaitlistNumber] = useState(14);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WaitlistPredictionResult | null>(null);

  useEffect(() => {
    if (initialTrainNumber) setTrainNumber(initialTrainNumber);
  }, [initialTrainNumber]);

  const runPrediction = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/predictions/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainNumber,
          travelDate,
          travelClass,
          quota,
          waitlistType,
          waitlistNumber,
          includeAiExplanation: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
      setResult(json as WaitlistPredictionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to estimate confirmation odds.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const probColor =
    (result?.confirmationProbability ?? 0) >= 75
      ? 'text-emerald-600 dark:text-emerald-400'
      : (result?.confirmationProbability ?? 0) >= 45
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          AI Waitlist Confirmation Predictor
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200/80 mt-1">
          Enter your train, date, and waitlist number to estimate confirmation chances
        </p>
      </div>

      {/* Simple Prediction Form */}
      <form onSubmit={runPrediction} className={`${GLASS_CARD} p-5`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Train
            </label>
            <select
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className={GLASS_INPUT}
            >
              {passengerTrains.map((t) => (
                <option key={t.trainNumber} value={t.trainNumber}>
                  {t.trainNumber} — {t.trainName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Journey Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={`${GLASS_INPUT} font-mono`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Class & Quota
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value as TravelClass)}
                className={`${GLASS_INPUT} font-mono text-xs px-2`}
              >
                {(['1A', '2A', '3A', '3E', 'CC', 'EC', 'SL', '2S'] as TravelClass[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={quota}
                onChange={(e) => {
                  const q = e.target.value as QuotaCode;
                  setQuota(q);
                  if (q === 'TQ') setWaitlistType('TQWL');
                  else if (q === 'GN') setWaitlistType('GNWL');
                }}
                className={`${GLASS_INPUT} font-mono text-xs px-2`}
              >
                <option value="TQ">TQ</option>
                <option value="PT">PT</option>
                <option value="GN">GN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Waitlist Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={waitlistType}
                onChange={(e) => setWaitlistType(e.target.value as typeof waitlistType)}
                className={`${GLASS_INPUT} font-mono text-xs px-2`}
              >
                <option value="TQWL">TQWL</option>
                <option value="GNWL">GNWL</option>
                <option value="RLWL">RLWL</option>
                <option value="PQWL">PQWL</option>
                <option value="RAC">RAC</option>
              </select>
              <input
                type="number"
                min={0}
                max={300}
                value={waitlistNumber}
                onChange={(e) => setWaitlistNumber(Math.max(0, Math.min(300, Number(e.target.value) || 0)))}
                className={`${GLASS_INPUT} font-mono tabular-nums text-xs px-2`}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Estimating...' : 'Predict'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-sm text-rose-700 dark:text-rose-200 backdrop-blur-md">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Probability Score Card */}
          <section className={`${GLASS_CARD} p-6 space-y-4`}>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Estimated Confirmation Chance
            </div>
            <div className="flex items-baseline gap-3">
              <span className={`font-mono text-5xl font-bold tabular-nums ${probColor}`}>
                {result.confirmationProbability}%
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                Range {result.confidenceInterval[0]}%–{result.confidenceInterval[1]}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900/10 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  result.confirmationProbability >= 75
                    ? 'bg-emerald-500'
                    : result.confirmationProbability >= 45
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${result.confirmationProbability}%` }}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-900/10 dark:border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Outlook</span>
                <span className="font-semibold text-slate-900 dark:text-white">{result.expectedFinalStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Confidence</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{result.confidenceLevel}</span>
              </div>
            </div>
          </section>

          {/* Explanation & Key Factors */}
          <section className={`${GLASS_CARD} lg:col-span-2 p-6 space-y-4`}>
            <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
              Why This Estimate?
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
              {result.aiExplanation ? result.aiExplanation.summary : result.recommendation}
            </p>

            {result.aiExplanation && result.aiExplanation.tacticalAdvice.length > 0 && (
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 list-disc pl-4">
                {result.aiExplanation.tacticalAdvice.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900/10 dark:border-white/10">
              {result.factors.slice(0, 4).map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/35 dark:bg-white/6 border border-slate-900/8 dark:border-white/8 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 font-medium text-slate-900 dark:text-white">
                    <span className="truncate">{f.name}</span>
                    <span
                      className={`font-mono font-semibold tabular-nums shrink-0 ${
                        f.impact >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {f.impact >= 0 ? `+${f.impact}` : f.impact}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{f.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300/80 pt-1">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{result.disclaimer}</span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
