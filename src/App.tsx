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

const API_BASE_URL = 'https://energo.azurewebsites.net';

function App() {
  const [latestReading, setLatestReading] = useState<PowerReading | null>(null);
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPowerData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/power?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data: PowerData = await response.json();
      
      // Get the latest reading (most recent)
      if (data.data && data.data.length > 0) {
        setLatestReading(data.data[data.data.length - 1]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    // Initial fetch
    fetchPowerData();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchPowerData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [timeRange, fetchPowerData]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Energy Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time power consumption monitoring</p>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
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

        {/* Latest Reading Cards */}
        {!loading && latestReading && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Reading</h2>
            
            {/* Reading Time */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                Last updated: <span className="font-medium text-gray-800">{formatDateTime(latestReading.time)}</span>
              </p>
            </div>

            {/* Metric Cards */}
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

