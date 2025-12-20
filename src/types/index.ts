export interface UserProfile {
  name: string;
  email: string;
  role?: string;
}

export interface DeviceInfo {
  name: string;
  location: string;
  deviceId: string;
  status: string;
}

export interface ReadingData {
  phases: { [key: string]: any };
  total: {
    energy_wh: number;
    voltage: number;
    current: number;
    power: number;
  };
  timestamp: string;
}

export interface HourlyUsageData {
  hour: string;
  phase1: number;
  phase2: number;
  phase3: number;
}

export interface AnalyticsData {
  energyTrend: Array<{
    time: string;
    energy: number;
    voltage: number;
    charge: number;
  }>;
  dailyConsumption: Array<{
    day: string;
    consumption: number;
  }>;
}

export interface BillCalculation {
  totalAmount: number;
  breakdown: Array<{
    slab: string;
    units: number;
    rate: number;
    amount: number;
  }>;
  fixedCharges?: number;
}

export interface Statistics {
  totalEnergy: number;
  averageVoltage: number;
  peakPower: number;
  latestReading: {
    timestamp: string;
    energy: number;
    voltage: number;
    current: number;
  };
}