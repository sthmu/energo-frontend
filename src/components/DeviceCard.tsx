import React from 'react';
import { LoadingSpinner } from './Loading';
import { DeviceInfo } from '../types';

interface DeviceCardProps {
  deviceInfo: DeviceInfo | null;
  loadingDeviceInfo?: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ deviceInfo, loadingDeviceInfo = false }) => {
  if (loadingDeviceInfo && !deviceInfo) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-blue-500 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 rounded-lg p-3">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
            <LoadingSpinner size="sm" color="gray" />
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!deviceInfo) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 rounded-lg p-3">
            <span className="text-2xl">📍</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{deviceInfo.name}</h3>
            <p className="text-sm text-gray-600">{deviceInfo.location}</p>
            <p className="text-xs text-gray-500 mt-1">Device ID: {deviceInfo.deviceId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">{deviceInfo.status}</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;