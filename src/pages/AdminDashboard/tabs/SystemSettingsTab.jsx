import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Bell,
    Database,
    Save,
    Settings,
    Shield
} from 'lucide-react';
import { useState } from 'react';

const SystemSettingsTab = () => {
  const [settings, setSettings] = useState({
    // Alert Thresholds
    hmpiThresholds: {
      safe: 25,
      moderate: 50,
      high: 75
    },
    // Notification Settings
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      alertFrequency: 'immediate'
    },
    // System Configuration
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetentionDays: 365,
      maintenanceMode: false
    },
    // Security Settings
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      twoFactorAuth: false,
      ipWhitelist: false
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const settingSections = [
    {
      id: 'thresholds',
      title: 'Alert Thresholds',
      description: 'Configure HMPI thresholds for different pollution levels',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="safe-threshold">Safe Threshold (HMPI)</Label>
            <Input
              id="safe-threshold"
              type="number"
              value={settings.hmpiThresholds.safe}
              onChange={(e) => handleSettingChange('hmpiThresholds', 'safe', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Values below this are considered safe</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="moderate-threshold">Moderate Threshold (HMPI)</Label>
            <Input
              id="moderate-threshold"
              type="number"
              value={settings.hmpiThresholds.moderate}
              onChange={(e) => handleSettingChange('hmpiThresholds', 'moderate', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Values in this range need monitoring</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="high-threshold">High Threshold (HMPI)</Label>
            <Input
              id="high-threshold"
              type="number"
              value={settings.hmpiThresholds.high}
              onChange={(e) => handleSettingChange('hmpiThresholds', 'high', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Values above this require immediate action</p>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Configure how and when alerts are sent',
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Send alerts via email</p>
            </div>
            <Switch
              checked={settings.notifications.emailAlerts}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'emailAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Alerts</Label>
              <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
            </div>
            <Switch
              checked={settings.notifications.smsAlerts}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'smsAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Send push notifications to mobile app</p>
            </div>
            <Switch
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label>Alert Frequency</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={settings.notifications.alertFrequency}
              onChange={(e) => handleSettingChange('notifications', 'alertFrequency', e.target.value)}
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly Summary</option>
              <option value="daily">Daily Summary</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'system',
      title: 'System Configuration',
      description: 'General system settings and maintenance',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup system data</p>
            </div>
            <Switch
              checked={settings.system.autoBackup}
              onCheckedChange={(checked) => handleSettingChange('system', 'autoBackup', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label>Backup Frequency</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={settings.system.backupFrequency}
              onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Data Retention (Days)</Label>
            <Input
              type="number"
              value={settings.system.dataRetentionDays}
              onChange={(e) => handleSettingChange('system', 'dataRetentionDays', parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
            </div>
            <Switch
              checked={settings.system.maintenanceMode}
              onCheckedChange={(checked) => handleSettingChange('system', 'maintenanceMode', checked)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Configure security and access control',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Session Timeout (minutes)</Label>
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum Password Length</Label>
            <Input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP Whitelist</Label>
              <p className="text-sm text-muted-foreground">Restrict access to whitelisted IPs</p>
            </div>
            <Switch
              checked={settings.security.ipWhitelist}
              onCheckedChange={(checked) => handleSettingChange('security', 'ipWhitelist', checked)}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
          <p className="text-muted-foreground">Configure system thresholds, notifications, and security</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={!hasChanges}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${section.color}`} />
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {section.content}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>System Status</span>
          </CardTitle>
          <CardDescription>Current system configuration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
              <span className="text-sm">System Status</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {settings.notifications.alertFrequency}
              </Badge>
              <span className="text-sm">Alert Frequency</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {settings.system.backupFrequency}
              </Badge>
              <span className="text-sm">Backup Schedule</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {settings.security.sessionTimeout}m
              </Badge>
              <span className="text-sm">Session Timeout</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemSettingsTab;