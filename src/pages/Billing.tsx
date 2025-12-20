import React from 'react';
import { BillCalculation, Statistics } from '../types';

interface BillingProps {
  billCalculation: BillCalculation | null;
  statistics: Statistics | null;
}

const Billing: React.FC<BillingProps> = ({ billCalculation, statistics }) => {
  if (!billCalculation || !statistics) return null;

  return (
    <div className="space-y-6">
      {/* Bill Summary Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Monthly Electricity Bill</h2>
          <span className="text-4xl">💡</span>
        </div>
        <div className="mb-6">
          <p className="text-sm opacity-90 mb-2">Total Amount Due</p>
          <p className="text-5xl font-bold">LKR {billCalculation.totalAmount.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-green-400">
          <div>
            <p className="text-xs opacity-75">Units Consumed</p>
            <p className="text-xl font-semibold">{Math.round(statistics.totalEnergy)} kWh</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Tariff Slab</p>
            <p className="text-xl font-semibold">High Usage</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Avg Rate</p>
            <p className="text-xl font-semibold">LKR {(billCalculation.totalAmount / statistics.totalEnergy).toFixed(2)}/kWh</p>
          </div>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slab-wise Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Slab-wise Breakdown</h3>
          <div className="space-y-3">
            {billCalculation.breakdown.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{item.slab}</p>
                  <p className="text-xs text-gray-500">{item.units} units × LKR {item.rate}/kWh</p>
                </div>
                <p className="text-lg font-bold text-gray-800">LKR {item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700">Energy Charge Total</p>
              <p className="text-xl font-bold text-blue-600">LKR {billCalculation.breakdown.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Additional Charges */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Charges</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-700">Fixed Charge</p>
                <p className="text-xs text-gray-500">Service charge</p>
              </div>
              <p className="text-lg font-bold text-gray-800">LKR {billCalculation.fixedCharges?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">No additional discounts or penalties</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">LKR {billCalculation.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;