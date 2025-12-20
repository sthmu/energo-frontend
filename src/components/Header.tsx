import React from 'react';
import { LoadingSpinner } from './Loading';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile | null;
  loadingUserProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userProfile, loadingUserProfile = false }) => {
  return (
    <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">Real-time energy monitoring</p>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          {loadingUserProfile ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-12"></div>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-800">{userProfile?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{userProfile?.role || 'User'}</p>
            </>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
          {loadingUserProfile ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            userProfile?.name?.split(' ').map(n => n[0]).join('') || 'U'
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;