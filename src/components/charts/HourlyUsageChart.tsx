import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HourlyUsageChartProps {
  data: Array<{
    hour: string;
    phase1: number;
    phase2: number;
    phase3: number;
  }>;
  selectedPhases: { [key: number]: boolean };
}

const HourlyUsageChart: React.FC<HourlyUsageChartProps> = ({ data, selectedPhases }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Hourly Energy Usage by Phase</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
          <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {selectedPhases[1] && <Bar dataKey="phase1" fill="#3b82f6" name="Phase 1" />}
          {selectedPhases[2] && <Bar dataKey="phase2" fill="#10b981" name="Phase 2" />}
          {selectedPhases[3] && <Bar dataKey="phase3" fill="#a855f7" name="Phase 3" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyUsageChart;