"use client";

import { useState } from 'react';
import { Palette, Globe, Volume2, Monitor, Settings, Save, X } from 'lucide-react';
import { UserPreferences } from '@/types/settings';
import { cn } from '@/lib/utils/cn';

interface PreferencesProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => void;
  isLoading?: boolean;
}

export function Preferences({ preferences, onUpdate, isLoading }: PreferencesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState<Partial<UserPreferences>>({});

  const handleEdit = () => {
    setEditedPreferences(preferences);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedPreferences) {
      onUpdate(editedPreferences);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedPreferences({});
    setIsEditing(false);
  };

  const handleThemeChange = (theme: UserPreferences['theme']) => {
    if (isEditing) {
      setEditedPreferences(prev => ({ ...prev, theme }));
    } else {
      onUpdate({ theme });
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="glass-neon rounded-xl border border-green-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-green-400">Theme</h3>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Preferences
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-3">Color Theme</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'dark', label: 'Dark', description: 'Dark theme with neon accents' },
                { value: 'light', label: 'Light', description: 'Light theme for daytime use' },
                { value: 'auto', label: 'Auto', description: 'Follow system preference' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value as UserPreferences['theme'])}
                  className={cn(
                    "p-4 rounded-lg border transition-colors text-left",
                    preferences.theme === theme.value
                      ? "bg-green-500/20 border-green-500/50"
                      : "bg-black/30 border-green-500/20 hover:border-green-500/40"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      theme.value === 'dark' ? "bg-gray-900 border-gray-700" :
                      theme.value === 'light' ? "bg-white border-gray-300" :
                      "bg-gradient-to-r from-gray-900 to-white border-gray-500"
                    )} />
                    <span className="text-sm font-medium text-white">{theme.label}</span>
                  </div>
                  <p className="text-xs text-slate-400">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Localization Settings */}
      <div className="glass-neon rounded-xl border border-green-500/30 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Localization</h3>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Language</label>
                <select
                  value={editedPreferences.language || preferences.language}
                  onChange={(e) => setEditedPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Timezone</label>
                <select
                  value={editedPreferences.timezone || preferences.timezone}
                  onChange={(e) => setEditedPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Date Format</label>
                <select
                  value={editedPreferences.dateFormat || preferences.dateFormat}
                  onChange={(e) => setEditedPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Time Format</label>
                <select
                  value={editedPreferences.timeFormat || preferences.timeFormat}
                  onChange={(e) => setEditedPreferences(prev => ({ ...prev, timeFormat: e.target.value as '12h' | '24h' }))}
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                >
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Language</p>
                <p className="text-white font-medium">{preferences.language}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Timezone</p>
                <p className="text-white font-medium">{preferences.timezone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Date Format</p>
                <p className="text-white font-medium">{preferences.dateFormat}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Time Format</p>
                <p className="text-white font-medium">{preferences.timeFormat}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="glass-neon rounded-xl border border-green-500/30 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Volume2 className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Notifications</h3>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">Desktop Notifications</p>
                  <p className="text-xs text-slate-400">Show desktop alerts for important events</p>
                </div>
                 <input
                  type="checkbox"
                  checked={editedPreferences.notifications?.desktop ?? preferences.notifications.desktop}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    notifications: {
                      desktop: e.target.checked,
                      sound: prev.notifications?.sound ?? preferences.notifications.sound,
                      email: prev.notifications?.email ?? preferences.notifications.email,
                    }
                  }))}
                  className="w-4 h-4 text-green-400 bg-black/50 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">Sound Effects</p>
                  <p className="text-xs text-slate-400">Play sounds for alerts and notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={editedPreferences.notifications?.sound ?? preferences.notifications.sound}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    notifications: {
                      desktop: prev.notifications?.desktop ?? preferences.notifications.desktop,
                      sound: e.target.checked,
                      email: prev.notifications?.email ?? preferences.notifications.email,
                    }
                  }))}
                  className="w-4 h-4 text-green-400 bg-black/50 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">Email Notifications</p>
                  <p className="text-xs text-slate-400">Receive critical alerts via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={editedPreferences.notifications?.email ?? preferences.notifications.email}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    notifications: {
                      desktop: prev.notifications?.desktop ?? preferences.notifications.desktop,
                      sound: prev.notifications?.sound ?? preferences.notifications.sound,
                      email: e.target.checked,
                    }
                  }))}
                  className="w-4 h-4 text-green-400 bg-black/50 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-sm text-white font-medium">Desktop</p>
                <p className="text-xs text-slate-400">System notifications</p>
              </div>
              <div className={cn(
                "w-3 h-3 rounded-full",
                preferences.notifications.desktop ? "bg-green-400" : "bg-slate-400"
              )} />
            </div>
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-sm text-white font-medium">Sound</p>
                <p className="text-xs text-slate-400">Alert sounds</p>
              </div>
              <div className={cn(
                "w-3 h-3 rounded-full",
                preferences.notifications.sound ? "bg-green-400" : "bg-slate-400"
              )} />
            </div>
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-sm text-white font-medium">Email</p>
                <p className="text-xs text-slate-400">Email alerts</p>
              </div>
              <div className={cn(
                "w-3 h-3 rounded-full",
                preferences.notifications.email ? "bg-green-400" : "bg-slate-400"
              )} />
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Settings */}
      <div className="glass-neon rounded-xl border border-green-500/30 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Monitor className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Dashboard</h3>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Default Tab</label>
                <select
                  value={editedPreferences.dashboard?.defaultTab || preferences.dashboard.defaultTab}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    dashboard: {
                      ...(prev.dashboard || preferences.dashboard),
                      defaultTab: e.target.value,
                    }
                  }))}
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="incidents">Incidents</option>
                  <option value="alerts">Alerts</option>
                  <option value="detection">Detection</option>
                  <option value="soar">SOAR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Refresh Interval (seconds)</label>
                <input
                  type="number"
                  value={editedPreferences.dashboard?.refreshInterval || preferences.dashboard.refreshInterval}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    dashboard: {
                      defaultTab: prev.dashboard?.defaultTab ?? preferences.dashboard.defaultTab,
                      refreshInterval: parseInt(e.target.value) || 30,
                      compactMode: prev.dashboard?.compactMode ?? preferences.dashboard.compactMode,
                    }
                  }))}
                  min="10"
                  max="300"
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-sm text-white font-medium">Compact Mode</p>
                <p className="text-xs text-slate-400">Show more content in less space</p>
              </div>
              <input
                type="checkbox"
                checked={editedPreferences.dashboard?.compactMode ?? preferences.dashboard.compactMode}
                onChange={(e) => setEditedPreferences(prev => ({
                  ...prev,
                  dashboard: {
                    defaultTab: prev.dashboard?.defaultTab ?? preferences.dashboard.defaultTab,
                    refreshInterval: prev.dashboard?.refreshInterval ?? preferences.dashboard.refreshInterval,
                    compactMode: e.target.checked,
                  }
                }))}
                className="w-4 h-4 text-green-400 bg-black/50 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400">Default Tab</p>
              <p className="text-white font-medium capitalize">{preferences.dashboard.defaultTab}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Refresh Interval</p>
              <p className="text-white font-medium">{preferences.dashboard.refreshInterval}s</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Compact Mode</p>
              <p className="text-white font-medium">{preferences.dashboard.compactMode ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Settings */}
      <div className="glass-neon rounded-xl border border-green-500/30 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Accessibility</h3>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">Font Size</label>
                <select
                  value={editedPreferences.accessibility?.fontSize || preferences.accessibility.fontSize}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    accessibility: {
                      ...(prev.accessibility || preferences.accessibility),
                      fontSize: e.target.value as 'small' | 'medium' | 'large',
                    }
                  }))}
                  className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">High Contrast</p>
                  <p className="text-xs text-slate-400">Increase contrast for better visibility</p>
                </div>
                <input
                  type="checkbox"
                  checked={editedPreferences.accessibility?.highContrast ?? preferences.accessibility.highContrast}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    accessibility: {
                      highContrast: e.target.checked,
                      reducedMotion: prev.accessibility?.reducedMotion ?? preferences.accessibility.reducedMotion,
                      fontSize: prev.accessibility?.fontSize ?? preferences.accessibility.fontSize,
                    }
                  }))}
                  className="w-4 h-4 text-green-400 bg-black/50 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">Reduced Motion</p>
                  <p className="text-xs text-slate-400">Minimize animations and transitions</p>
                </div>
                <input
                  type="checkbox"
                  checked={editedPreferences.accessibility?.reducedMotion ?? preferences.accessibility.reducedMotion}
                  onChange={(e) => setEditedPreferences(prev => ({
                    ...prev,
                    accessibility: {
                      highContrast: prev.accessibility?.highContrast ?? preferences.accessibility.highContrast,
                      reducedMotion: e.target.checked,
                      fontSize: prev.accessibility?.fontSize ?? preferences.accessibility.fontSize,
                    }
                  }))}
                  className="w-4 h-4 text-green-400 bg-black/50 border border-green-500/30 rounded focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400">Font Size</p>
              <p className="text-white font-medium capitalize">{preferences.accessibility.fontSize}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">High Contrast</p>
              <p className="text-white font-medium">{preferences.accessibility.highContrast ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Reduced Motion</p>
              <p className="text-white font-medium">{preferences.accessibility.reducedMotion ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex items-center gap-3 pt-6 border-t border-green-500/20">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
