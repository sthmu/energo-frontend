import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyConsumptionChartProps {
  data: Array<{
    day: string;
    consumption: number;
  }>;
}

const DailyConsumptionChart: React.FC<DailyConsumptionChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Consumption</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="consumption" fill="#10b981" name="Energy (kWh)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyConsumptionChart;