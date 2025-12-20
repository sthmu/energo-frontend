import React, { useState, useEffect, useCallback } from 'react';

// Services and Types
import { apiService } from './services/api';
import { UserProfile, DeviceInfo, ReadingData, BillCalculation, HourlyUsageData, AnalyticsData } from './types';

// Components
import { Sidebar, Header, DeviceCard, PhaseSelector, LoadingPage, LoadingOverlay } from './components';

// Pages
import { Dashboard, Analytics, Settings, Billing } from './pages';

function App() {
  // State management
  const [readings, setReadings] = useState<ReadingData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyUsageData[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [billCalculation, setBillCalculation] = useState<BillCalculation | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Granular loading states
  const [loadingReadings, setLoadingReadings] = useState<boolean>(false);
  const [loadingHourlyData, setLoadingHourlyData] = useState<boolean>(false);
  const [loadingDeviceInfo, setLoadingDeviceInfo] = useState<boolean>(false);
  const [loadingUserProfile, setLoadingUserProfile] = useState<boolean>(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [loadingBill, setLoadingBill] = useState<boolean>(false);

  // UI State
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [selectedPhases, setSelectedPhases] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true
  });

  // Helper functions
  const getSelectedPhaseNumbers = useCallback((): number[] => {
    return Object.entries(selectedPhases)
      .filter(([_, selected]) => selected)
      .map(([phase]) => parseInt(phase));
  }, [selectedPhases]);

  // API fetch functions
  const fetchReadings = useCallback(async () => {
    try {
      setLoadingReadings(true);
      const selectedPhaseNums = getSelectedPhaseNumbers();
      const data = await apiService.getReadings(selectedPhaseNums);
      setReadings(data);
    } catch (err) {
      console.error('Failed to fetch readings:', err);
    } finally {
      setLoadingReadings(false);
    }
  }, [getSelectedPhaseNumbers]);

  const fetchHourlyData = useCallback(async () => {
    try {
      setLoadingHourlyData(true);
      const today = new Date().toISOString().split('T')[0];
      const selectedPhaseNums = getSelectedPhaseNumbers();
      const data = await apiService.getHourlyUsage(today, selectedPhaseNums);
      setHourlyData(data);
    } catch (err) {
      console.error('Failed to fetch hourly data:', err);
    } finally {
      setLoadingHourlyData(false);
    }
  }, [getSelectedPhaseNumbers]);

  const fetchDeviceInfo = useCallback(async () => {
    try {
      setLoadingDeviceInfo(true);
      const data = await apiService.getDeviceInfo();
      setDeviceInfo(data);
    } catch (err) {
      console.error('Failed to fetch device info:', err);
    } finally {
      setLoadingDeviceInfo(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoadingUserProfile(true);
      const data = await apiService.getUserProfile();
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setLoadingUserProfile(false);
    }
  }, []);

  const calculateBill = useCallback(async () => {
    if (!readings?.total?.energy_wh) return;
    try {
      setLoadingBill(true);
      const data = await apiService.calculateBill(readings.total.energy_wh);
      setBillCalculation(data);
    } catch (err) {
      console.error('Failed to calculate bill:', err);
    } finally {
      setLoadingBill(false);
    }
  }, [readings]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const selectedPhaseNums = getSelectedPhaseNumbers();
      const data = await apiService.getAnalytics('energy', '24h', selectedPhaseNums);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [getSelectedPhaseNumbers]);

  // Effects
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchReadings(),
          fetchHourlyData(),
          fetchDeviceInfo(),
          fetchUserProfile(),
          fetchAnalytics()
        ]);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [fetchReadings, fetchHourlyData, fetchDeviceInfo, fetchUserProfile, fetchAnalytics]);

  useEffect(() => {
    const interval = setInterval(fetchReadings, 30000);
    return () => clearInterval(interval);
  }, [fetchReadings]);

  useEffect(() => {
    if (readings) {
      calculateBill();
    }
  }, [readings, calculateBill]);

  useEffect(() => {
    fetchReadings();
    fetchHourlyData();
  }, [selectedPhases, fetchReadings, fetchHourlyData]);

  // Computed data
  const getAggregatedData = () => {
    if (!readings?.phases) return null;
    const selectedPhaseNums = getSelectedPhaseNumbers();
    const selectedPhaseData = selectedPhaseNums.map(phase => ({
      id: phase,
      data: readings.phases[phase.toString()]
    })).filter(p => p.data);

    if (selectedPhaseData.length === 0) return null;

    const totalEnergy = selectedPhaseData.reduce((sum, p) => sum + (p.data.energy_wh || 0), 0);
    const avgVoltage = selectedPhaseData.reduce((sum, p) => sum + (p.data.voltage || 0), 0) / selectedPhaseData.length;

    return {
      latestReading: {
        time: readings.timestamp,
        voltage: avgVoltage,
        charge: 0,
        energy_wh: totalEnergy
      },
      statistics: {
        totalEnergy: Math.round((totalEnergy / 1000) * 1000) / 1000,
        averageVoltage: Math.round(avgVoltage * 100) / 100,
        peakPower: 0,
        latestReading: {
          timestamp: readings.timestamp,
          energy: totalEnergy / 1000, // Convert to kWh
          voltage: avgVoltage,
          current: selectedPhaseData.reduce((sum, p) => sum + (p.data.current || 0), 0) / selectedPhaseData.length
        }
      }
    };
  };

  const aggregatedData = getAggregatedData();
  const statistics = aggregatedData?.statistics || null;

  const togglePhase = (phase: number) => {
    setSelectedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1 flex flex-col">
        <Header userProfile={userProfile} loadingUserProfile={loadingUserProfile} />

        <div className="flex-1 overflow-y-auto p-8">
          <DeviceCard deviceInfo={deviceInfo} loadingDeviceInfo={loadingDeviceInfo} />
          <PhaseSelector selectedPhases={selectedPhases} togglePhase={togglePhase} />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && (
            <LoadingPage
              title="Loading Dashboard"
              subtitle="Please wait while we fetch your energy data..."
            />
          )}

          {!loading && (
            <>
              {activeMenu === 'dashboard' && (
                <Dashboard
                  readings={readings}
                  statistics={statistics}
                  billCalculation={billCalculation}
                  hourlyData={hourlyData}
                  selectedPhases={selectedPhases}
                  predictedEnergyUsage={25.5}
                  loadingHourlyData={loadingHourlyData}
                />
              )}

              {activeMenu === 'analytics' && (
                <Analytics analytics={analytics} loadingAnalytics={loadingAnalytics} />
              )}

              {activeMenu === 'settings' && (
                <Settings userProfile={userProfile} />
              )}

              {activeMenu === 'billing' && billCalculation && statistics && (
                <Billing billCalculation={billCalculation} statistics={statistics} />
              )}

              {(activeMenu === 'devices' || activeMenu === 'history') && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">This feature is currently under development.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Loading overlays for specific actions */}
      <LoadingOverlay
        isVisible={loadingReadings}
        message="Refreshing readings..."
      />
      <LoadingOverlay
        isVisible={loadingHourlyData}
        message="Loading hourly data..."
      />
      <LoadingOverlay
        isVisible={loadingAnalytics}
        message="Loading analytics..."
      />
      <LoadingOverlay
        isVisible={loadingBill}
        message="Calculating bill..."
      />
    </div>
  );
}

export default App;