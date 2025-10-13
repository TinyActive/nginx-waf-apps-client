import api from './api';

export interface DashboardStats {
  domains: {
    total: number;
    active: number;
    errors: number;
  };
  alerts: {
    total: number;
    unacknowledged: number;
    critical: number;
  };
  traffic: {
    requestsPerDay: string;
    requestsPerSecond: number;
  };
  uptime: string;
  system: {
    cpuUsage: number;
    memoryUsage: number;
    cpuCores: number;
  };
}

export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export interface SystemMetrics {
  cpu: MetricDataPoint[];
  memory: MetricDataPoint[];
  bandwidth: MetricDataPoint[];
  requests: MetricDataPoint[];
}

export interface DashboardAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
}

/**
 * Get dashboard statistics overview
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
};

/**
 * Get system metrics (CPU, Memory, Bandwidth, Requests)
 * @param period - Time period: '24h', '7d', '30d'
 */
export const getSystemMetrics = async (period: '24h' | '7d' | '30d' = '24h'): Promise<SystemMetrics> => {
  const response = await api.get('/dashboard/metrics', {
    params: { period },
  });
  return response.data.data;
};

/**
 * Get recent alerts for dashboard
 * @param limit - Number of alerts to fetch
 */
export const getRecentAlerts = async (limit: number = 5): Promise<DashboardAlert[]> => {
  const response = await api.get('/dashboard/recent-alerts', {
    params: { limit },
  });
  return response.data.data;
};

export const dashboardService = {
  getDashboardStats,
  getSystemMetrics,
  getRecentAlerts,
};

export default dashboardService;
