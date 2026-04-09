import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Activity, Bug } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  time: string;
}

interface AlertsFeedProps {
  alerts: Alert[];
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-400';
      case 'high': return 'border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'medium': return 'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-yellow-400';
      case 'low': return 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'border-border bg-muted/50 text-muted-foreground';
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('SQL') || type.includes('Injection')) return <Bug className="w-4 h-4" />;
    if (type.includes('DDoS')) return <Activity className="w-4 h-4" />;
    if (type.includes('Malware')) return <Shield className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="h-full space-y-3 overflow-y-auto pr-1">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent/60 dark:hover:bg-gray-800/80 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="truncate text-sm font-medium text-foreground">
                  {alert.type}
                </h4>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {alert.time}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Source: {alert.source}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {alerts.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No alerts at this time</p>
        </div>
      )}
    </div>
  );
};

export default AlertsFeed;
