"use client";

import { useState, useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import { apiClient } from '@/lib/api-client';

// Mock data for development
const USE_MOCK_DATA = false;

interface DashboardStats {
  total_alerts: number;
  critical_alerts: number;
  high_alerts: number;
  medium_alerts: number;
  low_alerts: number;
  total_incidents: number;
  open_incidents: number;
  resolved_incidents: number;
  total_detections: number;
  threats_blocked: number;
  uptime: number;
}

interface AlertTrend {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface ThreatMap {
  country: string;
  threats: number;
  severity: string;
}

interface ActivityFeed {
  id: string;
  type: 'alert' | 'incident';
  title: string;
  severity: string;
  status: string;
  timestamp: string;
  source_ip?: string;
}

interface Alert {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'mitigated' | 'monitoring' | 'resolved';
  timestamp: string;
  source: string;
}

interface SystemHealth {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_latency: number;
  active_connections: number;
  services_status: {
    detection_engine: string;
    soar_engine: string;
    database: string;
    redis: string;
  };
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<AlertTrend[]>([]);
  const [threatMap, setThreatMap] = useState<ThreatMap[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Disable WebSocket for mock data
const { lastMessage, isConnected } = { lastMessage: null, isConnected: false };

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          // Mock data for development
          const mockStats = {
            total_alerts: 1247,
            critical_alerts: 23,
            high_alerts: 156,
            medium_alerts: 412,
            low_alerts: 656,
            total_incidents: 89,
            open_incidents: 34,
            resolved_incidents: 55,
            total_detections: 5432,
            threats_blocked: 1876,
            uptime: 99.8,
          };

          const mockTrends = [
            { date: '2024-03-27', critical: 18, high: 142, medium: 389, low: 621 },
            { date: '2024-03-28', critical: 22, high: 158, medium: 401, low: 643 },
            { date: '2024-03-29', critical: 19, high: 149, medium: 395, low: 632 },
            { date: '2024-03-30', critical: 25, high: 167, medium: 418, low: 667 },
            { date: '2024-03-31', critical: 21, high: 153, medium: 407, low: 649 },
            { date: '2024-04-01', critical: 23, high: 156, medium: 412, low: 656 },
            { date: '2024-04-02', critical: 23, high: 156, medium: 412, low: 656 },
          ];

          const mockThreatMap = [
            { country: 'United States', threats: 342, severity: 'high' },
            { country: 'China', threats: 287, severity: 'high' },
            { country: 'Russia', threats: 198, severity: 'medium' },
            { country: 'Brazil', threats: 156, severity: 'medium' },
            { country: 'India', threats: 134, severity: 'low' },
            { country: 'Germany', threats: 98, severity: 'low' },
            { country: 'United Kingdom', threats: 87, severity: 'low' },
            { country: 'France', threats: 76, severity: 'low' },
          ];

          const mockActivityFeed: ActivityFeed[] = [
            { id: '1', type: 'alert', title: 'Suspicious login attempt detected', severity: 'high', status: 'investigating', timestamp: '2024-04-02T10:30:00Z' },
            { id: '2', type: 'incident', title: 'Malware signature identified', severity: 'critical', status: 'mitigated', timestamp: '2024-04-02T10:25:00Z' },
            { id: '3', type: 'alert', title: 'Automated response initiated', severity: 'medium', status: 'resolved', timestamp: '2024-04-02T10:20:00Z' },
            { id: '4', type: 'incident', title: 'Unusual network traffic pattern', severity: 'medium', status: 'monitoring', timestamp: '2024-04-02T10:15:00Z' },
            { id: '5', type: 'alert', title: 'Phishing attempt blocked', severity: 'high', status: 'mitigated', timestamp: '2024-04-02T10:10:00Z' },
          ];

          const mockRecentAlerts: Alert[] = [
            { id: 1, title: 'Critical SQL Injection Attempt', severity: 'critical', status: 'open', timestamp: '2024-04-02T10:30:00Z', source: 'Web Application Firewall' },
            { id: 2, title: 'Suspicious File Upload', severity: 'high', status: 'investigating', timestamp: '2024-04-02T10:25:00Z', source: 'File Scanner' },
            { id: 3, title: 'Brute Force Attack Detected', severity: 'high', status: 'mitigated', timestamp: '2024-04-02T10:20:00Z', source: 'Authentication System' },
            { id: 4, title: 'Unusual API Usage Pattern', severity: 'medium', status: 'monitoring', timestamp: '2024-04-02T10:15:00Z', source: 'API Gateway' },
            { id: 5, title: 'Potential Data Exfiltration', severity: 'critical', status: 'investigating', timestamp: '2024-04-02T10:10:00Z', source: 'Data Loss Prevention' },
          ];

          const mockSystemHealth = {
            cpu_usage: 45.2,
            memory_usage: 67.8,
            disk_usage: 23.4,
            network_latency: 12,
            active_connections: 1247,
            services_status: {
              detection_engine: 'healthy',
              soar_engine: 'healthy',
              database: 'healthy',
              redis: 'disabled',
            },
          };

          setStats(mockStats);
          setTrends(mockTrends);
          setThreatMap(mockThreatMap);
          setActivityFeed(mockActivityFeed);
          setRecentAlerts(mockRecentAlerts);
          setSystemHealth(mockSystemHealth);
        } else {
          // Original API calls
          const [
            statsData,
            trendsData,
            threatMapData,
            activityData,
            recentAlertsData,
            healthData,
          ] = await Promise.all([
            apiClient.getDashboardStats(),
            apiClient.getAlertTrends(7),
            apiClient.getThreatMap(),
            apiClient.getActivityFeed(20),
            apiClient.getRecentAlerts(10),
            apiClient.getSystemHealth(),
          ]);

          setStats(statsData as any);
          setTrends(trendsData as any);
          setThreatMap(threatMapData as any);
          setActivityFeed(activityData as any);
          setRecentAlerts(recentAlertsData as any);
          setSystemHealth(healthData as any);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // WebSocket handling disabled for mock data
  useEffect(() => {
    // No WebSocket updates when using mock data
  }, []);

  // Handle real-time WebSocket updates
  // NOTE: lastMessage is currently null (USE_MOCK_DATA = true), this block is a no-op
  useEffect(() => {
    if (!lastMessage || !isConnected) return;
    // When WebSocket is enabled, handle real-time events here
  }, [lastMessage, isConnected]);

  // Refresh data periodically (only when WebSocket is active)
  useEffect(() => {
    // Periodic refresh is disabled while USE_MOCK_DATA is true
    if (!isConnected || USE_MOCK_DATA) return;

    const interval = setInterval(async () => {
      console.log('Periodic refresh disabled — apiClient not configured');
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    stats,
    trends,
    threatMap,
    activityFeed,
    recentAlerts,
    systemHealth,
    isLoading,
    error,
    isConnected,
    refresh: async () => {
      if (USE_MOCK_DATA) return;
      try {
        setIsLoading(true);
        console.log('Manual refresh disabled — apiClient not configured');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh data');
      } finally {
        setIsLoading(false);
      }
    },
  };
}
