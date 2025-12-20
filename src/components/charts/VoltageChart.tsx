import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VoltageChartProps {
  data: Array<{
    time: string;
    energy: number;
    voltage: number;
    charge: number;
  }>;
}

const VoltageChart: React.FC<VoltageChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Voltage Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[220, 235]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="voltage" stroke="#3b82f6" strokeWidth={2} name="Voltage (V)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoltageChart;