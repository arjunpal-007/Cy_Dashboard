"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { detectionAPI } from '@/lib/api/detection';
import { apiClient } from '@/lib/api-client';
import { useDetectionRealtime } from './use-detection-realtime';
import { DetectionRule, DetectionEvent, DetectionAnalytics, DetectionFilter, DetectionRuleType, DetectionSeverity, DetectionStatus } from '@/types/detection';

// Fallback mock data for development
const mockDetectionRules: DetectionRule[] = [
  {
    id: 'rule-1',
    name: 'Brute Force Detection',
    description: 'Detects multiple failed login attempts from same IP',
    type: 'threshold',
    severity: 'HIGH',
    status: 'ACTIVE',
    conditions: [
      {
        id: 'cond-1',
        field: 'login_attempts',
        operator: 'greater_than',
        value: 5,
        timeWindow: 300 // 5 minutes
      }
    ],
    actions: [
      {
        id: 'action-1',
        type: 'create_alert',
        parameters: { alert_type: 'brute_force', severity: 'HIGH' },
        enabled: true
      },
      {
        id: 'action-2',
        type: 'block_ip',
        parameters: { duration: 3600 }, // 1 hour
        enabled: true
      }
    ],
    riskScore: 75,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin@sentinelx.com',
    enabled: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 15),
    triggerCount: 42
  },
  {
    id: 'rule-2',
    name: 'SQL Injection Detection',
    description: 'Detects SQL injection patterns in HTTP requests',
    type: 'pattern',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    conditions: [
      {
        id: 'cond-2',
        field: 'request_body',
        operator: 'contains',
        value: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'SCRIPT']
      }
    ],
    actions: [
      {
        id: 'action-3',
        type: 'create_alert',
        parameters: { alert_type: 'sql_injection', severity: 'CRITICAL' },
        enabled: true
      },
      {
        id: 'action-4',
        type: 'block_ip',
        parameters: { duration: 86400 }, // 24 hours
        enabled: true
      }
    ],
    riskScore: 95,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'admin@sentinelx.com',
    enabled: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 30),
    triggerCount: 8
  },
  {
    id: 'rule-3',
    name: 'DDoS Detection',
    description: 'Detects unusual request volume spikes',
    type: 'threshold',
    severity: 'HIGH',
    status: 'ACTIVE',
    conditions: [
      {
        id: 'cond-3',
        field: 'requests_per_second',
        operator: 'greater_than',
        value: 100,
        timeWindow: 60
      }
    ],
    actions: [
      {
        id: 'action-5',
        type: 'create_alert',
        parameters: { alert_type: 'ddos', severity: 'HIGH' },
        enabled: true
      },
      {
        id: 'action-6',
        type: 'send_notification',
        parameters: { channels: ['email', 'slack'] },
        enabled: true
      }
    ],
    riskScore: 80,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'security@team.com',
    enabled: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 45),
    triggerCount: 15
  },
  {
    id: 'rule-4',
    name: 'XSS Detection',
    description: 'Detects cross-site scripting patterns',
    type: 'pattern',
    severity: 'HIGH',
    status: 'ACTIVE',
    conditions: [
      {
        id: 'cond-4',
        field: 'request_parameters',
        operator: 'contains',
        value: ['<script>', 'javascript:', 'onload=', 'onerror=', 'eval(']
      }
    ],
    actions: [
      {
        id: 'action-7',
        type: 'create_alert',
        parameters: { alert_type: 'xss', severity: 'HIGH' },
        enabled: true
      }
    ],
    riskScore: 85,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'analyst1@company.com',
    enabled: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 2),
    triggerCount: 3
  },
  {
    id: 'rule-5',
    name: 'Unusual Login Location',
    description: 'Detects logins from new geographic locations',
    type: 'behavior',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    conditions: [
      {
        id: 'cond-5',
        field: 'login_location',
        operator: 'not_in',
        value: ['US', 'CA', 'UK', 'DE', 'FR'], // Known locations
        timeWindow: 86400 // 24 hours
      }
    ],
    actions: [
      {
        id: 'action-8',
        type: 'create_alert',
        parameters: { alert_type: 'unusual_location', severity: 'MEDIUM' },
        enabled: true
      },
      {
        id: 'action-9',
        type: 'send_notification',
        parameters: { channels: ['email'] },
        enabled: true
      }
    ],
    riskScore: 60,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    createdBy: 'analyst1@company.com',
    enabled: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 6),
    triggerCount: 12
  }
];

