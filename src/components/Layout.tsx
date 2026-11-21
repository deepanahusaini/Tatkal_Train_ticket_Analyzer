import React, { useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MapPin,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useApp, type NavSection } from '../contexts/AppContext';
import { formatProvenanceLabel } from './StatusText';

const BACKDROP_URL = '/src/assets/images/railway_train_backdrop_1795191386484.jpg';
const BRAND_ICON_URL = '/src/assets/images/railway_brand_icon_1795191471657.jpg';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routes', label: 'Route Count', icon: ArrowLeftRight },
  { id: 'search', label: 'Train Search', icon: Search },
  { id: 'tatkal', label: 'Tatkal Live', icon: Activity },
  { id: 'predictions', label: 'AI Predict', icon: Sparkles },
  { id: 'tracking', label: 'Live Map', icon: MapPin },
];

const SECTION_TITLES: Record<NavSection, string> = {
  overview: 'Dashboard',
  routes: 'Trains Between Places',
  search: 'Train Search',
  tatkal: 'Tatkal Live & History',
  predictions: 'AI Waitlist Prediction',
  tracking: 'Live Train Tracking',
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeSection,
    setActiveSection,
    globalSearchQuery,
    setGlobalSearchQuery,
    theme,
    toggleTheme,
    wsStatus,
    provenance,
    toastMessage,
  } = useApp();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSection('search');
  };

  return (
    <div className="relative min-h-screen flex text-slate-900 dark:text-slate-100">
      {/* Full-Viewport Scenic Indian Railway Train Background + Contrast Scrim */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none select-none">
        <img
          src={BACKDROP_URL}
          alt="Indian express train gliding across a scenic viaduct at twilight"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-[1.01]"
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-300 bg-gradient-to-br from-slate-100/75 via-slate-50/68 to-blue-50/72 dark:from-[#040812]/72 dark:via-[#071021]/60 dark:to-[#040915]/76"
      />

      {/* Minimal Translucent Sidebar (Slim Icon Rail by default, expandable) */}
      <aside
        className={`hidden md:flex md:flex-col shrink-0 sticky top-0 h-screen z-30 border-r border-slate-900/10 dark:border-white/10 bg-white/35 dark:bg-[#071020]/38 backdrop-blur-xl transition-[width] duration-200 ${
          sidebarExpanded ? 'w-52' : 'w-[70px]'
        }`}
      >
        {/* Railway Website Icon + Brand */}
        <div className="h-16 flex items-center justify-center px-3 border-b border-slate-900/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveSection('overview')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
            title="RailPulse AI"
          >
            <img
              src={BRAND_ICON_URL}
              alt="RailPulse AI railway icon"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-900/15 dark:border-white/20 shrink-0 shadow-xs"
            />
            {sidebarExpanded && (
              <span className="font-display font-bold text-sm tracking-tight whitespace-nowrap truncate text-slate-900 dark:text-white">
                RailPulse AI
              </span>
            )}
          </button>
        </div>

        {/* 5 Minimal Nav Controls */}
        <nav className="flex-1 flex flex-col gap-1.5 p-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                title={item.label}
                className={`group flex items-center ${
                  sidebarExpanded ? 'justify-start px-3' : 'justify-center px-0'
                } h-11 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {sidebarExpanded && <span className="ml-3 truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Controls: Theme + Collapse/Expand */}
        <div className="p-2.5 border-t border-slate-900/10 dark:border-white/10 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`flex items-center ${
              sidebarExpanded ? 'justify-start px-3' : 'justify-center'
            } h-10 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {sidebarExpanded && (
              <span className="ml-3">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSidebarExpanded((prev) => !prev)}
            title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`flex items-center ${
              sidebarExpanded ? 'justify-start px-3' : 'justify-center'
            } h-10 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap`}
          >
            {sidebarExpanded ? (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="ml-3">Minimal</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Over Minimal Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-60 max-w-[80vw] bg-white/85 dark:bg-[#081122]/85 backdrop-blur-xl border-r border-slate-900/10 dark:border-white/15 flex flex-col z-10">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src={BRAND_ICON_URL}
                  alt="RailPulse AI railway icon"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <span className="font-display font-bold text-sm">RailPulse AI</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-lg text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Transparent Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Transparent Top Header */}
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 border-b border-slate-900/10 dark:border-white/10 bg-white/30 dark:bg-[#071020]/35 backdrop-blur-xl">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/10 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img
              src={BRAND_ICON_URL}
              alt="RailPulse AI"
              referrerPolicy="no-referrer"
              className="md:hidden w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
            />
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="font-display font-bold text-slate-900 dark:text-white whitespace-nowrap shrink-0">
                RailPulse AI
              </span>
              <span className="text-slate-400 dark:text-slate-500">/</span>
              <h1 className="font-medium text-slate-700 dark:text-slate-200 truncate">
                {SECTION_TITLES[activeSection]}
              </h1>
            </div>
          </div>

          <form onSubmit={handleGlobalSearchSubmit} className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search train no., name, or station (12952, NDLS)..."
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-xl bg-white/45 dark:bg-white/8 border border-slate-900/12 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <span className="hidden lg:inline text-amber-700 dark:text-amber-300 font-medium whitespace-nowrap">
              {formatProvenanceLabel(provenance)}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  wsStatus === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                aria-hidden="true"
              />
              {wsStatus === 'CONNECTED' ? 'Live' : 'Syncing'}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light or dark theme"
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/10 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Workspace Viewport */}
        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          {children}
        </main>
      </div>

      {/* Transient Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-xl bg-slate-900/85 dark:bg-white/90 text-white dark:text-slate-900 backdrop-blur-md text-sm font-medium shadow-lg border border-white/15 dark:border-slate-900/15"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
