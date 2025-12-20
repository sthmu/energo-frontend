import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EnergyTrendChartProps {
  data: Array<{
    time: string;
    energy: number;
    voltage: number;
    charge: number;
  }>;
}

const EnergyTrendChart: React.FC<EnergyTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Energy Consumption Trend (24h)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="energy" stroke="#f97316" fill="#fdba74" name="Energy (kWh)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyTrendChart;