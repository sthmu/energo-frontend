import React, { useState, useEffect, useCallback } from 'react';

interface PowerReading {
  time: string;
  voltage: number;
  current: number;
  power: number;
}

interface PowerData {
  timeRange: string;
  count: number;
  data: PowerReading[];
}

interface EnergyData {
  timeRange: string;
  totalEnergyKWh: number;
}

interface Statistics {
  avgVoltage: number;
  avgCurrent: number;
  totalEnergy: number;
}

const API_BASE_URL = 'https://energo.azurewebsites.net';

function App() {
  const [latestReading, setLatestReading] = useState<PowerReading | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper to get datetime-local format
  const getDateTimeLocal = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };
  
  // Custom date range - default to last hour
  const [useCustomRange, setUseCustomRange] = useState<boolean>(false);
  const [startDateTime, setStartDateTime] = useState<string>(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return getDateTimeLocal(oneHourAgo);
  });
  const [endDateTime, setEndDateTime] = useState<string>(() => {
    return getDateTimeLocal(new Date());
  });

  // Helper function to convert date range to API format
  const getTimeRangeString = useCallback(() => {
    if (!useCustomRange || !startDateTime || !endDateTime) {
      return '1h'; // default
    }
    
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays}d`;
    }
  }, [useCustomRange, startDateTime, endDateTime]);

  const fetchPowerData = useCallback(async () => {
    try {
      setError(null);
      const timeRangeParam = getTimeRangeString();
      
      // Fetch power readings
      const powerResponse = await fetch(`${API_BASE_URL}/api/power?timeRange=${timeRangeParam}`);
      if (!powerResponse.ok) {
        throw new Error('Failed to fetch power data');
      }
      const powerData: PowerData = await powerResponse.json();
      
      // Fetch energy consumption
      const energyResponse = await fetch(`${API_BASE_URL}/api/power/energy?timeRange=${timeRangeParam}`);
      if (!energyResponse.ok) {
        throw new Error('Failed to fetch energy data');
      }
      const energyData: EnergyData = await energyResponse.json();
      
      // Calculate statistics
      if (powerData.data && powerData.data.length > 0) {
        setLatestReading(powerData.data[powerData.data.length - 1]);
        
        const avgVoltage = powerData.data.reduce((sum, r) => sum + r.voltage, 0) / powerData.data.length;
        const avgCurrent = powerData.data.reduce((sum, r) => sum + r.current, 0) / powerData.data.length;
        
        setStatistics({
          avgVoltage: Math.round(avgVoltage * 100) / 100,
          avgCurrent: Math.round(avgCurrent * 100) / 100,
          totalEnergy: Math.round(energyData.totalEnergyKWh * 1000) / 1000
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [getTimeRangeString]);

  useEffect(() => {
    // Initial fetch
    fetchPowerData();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchPowerData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [fetchPowerData]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleApplyCustomRange = () => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      
      if (start >= end) {
        setError('Start time must be before end time');
        return;
      }
      
      setUseCustomRange(true);
      fetchPowerData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Energy Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time power consumption monitoring</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Time Range</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date/Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Date/Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleApplyCustomRange}
              disabled={!startDateTime || !endDateTime}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply Time Range
            </button>
            <button
              onClick={() => {
                setUseCustomRange(false);
                setStartDateTime('');
                setEndDateTime('');
                fetchPowerData();
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reset to Last Hour
            </button>
          </div>
          
          {useCustomRange && startDateTime && endDateTime && (
            <div className="mt-3 text-sm text-blue-600">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Custom range applied: {formatDateTime(startDateTime)} to {formatDateTime(endDateTime)}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Statistics & Latest Reading */}
        {!loading && latestReading && statistics && (
          <div>
            {/* Energy Consumption Card (Featured) */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1 opacity-90">Total Energy Consumption</p>
                  <p className="text-5xl font-bold">{statistics.totalEnergy}</p>
                  <p className="text-lg mt-1 opacity-90">kWh (Kilowatt-hours)</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Statistics */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Values for Selected Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Average Voltage */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Average Voltage</p>
                    <p className="text-3xl font-bold text-gray-800">{statistics.avgVoltage}</p>
                    <p className="text-sm text-gray-500 mt-1">Volts (V)</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Average Current */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Average Current</p>
                    <p className="text-3xl font-bold text-gray-800">{statistics.avgCurrent}</p>
                    <p className="text-sm text-gray-500 mt-1">Amperes (A)</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Reading */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Reading</h2>
            
            {/* Reading Time */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                Last updated: <span className="font-medium text-gray-800">{formatDateTime(latestReading.time)}</span>
              </p>
            </div>

            {/* Latest Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Voltage Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Voltage</p>
                    <p className="text-3xl font-bold text-gray-800">{latestReading.voltage}</p>
                    <p className="text-sm text-gray-500 mt-1">Volts (V)</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Current Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Current</p>
                    <p className="text-3xl font-bold text-gray-800">{latestReading.current}</p>
                    <p className="text-sm text-gray-500 mt-1">Amperes (A)</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Power Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Power</p>
                    <p className="text-3xl font-bold text-gray-800">{latestReading.power}</p>
                    <p className="text-sm text-gray-500 mt-1">Watts (W)</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-refresh indicator */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Auto-refreshing every 5 seconds
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !latestReading && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No data available for the selected time range.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