// Mock detection events
function generateMockDetectionEvents(count: number = 50): DetectionEvent[] {
  const events: DetectionEvent[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const rule = mockDetectionRules[Math.floor(Math.random() * mockDetectionRules.length)];
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    events.push({
      id: `detection-${Date.now()}-${i}`,
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      riskScore: Math.floor(Math.random() * 30) + rule.riskScore - 15,
      timestamp,
      sourceLogId: `log-${Date.now()}-${i}`,
      matchedConditions: rule.conditions.map(c => c.field),
      description: `Detection rule "${rule.name}" triggered by ${rule.conditions[0].field} ${rule.conditions[0].operator} ${rule.conditions[0].value}`,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      userId: Math.random() < 0.3 ? `user-${Math.floor(Math.random() * 1000)}` : undefined,
      endpoint: Math.random() < 0.5 ? '/api/login' : '/api/users',
      payload: {
        request_size: Math.floor(Math.random() * 10000),
        response_time: Math.floor(Math.random() * 1000) + 100,
        status_code: Math.random() < 0.2 ? 401 : Math.random() < 0.5 ? 403 : 200
      }
    });
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function useDetection(initialFilter: Partial<DetectionFilter> = {}) {
  const [rules, setRules] = useState<DetectionRule[]>(mockDetectionRules);
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [filter, setFilter] = useState<DetectionFilter>({
    search: '',
    type: [],
    severity: [],
    status: [],
    enabled: undefined,
    riskScoreRange: [0, 100],
    ...initialFilter
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [useRealAPI, setUseRealAPI] = useState(false);

  // Real-time WebSocket integration
  const { threats, alerts, isConnected, connect, disconnect } = useDetectionRealtime();

  // Load rules from API
  const loadRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiRules = await detectionAPI.getRules();
      setRules(apiRules);
      setUseRealAPI(true);
    } catch (error) {
      console.error('Failed to load rules from API, using fallback data:', error);
      setRules(mockDetectionRules);
      setUseRealAPI(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load detections from API
  const loadDetections = useCallback(async () => {
    try {
      const apiDetections = await detectionAPI.getDetections();
      setEvents(apiDetections);
    } catch (error) {
      console.error('Failed to load detections from API:', error);
      // Fallback to mock data
      setEvents(generateMockDetectionEvents(50));
    }
  }, []);

  // Load analytics from API
  const loadAnalytics = useCallback(async () => {
    try {
      return await detectionAPI.getAnalytics();
    } catch (error) {
      console.error('Failed to load analytics from API:', error);
      // Return mock analytics
      return generateMockAnalytics(events);
    }
  }, [events]);

  // Initialize data on mount
  useEffect(() => {
    loadRules();
    loadDetections();
  }, [loadRules, loadDetections]);

  // Update events from WebSocket
  useEffect(() => {
    if (isConnected && threats.length > 0) {
      setEvents(prev => [...(threats as unknown as DetectionEvent[]), ...prev].slice(0, 500));
    }
  }, [threats, isConnected]);

  // Update rule trigger counts from real-time data
  useEffect(() => {
    if (isConnected && threats.length > 0) {
      setRules(prev => prev.map(rule => {
        const recentTriggers = (threats as unknown as DetectionEvent[]).filter(event => event.ruleId === rule.id);
        if (recentTriggers.length > 0) {
          return {
            ...rule,
            triggerCount: rule.triggerCount + recentTriggers.length,
            lastTriggered: new Date(Math.max(...recentTriggers.map(t => t.timestamp.getTime())))
          };
        }
        return rule;
      }));
    }
  }, [threats, isConnected]);

  // Mock analytics generator (fallback)
  const generateMockAnalytics = useCallback((events: DetectionEvent[]) => {
    const totalDetections = events.length;
    const criticalDetections = events.filter(event => event.severity === 'CRITICAL').length;
    
    // Detections over time (last 24 hours)
    const detectionsOverTime = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
      const count = events.filter(event => {
        const eventTime = new Date(event.timestamp);
        return eventTime >= time && eventTime < new Date(time.getTime() + 60 * 60 * 1000);
      }).length;
      const critical = events.filter(event => {
        const eventTime = new Date(event.timestamp);
        return eventTime >= time && eventTime < new Date(time.getTime() + 60 * 60 * 1000) && event.severity === 'CRITICAL';
      }).length;
      
      return {
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count,
        critical
      };
    });

    // Top triggered rules
    const ruleCounts = events.reduce((acc, event) => {
      acc[event.ruleId] = (acc[event.ruleId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTriggeredRules = Object.entries(ruleCounts)
      .map(([ruleId, count]) => {
        const rule = rules.find(r => r.id === ruleId);
        return {
          ruleId,
          ruleName: rule?.name || 'Unknown',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Detection types
    const typeCounts = rules.reduce((acc, rule) => {
      acc[rule.type] = (acc[rule.type] || 0) + 1;
      return acc;
    }, {} as Record<DetectionRuleType, number>);

    const detectionTypes = Object.entries(typeCounts)
      .map(([type, count]) => ({ type: type as DetectionRuleType, count }))
      .sort((a, b) => b.count - a.count);

    // Severity distribution
    const severityCounts = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<DetectionSeverity, number>);

    const severityDistribution = Object.entries(severityCounts)
      .map(([severity, count]) => ({ severity: severity as DetectionSeverity, count }))
      .sort((a, b) => {
        const severityOrder: Record<DetectionSeverity, number> = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });

    const averageRiskScore = events.length > 0 
      ? events.reduce((sum, event) => sum + event.riskScore, 0) / events.length 
      : 0;

    return {
      totalDetections,
      detectionsOverTime,
      topTriggeredRules,
      detectionTypes,
      severityDistribution,
      averageRiskScore,
      falsePositiveRate: 2.3, // Mock value
      detectionLatency: 150 // Mock value in milliseconds
    };
  }, [rules, events]);

  // Filter rules
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        if (!rule.name.toLowerCase().includes(searchLower) &&
            !rule.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Type filter
      if (filter.type?.length > 0 && !filter.type.includes(rule.type)) {
        return false;
      }

      // Severity filter
      if (filter.severity?.length > 0 && !filter.severity.includes(rule.severity)) {
        return false;
      }

      // Status filter
      if (filter.status?.length > 0 && !filter.status.includes(rule.status)) {
        return false;
      }

      // Enabled filter
      if (filter.enabled !== undefined && rule.enabled !== filter.enabled) {
        return false;
      }

      // Risk score range filter
      if (rule.riskScore < filter.riskScoreRange[0] || rule.riskScore > filter.riskScoreRange[1]) {
        return false;
      }

      return true;
    });
  }, [rules, filter]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        if (!event.ruleName.toLowerCase().includes(searchLower) &&
            !event.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Severity filter
      if (filter.severity?.length > 0 && !filter.severity.includes(event.severity)) {
        return false;
      }

      return true;
    });
  }, [events, filter]);

  // Analytics
  const analytics = useMemo((): DetectionAnalytics => {
    return generateMockAnalytics(filteredEvents);
  }, [filteredEvents, rules, generateMockAnalytics]);

  const updateFilter = useCallback((newFilter: Partial<DetectionFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilter({
      search: '',
      type: [],
      severity: [],
      status: [],
      enabled: undefined,
      riskScoreRange: [0, 100]
    });
  }, []);

  const createRule = useCallback((rule: Omit<DetectionRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => {
    const newRule: DetectionRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      triggerCount: 0
    };
    setRules(prev => [...prev, newRule]);
  }, []);

  const updateRule = useCallback((ruleId: string, updates: Partial<DetectionRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, ...updates, updatedAt: new Date() }
        : rule
    ));
  }, []);

  const deleteRule = useCallback((ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, []);

  const exportDetections = useCallback((format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? convertToCSV(filteredEvents)
      : JSON.stringify(filteredEvents, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detections-${new Date().toISOString()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredEvents]);

  return {
    rules: filteredRules,
    events: filteredEvents,
    analytics,
    filter,
    isLoading,
    isLiveStreaming,
    updateFilter,
    clearFilter,
    setIsLiveStreaming,
    createRule,
    updateRule,
    deleteRule,
    exportDetections,
    trainAI: async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.post('/ai/train');
        return response;
      } catch (error) {
        console.error('Failed to train AI model:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    refreshDetections: () => setEvents(generateMockDetectionEvents(100))
  };
}

function convertToCSV(events: DetectionEvent[]): string {
  const headers = ['ID', 'Rule Name', 'Severity', 'Risk Score', 'Timestamp', 'IP Address', 'User ID', 'Endpoint'];
  const rows = events.map(event => [
    event.id,
    event.ruleName,
    event.severity,
    event.riskScore,
    event.timestamp.toISOString(),
    event.ipAddress || '',
    event.userId || '',
    event.endpoint || ''
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
