"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Shield, Activity } from 'lucide-react';

// Import new dashboard components
import { KPICards } from '@/components/dashboard/KPICards';
import { ThreatTrendChart } from '@/components/dashboard/ThreatTrendChart';
import MapWrapper from '@/components/maps/MapWrapper';
import { AlertsFeed } from '@/components/dashboard/AlertsFeed';
import { IncidentsList } from '@/components/dashboard/IncidentsList';
import { ThreatDistribution } from '@/components/dashboard/ThreatDistribution';
import { TopIPs } from '@/components/dashboard/TopIPs';
import { HeaderThreatToggle } from '@/components/dashboard/HeaderThreatToggle';
import { ThreatNewsPanel } from '@/components/dashboard/ThreatNewsPanel';
import { SystemHealth } from '@/components/dashboard/SystemHealth';

// Mock data
const mockKPIData = {
  totalThreats: 1247,
  activeAlerts: 23,
  openIncidents: 8,
  systemHealth: 98.5,
  rps: 15420
};

const mockTrendData = [
  { time: '00:00', threats: 120, mitigated: 95 },
  { time: '04:00', threats: 145, mitigated: 120 },
  { time: '08:00', threats: 189, mitigated: 165 },
  { time: '12:00', threats: 234, mitigated: 198 },
  { time: '16:00', threats: 198, mitigated: 176 },
  { time: '20:00', threats: 156, mitigated: 134 },
  { time: '23:59', threats: 142, mitigated: 118 },
];

const mockAlerts = [
  { id: 1, type: 'SQL Injection', severity: 'critical' as const, source: '192.168.1.100', time: '2 min ago' },
  { id: 2, type: 'DDoS Attack', severity: 'high' as const, source: '10.0.0.50', time: '5 min ago' },
  { id: 3, type: 'Malware', severity: 'medium' as const, source: '172.16.0.1', time: '12 min ago' },
];

const mockIncidents = [
  { id: 1, title: 'Critical SQL Injection Attack', status: 'active' as const, severity: 'critical' as const, time: '10 min ago' },
  { id: 2, title: 'DDoS Attack on Web Server', status: 'investigating' as const, severity: 'high' as const, time: '25 min ago' },
  { id: 3, title: 'Suspicious Login Attempts', status: 'contained' as const, severity: 'medium' as const, time: '1 hour ago' },
];

const mockThreatData = [
  { name: 'SQL Injection', value: 35, color: '#ef4444' },
  { name: 'XSS', value: 25, color: '#f97316' },
  { name: 'Malware', value: 20, color: '#eab308' },
  { name: 'Phishing', value: 15, color: '#22c55e' },
  { name: 'Other', value: 5, color: '#64748b' },
];

const mockTopIPs = [
  { ip: '192.168.1.100', attacks: 45, country: 'US' },
  { ip: '10.0.0.50', attacks: 32, country: 'CN' },
  { ip: '172.16.0.1', attacks: 28, country: 'RU' },
  { ip: '203.0.113.42', attacks: 21, country: 'BR' },
];

const mockSystemHealth = {
  cpu: 45.2,
  memory: 67.8,
  disk: 34.1,
  network: 12.3,
  uptime: '15d 8h 23m'
};

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Route protection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isNewsPanelOpen, setIsNewsPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      queueMicrotask(() => {
        setMounted(true);
        setLastUpdate(new Date());
      });
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      try {
        setLastUpdate(new Date());
        // Update mock data here
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  const handleRefresh = () => {
    // Refresh data logic here
    try {
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  return (
    <>
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">SOC Dashboard</h1>
            <p className="text-muted-foreground">Real-time threat monitoring and analysis</p>
          </div>
          
          <div className="flex items-center gap-3">
            <HeaderThreatToggle
              isOpen={isNewsPanelOpen}
              onToggle={() => setIsNewsPanelOpen(!isNewsPanelOpen)}
              hasNotifications={true}
              isMobile={false}
            />
            
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
              isConnected 
                ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-sm font-medium hidden sm:inline">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <span className="text-sm font-medium sm:hidden">
                {isConnected ? '🟢' : '🔴'}
              </span>
            </div>
            
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="hidden items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-foreground transition-colors hover:bg-accent sm:flex"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>
            
            {/* Mobile Refresh Icon */}
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-accent sm:hidden"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Last Update */}
        <div className="mt-2 text-xs text-muted-foreground">
          Last updated: {mounted && lastUpdate ? lastUpdate.toLocaleString() : 'Loading...'}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <KPICards data={mockKPIData} />
      </motion.div>

      {/* Main grid: self-start columns so a fixed-height chart is not stretched to match the taller sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-6">
        {/* Left column — charts */}
        <div className="flex w-full min-w-0 flex-col gap-6 lg:col-span-8 lg:self-start">
          {/* Threat Trends (line chart — card height follows chart, no dead vertical space) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex w-full shrink-0 flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6"
          >
            <h2 className="mb-4 shrink-0 text-lg font-semibold text-gray-900 dark:text-white">
              Threat Trends
            </h2>
            <div className="h-[300px] w-full min-w-0 sm:h-[320px]">
              <ThreatTrendChart data={mockTrendData} />
            </div>
          </motion.div>

          {/* Threat Distribution & Top IPs — equal-height row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex h-[360px] min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6"
            >
              <h3 className="mb-3 shrink-0 text-lg font-semibold text-gray-900 dark:text-white">
                Threat Distribution
              </h3>
              <div className="min-h-[280px] w-full min-w-0 flex-1 overflow-visible">
                <ThreatDistribution data={mockThreatData} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex h-[360px] min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6"
            >
              <h3 className="mb-3 shrink-0 text-lg font-semibold text-gray-900 dark:text-white">
                Top Attacking IPs
              </h3>
              <div className="min-h-[280px] w-full min-w-0 flex-1">
                <TopIPs data={mockTopIPs} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right column — map & alerts */}
        <div className="flex w-full min-w-0 flex-col gap-6 lg:col-span-4 lg:self-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6"
          >
            <h3 className="mb-4 shrink-0 text-lg font-semibold text-gray-900 dark:text-white">
              Global Threat Map
            </h3>
            <div className="h-[min(320px,50vh)] min-h-[260px] w-full overflow-hidden rounded-lg">
              <MapWrapper />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex h-[360px] min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
            <div className="min-h-0 flex-1">
              <AlertsFeed alerts={mockAlerts} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* System Health — full width so metrics span the dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="mt-6 w-full rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
        <SystemHealth data={mockSystemHealth} layout="wide" />
      </motion.div>

      {/* Bottom Section - Incidents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#111827] sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Active Incidents</h3>
          <IncidentsList incidents={mockIncidents} />
        </div>
      </motion.div>

      {/* Threat Intelligence Panel */}
      <ThreatNewsPanel
        isOpen={isNewsPanelOpen}
        onClose={() => setIsNewsPanelOpen(false)}
      />
    </>
  );
}
