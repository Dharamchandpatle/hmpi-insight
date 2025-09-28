import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Droplets,
    XCircle
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DashboardHomeTab = () => {
  // Calculate KPIs from dummy data
  const totalSamples = dummyWaterSamples.length;
  const safeSamples = dummyWaterSamples.filter(sample => sample.category === 'Safe').length;
  const moderateSamples = dummyWaterSamples.filter(sample => sample.category === 'Moderate').length;
  const highRiskSamples = dummyWaterSamples.filter(sample => sample.category === 'High Risk').length;

  // Recent samples (last 5)
  const recentSamples = dummyWaterSamples.slice(-5).reverse();

  // Chart data for risk distribution
  const riskDistributionData = [
    { name: 'Safe', value: safeSamples, color: '#22c55e' },
    { name: 'Moderate', value: moderateSamples, color: '#eab308' },
    { name: 'High Risk', value: highRiskSamples, color: '#ef4444' }
  ];

  // Chart data for monthly trends (mock data)
  const monthlyTrendsData = [
    { month: 'Jan', safe: 12, moderate: 8, highRisk: 3 },
    { month: 'Feb', safe: 15, moderate: 6, highRisk: 2 },
    { month: 'Mar', safe: 18, moderate: 9, highRisk: 4 },
    { month: 'Apr', safe: 14, moderate: 7, highRisk: 1 },
    { month: 'May', safe: 20, moderate: 5, highRisk: 3 },
    { month: 'Jun', safe: 16, moderate: 8, highRisk: 2 }
  ];

  const getRiskBadgeVariant = (category) => {
    switch (category) {
      case 'Safe': return 'default';
      case 'Moderate': return 'secondary';
      case 'High Risk': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskIcon = (category) => {
    switch (category) {
      case 'Safe': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Moderate': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'High Risk': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Welcome back, Dr. Chen!</h2>
              <p className="text-blue-100 text-lg">Ready to analyze today's water quality data</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Last updated: Today 9:30 AM</span>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </motion.div>

      {/* KPIs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Samples</CardTitle>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">{totalSamples}</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  +12% from last month
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-100">Safe Samples</CardTitle>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">{safeSamples}</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {((safeSamples / totalSamples) * 100).toFixed(1)}% of total
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Moderate Risk</CardTitle>
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-1">{moderateSamples}</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {((moderateSamples / totalSamples) * 100).toFixed(1)}% of total
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-red-900 dark:text-red-100">High Risk</CardTitle>
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                <XCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-red-700 dark:text-red-300 mb-1">{highRiskSamples}</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {((highRiskSamples / totalSamples) * 100).toFixed(1)}% of total
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Current sample risk categorization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Sample quality trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="safe" stackId="a" fill="#22c55e" />
                  <Bar dataKey="moderate" stackId="a" fill="#eab308" />
                  <Bar dataKey="highRisk" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Samples Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent HMPI Calculations</CardTitle>
            <CardDescription>Latest sample analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSamples.map((sample) => (
                <div key={sample.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getRiskIcon(sample.category)}
                    <div>
                      <p className="font-medium">{sample.location}</p>
                      <p className="text-sm text-muted-foreground">
                        Sample ID: {sample.id} • {sample.collectionDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">HMPI: {sample.hmpiValue}</p>
                      <p className="text-sm text-muted-foreground">
                        {sample.category}
                      </p>
                    </div>
                    <Badge variant={getRiskBadgeVariant(sample.category)}>
                      {sample.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardHomeTab;