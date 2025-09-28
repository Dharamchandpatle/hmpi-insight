import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats, dummyAlerts, dummyUsers, dummyWaterSamples } from '@/data/dummyData';
import { getCategoryBgColor, getCategoryColor } from '@/utils/hmpiCalculations';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Database,
    Droplets,
    FileText,
    Settings,
    Users
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Chart data for trends
const trendData = [
  { month: 'Oct', samples: 45, safe: 32, moderate: 10, high: 3 },
  { month: 'Nov', samples: 52, safe: 38, moderate: 11, high: 3 },
  { month: 'Dec', samples: 48, safe: 34, moderate: 10, high: 4 },
  { month: 'Jan', samples: 50, safe: 35, moderate: 12, high: 3 },
];

const pollutionData = [
  { name: 'Safe', value: dashboardStats.safeWater, color: 'hsl(var(--safe))' },
  { name: 'Moderate', value: dummyWaterSamples.filter(s => s.category === 'Moderate').length, color: 'hsl(var(--moderate))' },
  { name: 'High', value: dummyWaterSamples.filter(s => s.category === 'High').length, color: 'hsl(var(--high-pollution))' },
];

const OverviewTab = () => {
  const recentSamples = dummyWaterSamples.slice(0, 5);
  const criticalAlerts = dummyAlerts.filter(alert => alert.severity === 'high' && !alert.read);

  const adminStatCards = [
    {
      title: 'Total Samples',
      value: dashboardStats.totalSamples,
      description: 'Active monitoring points',
      icon: Droplets,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12%'
    },
    {
      title: 'Active Users',
      value: dummyUsers.length,
      description: 'System users',
      icon: Users,
      color: 'text-safe',
      bgColor: 'bg-safe/10',
      trend: '+2'
    },
    {
      title: 'System Health',
      value: '98%',
      description: 'Uptime this month',
      icon: Activity,
      color: 'text-moderate',
      bgColor: 'bg-moderate/10',
      trend: 'Stable'
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts.length,
      description: 'Immediate action needed',
      icon: AlertTriangle,
      color: 'text-highPollution',
      bgColor: 'bg-highPollution/10',
      trend: 'New'
    }
  ];

  const adminQuickActions = [
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      icon: Users,
      path: '#users',
      color: 'bg-blue-500'
    },
    {
      title: 'System Settings',
      description: 'Configure thresholds and alerts',
      icon: Settings,
      path: '#settings',
      color: 'bg-green-500'
    },
    {
      title: 'Data Overview',
      description: 'View all monitoring data',
      icon: Database,
      path: '#data',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports',
      description: 'Generate system reports',
      icon: FileText,
      path: '#analytics',
      color: 'bg-orange-500'
    }
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-environmental transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground animate-counter">
                      {stat.value}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Administrative tools and system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminQuickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      if (action.path.startsWith('#')) {
                        // Navigate to tab
                        const tabId = action.path.replace('#', '');
                        window.location.href = `/admin/dashboard/${tabId}`;
                      } else {
                        window.location.href = action.path;
                      }
                    }}
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pollution Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle>Pollution Distribution</CardTitle>
              <CardDescription>
                Current water quality status across all monitored locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pollutionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pollutionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {pollutionData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system events and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSamples.slice(0, 4).map((sample, index) => (
                  <div key={sample.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getCategoryBgColor(sample.category)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Sample collected at {sample.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sample.collectionDate} • HMPI: {sample.hmpiValue}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getCategoryColor(sample.category)}`}
                    >
                      {sample.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;