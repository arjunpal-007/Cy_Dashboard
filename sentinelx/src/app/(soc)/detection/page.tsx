"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, RotateCcw, Plus, Settings, Activity, AlertTriangle, Target, Brain } from 'lucide-react';
import { useDetection } from '@/hooks/use-detection';
import { useDetectionRealtime } from '@/hooks/use-detection-realtime';
import { DetectionRulesTable } from '@/components/detection/detection-rules-table';
import { DetectionAnalytics } from '@/components/detection/detection-analytics';
import { RealTimeMonitor } from '@/components/detection/real-time-monitor';
import { DetectionRule, DetectionStatus } from '@/types/detection';

export default function DetectionPage() {
  const {
    rules,
    events,
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
    trainAI,
    refreshDetections
  } = useDetection();

  const {
    isConnected: wsConnected,
    connectionStatus,
    threats,
    alerts,
    lastMessage,
    connect,
    disconnect,
    clearThreats,
    clearAlerts
  } = useDetectionRealtime();

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [showCreateRule, setShowCreateRule] = useState(false);

  const selectedRule = rules.find(rule => rule.id === selectedRuleId);

  const handleRuleSelect = useCallback((ruleId: string) => {
    setSelectedRuleId(ruleId);
  }, []);

  const handleRuleEdit = useCallback((ruleId: string) => {
    // TODO: Implement rule editor
    console.log('Edit rule:', ruleId);
  }, []);

  const handleRuleDelete = useCallback((ruleId: string) => {
    deleteRule(ruleId);
  }, [deleteRule]);

  const handleRuleToggle = useCallback((ruleId: string, enabled: boolean) => {
    updateRule(ruleId, { 
      enabled,
      status: enabled ? 'ACTIVE' : 'INACTIVE'
    });
  }, [updateRule]);

  const handleCreateRule = useCallback((rule: Omit<DetectionRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => {
    createRule(rule);
    setShowCreateRule(false);
  }, [createRule]);

  return (
    <main className="grid-bg min-h-screen p-6">
      <div className="mx-auto w-full max-w-[1800px] space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-green-400">Threat Detection Engine</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time threat detection and automated response system
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Create Rule */}
            <button
              onClick={() => setShowCreateRule(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Rule
            </button>

            {/* Live Stream Toggle */}
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiveStreaming
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-black/50 hover:bg-black/70 text-green-400 border border-green-500/30'
              }`}
            >
              {isLiveStreaming ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Engine
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Engine
                </>
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={refreshDetections}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-green-400 border border-green-500/30 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Refresh
            </button>

            {/* Train AI */}
            <button
              onClick={async () => {
                try {
                  await trainAI();
                  alert("AI Model trained successfully!");
                } catch (e) {
                  alert("Training failed: Not enough logs in database yet.");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20"
            >
              <Brain className="h-4 w-4" />
              Train AI
            </button>

            {/* Export */}
            <button
              onClick={() => exportDetections('json')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Engine Status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="glass-neon rounded-xl border border-green-500/30 p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-green-400">Engine Status</p>
                <p className="text-lg font-bold text-white">{isLiveStreaming ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>

          <div className="glass-neon rounded-xl border border-green-500/30 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-xs text-green-400">Active Rules</p>
                <p className="text-lg font-bold text-white">{rules.filter(r => r.enabled).length}</p>
              </div>
            </div>
          </div>

          <div className="glass-neon rounded-xl border border-green-500/30 p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-green-400">Total Rules</p>
                <p className="text-lg font-bold text-white">{rules.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-neon rounded-xl border border-green-500/30 p-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-xs text-green-400">Avg Risk Score</p>
                <p className="text-lg font-bold text-white">{analytics.averageRiskScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DetectionAnalytics analytics={analytics} />
        </motion.div>

        {/* Real-time Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div>
            <DetectionRulesTable
              rules={rules}
              selectedRuleId={selectedRuleId}
              onRuleSelect={handleRuleSelect}
              onRuleEdit={handleRuleEdit}
              onRuleDelete={handleRuleDelete}
              onRuleToggle={handleRuleToggle}
              isLoading={isLoading}
            />
          </div>
          
          <div>
            <RealTimeMonitor
              events={events}
              isLiveStreaming={wsConnected}
            />
          </div>
        </motion.div>

        {/* Engine Status Indicators */}
        {isLiveStreaming && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg shadow-lg neon-pulse">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Detection Engine Active</span>
          </div>
        )}

        {/* Critical Detection Alert */}
        {analytics?.severityDistribution?.find(s => s.severity === 'CRITICAL')?.count && 
         analytics.severityDistribution.find(s => s.severity === 'CRITICAL')!.count > 0 && (
          <div className="fixed top-20 right-6 flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg border border-red-600 neon-pulse">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {analytics.severityDistribution.find(s => s.severity === 'CRITICAL')?.count} Critical Detection{(analytics.severityDistribution.find(s => s.severity === 'CRITICAL')?.count || 0) > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* WebSocket Connection Status */}
        {wsConnected && (
          <div className="fixed top-20 left-6 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm font-medium">WebSocket Connected</span>
          </div>
        )}

        {/* Create Rule Modal */}
        {showCreateRule && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black/90 border border-green-500/30 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Create Detection Rule</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-green-400">Rule Name</label>
                  <input
                    type="text"
                    placeholder="Enter rule name..."
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-green-400">Description</label>
                  <textarea
                    placeholder="Describe what this rule detects..."
                    rows={3}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-green-400">Detection Type</label>
                  <select className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                    <option value="threshold">Threshold Detection</option>
                    <option value="pattern">Pattern Detection</option>
                    <option value="behavior">Behavior Analysis</option>
                    <option value="anomaly">Anomaly Detection</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-green-400">Severity</label>
                  <select className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setShowCreateRule(false)}
                  className="px-4 py-2 text-slate-400 hover:text-green-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement actual rule creation
                    console.log('Create rule');
                    setShowCreateRule(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
                >
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
