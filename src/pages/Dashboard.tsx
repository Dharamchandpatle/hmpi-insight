import { motion } from 'framer-motion';
import { 
  Droplets, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  MapPin,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { dummyWaterSamples, dashboardStats, dummyAlerts } from '@/data/dummyData';
import { getCategoryColor, getCategoryBgColor } from '@/utils/hmpiCalculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const Dashboard = () => {
  const { user } = useAuth();
  const recentSamples = dummyWaterSamples.slice(0, 5);
  const criticalAlerts = dummyAlerts.filter(alert => alert.severity === 'high' && !alert.read);

  const statCards = [
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
      title: 'Safe Water Sources',
      value: dashboardStats.safeWater,
      description: 'Within safety limits',
      icon: Activity,
      color: 'text-safe',
      bgColor: 'bg-safe/10',
      trend: '+5%'
    },
    {
      title: 'Pollution Detected',
      value: dashboardStats.pollutedWater,
      description: 'Requires attention',
      icon: AlertTriangle,
      color: 'text-moderate',
      bgColor: 'bg-moderate/10',
      trend: '-3%'
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts.length,
      description: 'Immediate action needed',
      icon: TrendingUp,
      color: 'text-highPollution',
      bgColor: 'bg-highPollution/10',
      trend: 'New'
    }
  ];

  return (
    <Layout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your environmental monitoring overview for today
            </p>
          </div>
          <Badge className="bg-safe text-safe-foreground px-3 py-1">
            System Online
          </Badge>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pollution Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Water Quality Distribution</span>
                </CardTitle>
                <CardDescription>
                  Current pollution levels across all monitoring sites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
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
                      <Tooltip
                        formatter={(value, name) => [value, `${name} Sites`]}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {pollutionData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
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

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Monitoring Trends</span>
                </CardTitle>
                <CardDescription>
                  Sample collection and pollution detection over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="samples" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="safe" 
                        stroke="hsl(var(--safe))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--safe))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Samples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Recent Samples</span>
                </CardTitle>
                <CardDescription>
                  Latest water quality tests and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSamples.map((sample, index) => (
                    <motion.div
                      key={sample.id}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getCategoryBgColor(sample.category)}`} />
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {sample.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            HMPI: {sample.hmpiValue}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${getCategoryColor(sample.category)}`}
                      >
                        {sample.category}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Critical Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-highPollution" />
                  <span>System Alerts</span>
                </CardTitle>
                <CardDescription>
                  Critical notifications requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dummyAlerts.slice(0, 4).map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.severity === 'high' 
                          ? 'bg-highPollution/10 border-highPollution/20' 
                          : alert.severity === 'medium'
                          ? 'bg-moderate/10 border-moderate/20'
                          : 'bg-muted/30 border-border'
                      }`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.location} • {new Date(alert.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs ml-2"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;