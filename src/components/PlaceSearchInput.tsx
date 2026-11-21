import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, MapPin, X } from 'lucide-react';
import type { Station } from '../types/railway';

export interface PlaceOption {
  id: string;
  label: string;
  sublabel: string;
  value: string;
  type: 'CITY' | 'STATION';
  searchKey: string;
}

interface PlaceSearchInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (nextVal: string) => void;
  onSelectPlace?: (selectedVal: string) => void;
  stations: Station[];
  placeholder?: string;
  compact?: boolean;
  labelAction?: React.ReactNode;
  autoOpenTrigger?: number;
}

const CITY_SEARCH_ALIASES: Record<string, string> = {
  bengaluru: 'bangalore blr',
  mumbai: 'bombay bom csmt vt',
  kolkata: 'calcutta ccu howrah sealdah',
  chennai: 'madras maa',
  prayagraj: 'allahabad ald',
  varanasi: 'banaras benaras kashi',
  vadodara: 'baroda',
  pune: 'poona',
  hyderabad: 'secunderabad hyd',
  lucknow: 'charbagh ljn',
  thiruvananthapuram: 'trivandrum',
  kochi: 'cochin ernakulam',
  kozhikode: 'calicut',
  visakhapatnam: 'vizag',
  mysuru: 'mysore',
  mangaluru: 'mangalore',
  hubballi: 'hubli',
  goa: 'madgaon margao panjim panaji',
  delhi: 'ncr new delhi nizamuddin anand vihar',
  trichy: 'tiruchchirappalli',
  siliguri: 'darjeeling njp',
};

export const PlaceSearchInput: React.FC<PlaceSearchInputProps> = ({
  id,
  label,
  value,
  onChange,
  onSelectPlace,
  stations,
  placeholder = 'Type or pick any city / station...',
  compact = false,
  labelAction,
  autoOpenTrigger = 0,
}) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoOpenTrigger > 0) {
      setOpen(true);
      setIsTyping(false);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    }
  }, [autoOpenTrigger]);

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setIsTyping(false);
      }
    };
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  // Build complete pan-India list: ALL unique cities first (alphabetical), then ALL stations
  const allOptions = useMemo<PlaceOption[]>(() => {
    const passengerStations = stations.filter((s) => !s.zone.includes('DFC'));
    const cityMap = new Map<string, string[]>();

    for (const st of passengerStations) {
      const existing = cityMap.get(st.city) || [];
      existing.push(st.code);
      cityMap.set(st.city, existing);
    }

    const cities: PlaceOption[] = Array.from(cityMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([city, codes]) => {
        const aliasExtra = CITY_SEARCH_ALIASES[city.toLowerCase()] || '';
        return {
          id: `city_${city}`,
          label: city,
          sublabel: codes.length > 1 ? `All stations (${codes.join(', ')})` : codes[0],
          value: city,
          type: 'CITY',
          searchKey: `${city} ${codes.join(' ')} ${aliasExtra}`.toLowerCase(),
        };
      });

    const stationList: PlaceOption[] = passengerStations
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((st) => {
        const aliasExtra = CITY_SEARCH_ALIASES[st.city.toLowerCase()] || '';
        return {
          id: `st_${st.code}`,
          label: `${st.name} (${st.code})`,
          sublabel: `${st.city} · ${st.zone}`,
          value: st.name,
          type: 'STATION',
          searchKey: `${st.name} ${st.code} ${st.city} ${aliasExtra}`.toLowerCase(),
        };
      });

    return [...cities, ...stationList];
  }, [stations]);

  // Crucial UX fix: when focused without typing yet, show ALL places so the user can browse every Indian city/station.
  // Once the user types, filter the complete list live with zero arbitrary 8-item cutoff.
  const filteredOptions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!isTyping || !q) {
      return allOptions;
    }
    return allOptions.filter((opt) => opt.searchKey.includes(q));
  }, [allOptions, value, isTyping]);

  const cityMatches = useMemo(
    () => filteredOptions.filter((o) => o.type === 'CITY'),
    [filteredOptions]
  );
  const stationMatches = useMemo(
    () => filteredOptions.filter((o) => o.type === 'STATION'),
    [filteredOptions]
  );

  const handleChoose = (chosenVal: string) => {
    onChange(chosenVal);
    setOpen(false);
    setIsTyping(false);
    onSelectPlace?.(chosenVal);
  };

  const handleClear = () => {
    onChange('');
    setIsTyping(true);
    setOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center justify-between gap-2 ${compact ? 'mb-1' : 'mb-1.5'}`}>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap"
        >
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onFocus={() => {
            setOpen(true);
            setIsTyping(false);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setIsTyping(true);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
              setIsTyping(false);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full ${
            compact ? 'pl-3 pr-14 py-2' : 'pl-3.5 pr-14 py-2.5'
          } text-sm rounded-xl bg-white/55 dark:bg-[#050C1A]/55 border border-slate-900/12 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={`Clear ${label}`}
              className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen((prev) => !prev);
              setIsTyping(false);
              inputRef.current?.focus();
            }}
            aria-label={`Browse all places for ${label}`}
            className="p-1 rounded-md text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl bg-white/96 dark:bg-[#0B162C]/96 backdrop-blur-xl border border-slate-900/15 dark:border-white/18 shadow-xl overflow-hidden">
          <div className="px-3.5 py-2 border-b border-slate-900/10 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <span>
              {isTyping && value.trim()
                ? `${filteredOptions.length} matching places`
                : `All ${cityMatches.length} cities & ${stationMatches.length} stations`}
            </span>
            <span className="text-slate-400 dark:text-slate-400">Type any place name</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-900/6 dark:divide-white/6">
            {/* Custom typed place option when user enters any place not exactly in list */}
            {isTyping &&
              value.trim().length >= 2 &&
              !allOptions.some(
                (o) =>
                  o.value.toLowerCase() === value.trim().toLowerCase() ||
                  o.label.toLowerCase() === value.trim().toLowerCase()
              ) && (
                <button
                  type="button"
                  onClick={() => handleChoose(value.trim())}
                  className="w-full text-left px-3.5 py-2.5 bg-blue-50/70 dark:bg-blue-500/15 hover:bg-blue-100/80 dark:hover:bg-blue-500/25 transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    Search &ldquo;{value.trim()}&rdquo;
                  </span>
                  <span className="text-[11px] text-blue-600/80 dark:text-blue-300/80 whitespace-nowrap shrink-0">
                    Custom place
                  </span>
                </button>
              )}

            {cityMatches.length > 0 && (
              <div>
                <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-white/5 sticky top-0 backdrop-blur-md">
                  Cities ({cityMatches.length})
                </div>
                {cityMatches.map((opt) => {
                  const selected = value.trim().toLowerCase() === opt.value.toLowerCase();
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChoose(opt.value)}
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        selected
                          ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-blue-600/10 dark:hover:bg-white/10 text-slate-900 dark:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium truncate">{opt.label}</span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                        {opt.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {stationMatches.length > 0 && (
              <div>
                <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-white/5 sticky top-0 backdrop-blur-md">
                  Railway Stations ({stationMatches.length})
                </div>
                {stationMatches.map((opt) => {
                  const selected = value.trim().toLowerCase() === opt.value.toLowerCase();
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChoose(opt.value)}
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        selected
                          ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-blue-600/10 dark:hover:bg-white/10 text-slate-900 dark:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium truncate">{opt.label}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                        {opt.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
