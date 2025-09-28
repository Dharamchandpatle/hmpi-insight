import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Droplets,
    MapPin,
    XCircle
} from 'lucide-react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DashboardHomeTab = () => {
  // Calculate KPIs from dummy data
  const totalSamples = dummyWaterSamples.length;
  const safeSamples = dummyWaterSamples.filter(sample => sample.category === 'Safe').length;
  const moderateSamples = dummyWaterSamples.filter(sample => sample.category === 'Moderate').length;
  const highRiskSamples = dummyWaterSamples.filter(sample => sample.category === 'High' || sample.category === 'High Risk').length;

  const safePercentage = ((safeSamples / totalSamples) * 100).toFixed(1);
  const moderatePercentage = ((moderateSamples / totalSamples) * 100).toFixed(1);
  const highRiskPercentage = ((highRiskSamples / totalSamples) * 100).toFixed(1);

  // Recent samples (last 5)
  const recentSamples = dummyWaterSamples.slice(-5).reverse();

  // Chart data for risk distribution
  const riskDistributionData = [
    { name: 'Safe', value: safeSamples, color: '#22c55e', percentage: safePercentage },
    { name: 'Moderate', value: moderateSamples, color: '#eab308', percentage: moderatePercentage },
    { name: 'High Risk', value: highRiskSamples, color: '#ef4444', percentage: highRiskPercentage }
  ];

  // Chart data for monthly trends (mock data for policymaker view)
  const monthlyTrendsData = [
    { month: 'Jan', safe: 12, moderate: 8, highRisk: 3, total: 23 },
    { month: 'Feb', safe: 15, moderate: 6, highRisk: 2, total: 23 },
    { month: 'Mar', safe: 18, moderate: 9, highRisk: 4, total: 31 },
    { month: 'Apr', safe: 14, moderate: 7, highRisk: 1, total: 22 },
    { month: 'May', safe: 20, moderate: 5, highRisk: 3, total: 28 },
    { month: 'Jun', safe: 16, moderate: 8, highRisk: 2, total: 26 }
  ];

  // Policy impact metrics (mock data)
  const policyMetrics = {
    regionsMonitored: 12,
    activePolicies: 8,
    interventionsCompleted: 15,
    communitiesAffected: 25000
  };

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
      case 'Safe': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Moderate': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'High Risk': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Droplets className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSamples}</div>
              <p className="text-xs text-muted-foreground">
                Across {policyMetrics.regionsMonitored} regions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safe Samples</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{safePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {safeSamples} out of {totalSamples} samples
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{moderatePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {moderateSamples} samples require attention
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highRiskPercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {highRiskSamples} samples need immediate action
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Policy Impact Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Policy Impact Overview
            </CardTitle>
            <CardDescription>
              Current status of environmental policies and interventions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{policyMetrics.regionsMonitored}</div>
                <p className="text-sm text-muted-foreground">Regions Monitored</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{policyMetrics.activePolicies}</div>
                <p className="text-sm text-muted-foreground">Active Policies</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{policyMetrics.interventionsCompleted}</div>
                <p className="text-sm text-muted-foreground">Interventions Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{policyMetrics.communitiesAffected.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Communities Affected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Distribution</CardTitle>
              <CardDescription>
                Current risk assessment across all monitored samples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
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

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Monitoring Trends</CardTitle>
              <CardDescription>
                Sample collection and risk assessment over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Samples"
                  />
                  <Line
                    type="monotone"
                    dataKey="highRisk"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="High Risk"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Samples Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent HMPI Assessments</CardTitle>
            <CardDescription>
              Latest groundwater quality assessments and risk evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">HMPI Score</th>
                    <th className="text-left p-2">Risk Category</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSamples.map((sample, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {sample.location}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {sample.collectionDate}
                        </div>
                      </td>
                      <td className="p-2 font-medium">{sample.hmpiValue}</td>
                      <td className="p-2">
                        <Badge variant={getRiskBadgeVariant(sample.category === 'High' ? 'High Risk' : sample.category)}>
                          {sample.category === 'High' ? 'High Risk' : sample.category}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {getRiskIcon(sample.category)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardHomeTab;