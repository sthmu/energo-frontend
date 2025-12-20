import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'gray' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  );
};

interface LoadingCardProps {
  title?: string;
  height?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title,
  height = 'h-32'
}) => (
  <div className={`bg-white rounded-xl shadow-md p-6 animate-pulse ${height}`}>
    {title && (
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
    )}
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

interface LoadingChartProps {
  height?: string;
}

export const LoadingChart: React.FC<LoadingChartProps> = ({
  height = 'h-64'
}) => (
  <div className={`bg-white rounded-xl shadow-md p-6 animate-pulse ${height}`}>
    <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
    <div className="flex items-end space-x-2 h-40">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-300 rounded-t w-full"
          style={{ height: `${Math.random() * 100}%` }}
        ></div>
      ))}
    </div>
  </div>
);

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = "Loading Dashboard",
  subtitle = "Please wait while we fetch your energy data..."
}) => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>

    {/* Cards grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <LoadingCard key={i} height="h-32" />
      ))}
    </div>

    {/* Chart skeleton */}
    <LoadingChart />

    {/* Bottom cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LoadingCard height="h-24" />
      <LoadingCard height="h-24" />
    </div>
  </div>
);

interface LoadingButtonProps {
  text?: string;
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  text = "Loading...",
  className = ""
}) => (
  <button
    disabled
    className={`bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center space-x-2 ${className}`}
  >
    <LoadingSpinner size="sm" color="gray" />
    <span>{text}</span>
  </button>
);

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" color="blue" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};