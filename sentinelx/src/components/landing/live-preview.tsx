"use client";

import { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Shield, TrendingUp, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MockData {
  threats: number;
  alerts: number;
  incidents: number;
  uptime: number;
  recentActivity: Array<{
    time: string;
    type: 'threat' | 'alert' | 'incident';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  }>;
}

const ActivityItem = memo(({ activity, index }: { activity: any, index: number }) => {
  const Icon = useMemo(() => {
    switch (activity.type) {
      case 'threat': return AlertTriangle;
      case 'alert': return Activity;
      case 'incident': return Shield;
      default: return Activity;
    }
  }, [activity.type]);

  const severityStyles = useMemo(() => {
    switch (activity.severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  }, [activity.severity]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border",
        "bg-black/30 backdrop-blur-sm border-slate-700/50",
        "will-change-transform"
      )}
    >
      <div className={cn("p-2 rounded-lg", severityStyles)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">{activity.time}</span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            severityStyles
          )}>
            {activity.severity.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-white truncate">{activity.message}</p>
      </div>
    </motion.div>
  );
});

ActivityItem.displayName = 'ActivityItem';

export function LivePreview() {
  const [mockData, setMockData] = useState<MockData>({
    threats: 1247,
    alerts: 89,
    incidents: 12,
    uptime: 99.97,
    recentActivity: []
  });

  useEffect(() => {
    const activities = [
      { time: '2 min ago', type: 'threat' as const, severity: 'high' as const, message: 'Suspicious login attempt detected' },
      { time: '5 min ago', type: 'alert' as const, severity: 'medium' as const, message: 'Unusual network traffic pattern' },
      { time: '8 min ago', type: 'incident' as const, severity: 'critical' as const, message: 'Potential data exfiltration attempt' },
      { time: '12 min ago', type: 'threat' as const, severity: 'low' as const, message: 'Malware signature detected' },
      { time: '15 min ago', type: 'alert' as const, severity: 'high' as const, message: 'Brute force attack blocked' },
    ];

    setMockData(prev => ({ ...prev, recentActivity: activities }));

    const interval = setInterval(() => {
      setMockData(prev => ({
        ...prev,
        threats: prev.threats + Math.floor(Math.random() * 3),
        alerts: prev.alerts + Math.floor(Math.random() * 2),
        uptime: Math.min(99.99, prev.uptime + Math.random() * 0.01)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="platform" className="py-20 bg-gradient-to-b from-black via-slate-900/50 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Security Dashboard
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience real-time threat detection and monitoring in action.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <div className="relative group">
          {/* Performance Optimized Glow - Instead of animating boxShadow, animate opacity of a static shadow div */}
          <motion.div
            className="absolute -inset-1 rounded-[2.5rem] bg-green-500/20 blur-2xl z-0"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "opacity" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="relative z-10 bg-black/40 backdrop-blur-xl rounded-3xl border border-green-500/20 p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(57,255,20,0.05)_0%,transparent_50%)] pointer-events-none" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
              {[
                { label: 'Threats Detected', value: mockData.threats.toLocaleString(), color: 'text-green-400', icon: Activity },
                { label: 'Active Alerts', value: mockData.alerts, color: 'text-orange-400', icon: AlertTriangle },
                { label: 'Incidents', value: mockData.incidents, color: 'text-red-400', icon: Shield },
                { label: 'Uptime', value: `${mockData.uptime}%`, color: 'text-blue-400', icon: TrendingUp },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className={cn("h-5 w-5 mr-2", stat.color)} />
                    <span className={cn("text-3xl font-bold tracking-tight", stat.color)}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Activity Feed */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Activity className="h-5 w-5 text-green-400 mr-2" />
                  Live Activity Feed
                </h3>
                
                <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                  <AnimatePresence initial={false}>
                    {mockData.recentActivity.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Globe Visual */}
              <div className="flex flex-col items-center justify-center p-6 bg-green-500/5 rounded-2xl border border-green-500/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="relative mb-6"
                >
                  <Globe className="h-24 w-24 text-green-400/20" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Globe className="h-24 w-24 text-green-400/40 blur-sm" />
                  </motion.div>
                </motion.div>
                <div className="text-center">
                  <h4 className="text-white font-medium mb-1">Global Monitoring</h4>
                  <p className="text-xs text-slate-400">Monitoring 42 node locations</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-slate-300 mb-8">
            Ready to secure your infrastructure?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/signup"
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300"
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
            </motion.a>
            <motion.a
              href="/login"
              className="px-10 py-4 text-slate-300 font-bold rounded-xl border border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:text-white hover:border-slate-500 transition-all duration-300"
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Dashboard
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
