import React, { useState } from 'react';

const API_BASE_URL = 'https://energo.azurewebsites.net';

function Debug() {
  const [endpoint, setEndpoint] = useState<string>('/api/power/latest');
  const [customParams, setCustomParams] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const endpoints = [
    { value: '/api/power/latest', label: 'GET /api/power/latest - Latest reading' },
    { value: '/api/power/stats', label: 'GET /api/power/stats?timeRange=24h - Statistics', defaultParams: 'timeRange=24h' },
    { value: '/api/power/energy', label: 'GET /api/power/energy?timeRange=24h - Total kWh', defaultParams: 'timeRange=24h' },
    { value: '/api/power', label: 'GET /api/power?timeRange=24h - All readings', defaultParams: 'timeRange=24h' },
    { value: '/api/power/energy/range', label: 'GET /api/power/energy/range?from=...&to=... - Custom range kWh', defaultParams: 'from=2025-12-10T00:00:00Z&to=2025-12-10T23:59:59Z' },
  ];

  const handleEndpointChange = (value: string) => {
    setEndpoint(value);
    const selected = endpoints.find(e => e.value === value);
    if (selected?.defaultParams) {
      setCustomParams(selected.defaultParams);
    } else {
      setCustomParams('');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const params = customParams ? `?${customParams}` : '';
      const url = `${API_BASE_URL}${endpoint}${params}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        url: url,
        data: data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-green-400 mb-2">API Debug Console</h1>
          <p className="text-gray-400">Test and inspect API endpoints</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">← Back to Dashboard</a>
        </div>

        {/* Endpoint Selector */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Endpoint:
          </label>
          <select
            value={endpoint}
            onChange={(e) => handleEndpointChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4"
          >
            {endpoints.map((ep) => (
              <option key={ep.value} value={ep.value}>{ep.label}</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-300 mb-2">
            Query Parameters (optional):
          </label>
          <input
            type="text"
            value={customParams}
            onChange={(e) => setCustomParams(e.target.value)}
            placeholder="e.g., timeRange=1h or from=2025-12-10T00:00:00Z&to=2025-12-10T23:59:59Z"
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4 font-mono text-sm"
          />

          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Send Request'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-6">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Response</h2>
            
            {/* Status Badge */}
            <div className="mb-4 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                response.status === 200 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {response.status} {response.statusText}
              </span>
              <span className="text-gray-400 text-sm font-mono">{response.url}</span>
            </div>

            {/* JSON Response */}
            <div className="bg-gray-900 rounded-md p-4 overflow-x-auto border border-gray-700">
              <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!response && !loading && !error && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Instructions</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Select an endpoint from the dropdown</li>
              <li>• Modify query parameters if needed</li>
              <li>• Click "Send Request" to test the API</li>
              <li>• View the response below</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Debug;
