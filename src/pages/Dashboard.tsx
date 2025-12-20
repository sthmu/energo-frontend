import React from 'react';
import HourlyUsageChart from '../components/charts/HourlyUsageChart';
import { LoadingChart } from '../components';
import { ReadingData, Statistics, BillCalculation, HourlyUsageData } from '../types';

interface DashboardProps {
  readings: ReadingData | null;
  statistics: Statistics | null;
  billCalculation: BillCalculation | null;
  hourlyData: HourlyUsageData[];
  selectedPhases: { [key: number]: boolean };
  predictedEnergyUsage: number;
  loadingHourlyData?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  readings,
  statistics,
  billCalculation,
  hourlyData,
  selectedPhases,
  predictedEnergyUsage,
  loadingHourlyData = false
}) => {
  // Show available data even if readings are missing
  const hasSomeData = readings || hourlyData.length > 0 || billCalculation;

  if (!hasSomeData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard Data</h3>
        <p className="text-gray-600">Please wait while we fetch your energy data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase Energy Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Phase Energy Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Phase 1 */}
          {selectedPhases[1] && (
            <div className={`rounded-xl shadow-lg p-5 text-white ${readings?.phases?.['1'] ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm opacity-90">Phase 1</p>
                <span className="text-xl">{readings?.phases?.['1'] ? '⚡' : '⏸️'}</span>
              </div>
              {readings?.phases?.['1'] ? (
                <>
                  <p className="text-3xl font-bold">{(readings.phases['1'].energy_wh / 1000).toFixed(2)} kWh</p>
                  <div className="mt-3 pt-3 border-t border-blue-400 space-y-1">
                    <p className="text-xs opacity-75">Voltage: {readings.phases['1'].voltage} V</p>
                    <p className="text-xs opacity-75">Current: {readings.phases['1'].current} A</p>
                  </div>
                </>
              ) : (
                <p className="text-lg font-bold">No Data</p>
              )}
            </div>
          )}

          {/* Phase 2 */}
          {selectedPhases[2] && (
            <div className={`rounded-xl shadow-lg p-5 text-white ${readings?.phases?.['2'] ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm opacity-90">Phase 2</p>
                <span className="text-xl">{readings?.phases?.['2'] ? '⚡' : '⏸️'}</span>
              </div>
              {readings?.phases?.['2'] ? (
                <>
                  <p className="text-3xl font-bold">{(readings.phases['2'].energy_wh / 1000).toFixed(2)} kWh</p>
                  <div className="mt-3 pt-3 border-t border-green-400 space-y-1">
                    <p className="text-xs opacity-75">Voltage: {readings.phases['2'].voltage} V</p>
                    <p className="text-xs opacity-75">Current: {readings.phases['2'].current} A</p>
                  </div>
                </>
              ) : (
                <p className="text-lg font-bold">No Data</p>
              )}
            </div>
          )}

          {/* Phase 3 */}
          {selectedPhases[3] && (
            <div className={`rounded-xl shadow-lg p-5 text-white ${readings?.phases?.['3'] ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm opacity-90">Phase 3</p>
                <span className="text-xl">{readings?.phases?.['3'] ? '⚡' : '⏸️'}</span>
              </div>
              {readings?.phases?.['3'] ? (
                <>
                  <p className="text-3xl font-bold">{(readings.phases['3'].energy_wh / 1000).toFixed(2)} kWh</p>
                  <div className="mt-3 pt-3 border-t border-purple-400 space-y-1">
                    <p className="text-xs opacity-75">Voltage: {readings.phases['3'].voltage} V</p>
                    <p className="text-xs opacity-75">Current: {readings.phases['3'].current} A</p>
                  </div>
                </>
              ) : (
                <p className="text-lg font-bold">No Data</p>
              )}
            </div>
          )}

          {/* Total */}
          {statistics ? (
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm opacity-90">Total Combined</p>
                <span className="text-xl">🔥</span>
              </div>
              <p className="text-3xl font-bold">{statistics.totalEnergy} kWh</p>
              <div className="mt-3 pt-3 border-t border-orange-400 space-y-1">
                <p className="text-xs opacity-75">Avg Voltage: {statistics.averageVoltage} V</p>
                <p className="text-xs opacity-75">Peak Power: {statistics.peakPower} W</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm opacity-90">Total Combined</p>
                <span className="text-xl">⏸️</span>
              </div>
              <p className="text-lg font-bold">No Data</p>
            </div>
          )}
        </div>
      </div>

      {/* Predictions and Bill */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Predicted Usage */}
        <div className="bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Predicted (24h)</p>
          <p className="text-3xl font-bold">{predictedEnergyUsage} kWh</p>
          <p className="text-xs opacity-75 mt-2">Based on usage pattern</p>
        </div>

        {/* Estimated Bill */}
        {billCalculation ? (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Estimated Monthly Bill</p>
            <p className="text-3xl font-bold">LKR {billCalculation.totalAmount.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">Sri Lankan Tariff</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Estimated Monthly Bill</p>
            <p className="text-lg font-bold">No Data</p>
            <p className="text-xs opacity-75 mt-2">Requires energy readings</p>
          </div>
        )}
      </div>

      {/* Hourly Usage Chart */}
      {loadingHourlyData ? (
        <LoadingChart />
      ) : (
        <HourlyUsageChart data={hourlyData} selectedPhases={selectedPhases} />
      )}
    </div>
  );
};

export default Dashboard;