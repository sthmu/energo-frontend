import React from 'react';
import EnergyTrendChart from '../components/charts/EnergyTrendChart';
import VoltageChart from '../components/charts/VoltageChart';
import DailyConsumptionChart from '../components/charts/DailyConsumptionChart';
import { LoadingChart, LoadingPage } from '../components';
import { AnalyticsData } from '../types';

interface AnalyticsProps {
  analytics: AnalyticsData | null;
  loadingAnalytics?: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({ analytics, loadingAnalytics = false }) => {
  if (loadingAnalytics && !analytics) {
    return (
      <LoadingPage
        title="Loading Analytics"
        subtitle="Please wait while we analyze your energy data..."
      />
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Analytics data is not available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loadingAnalytics ? (
        <LoadingChart />
      ) : (
        <EnergyTrendChart data={analytics.energyTrend} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingAnalytics ? (
          <>
            <LoadingChart height="h-48" />
            <LoadingChart height="h-48" />
          </>
        ) : (
          <>
            <VoltageChart data={analytics.energyTrend} />
            <DailyConsumptionChart data={analytics.dailyConsumption} />
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;