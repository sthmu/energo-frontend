// API Configuration
const API_BASE_URL = 'https://energo.azurewebsites.net';
const DEVICE_ID = 'ESP32-A1B2C3';

// API Service Functions
export const apiService = {
  async getReadings(phases: number[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/readings?phases=[${phases.join(',')}]&deviceId=${DEVICE_ID}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Failed to fetch readings');
    return data.data;
  },

  async getHourlyUsage(date: string, phases: number[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/hourly-usage?date=${date}&phases=[${phases.join(',')}]&deviceId=${DEVICE_ID}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Failed to fetch hourly usage');
    return data.data;
  },

  async getDeviceInfo(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/device-info?deviceId=${DEVICE_ID}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Failed to fetch device info');
    return data.data;
  },

  async getUserProfile(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/user-profile`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Failed to fetch user profile');
    return data.data;
  },

  async calculateBill(totalEnergy: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/calculate-bill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalEnergy, deviceId: DEVICE_ID })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Failed to calculate bill');
    return data.data;
  },

  async getAnalytics(type: string, period: string, phases: number[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/analytics?type=${type}&period=${period}&phases=[${phases.join(',')}]&deviceId=${DEVICE_ID}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Failed to fetch analytics');
    return data.data;
  }
};