import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AppProvider, useApp } from './contexts/AppContext';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { RouteCountPage } from './pages/RouteCountPage';
import { TrainSearchPage } from './pages/TrainSearchPage';
import { TatkalMonitorPage } from './pages/TatkalMonitorPage';
import { AIPredictionCenterPage } from './pages/AIPredictionCenterPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';

const ActiveWorkspace: React.FC = () => {
  const { activeSection, setActiveSection } = useApp();
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12952');

  const handleOpenPrediction = (trainNumber: string) => {
    setSelectedTrainNumber(trainNumber);
    setActiveSection('predictions');
  };

  const handleOpenMonitor = (trainNumber: string) => {
    setSelectedTrainNumber(trainNumber);
    setActiveSection('tatkal');
  };

  return (
    <Layout>
      {activeSection === 'overview' && (
        <OverviewDashboard
          onSelectTrainForPrediction={handleOpenPrediction}
          onSelectTrainForMonitor={handleOpenMonitor}
        />
      )}
      {activeSection === 'routes' && (
        <RouteCountPage
          onSelectTrainForPrediction={handleOpenPrediction}
          onSelectTrainForMonitor={handleOpenMonitor}
        />
      )}
      {activeSection === 'search' && (
        <TrainSearchPage
          onSelectTrainForPrediction={handleOpenPrediction}
          onSelectTrainForMonitor={handleOpenMonitor}
        />
      )}
      {activeSection === 'tatkal' && (
        <TatkalMonitorPage initialTrainNumber={selectedTrainNumber} />
      )}
      {activeSection === 'predictions' && (
        <AIPredictionCenterPage initialTrainNumber={selectedTrainNumber} />
      )}
      {activeSection === 'tracking' && <LiveTrackingPage />}
    </Layout>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ActiveWorkspace />
      </AppProvider>
    </ErrorBoundary>
  );
}
