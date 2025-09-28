import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboardStats, dummyAlerts, dummyWaterSamples } from '@/data/dummyData';
import { getCategoryBgColor, getCategoryColor } from '@/utils/hmpiCalculations';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Droplets,
    FileText
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

const DashboardHomeTab = () => {
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
      title: 'Safe Samples',
      value: dashboardStats.safeWater,
      description: 'Within safe limits',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8%'
    },
    {
      title: 'Moderate Risk',
      value: dashboardStats.moderateRisk,
      description: 'Requires attention',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: '+5%'
    },
    {
      title: 'High Risk',
      value: dashboardStats.highRisk,
      description: 'Immediate action needed',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-2%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Home</h1>
          <p className="text-muted-foreground">Welcome to the HMPI Admin Dashboard</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Water Quality Distribution</CardTitle>
            <CardDescription>Current sample distribution by risk category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pollutionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pollutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Sample collection and risk distribution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive chart will be implemented here</p>
                <p className="text-sm text-muted-foreground">Showing monthly sample trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Samples Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Samples</CardTitle>
          <CardDescription>Latest groundwater sample submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>HMPI Value</TableHead>
                <TableHead>Risk Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-medium">{sample.location}</TableCell>
                  <TableCell>{new Date(sample.date).toLocaleDateString()}</TableCell>
                  <TableCell>{sample.hmpiValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getCategoryBgColor(sample.category)} ${getCategoryColor(sample.category)}`}
                    >
                      {sample.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sample.status === 'Analyzed' ? 'default' : 'secondary'}>
                      {sample.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Critical Alerts ({criticalAlerts.length})
            </CardTitle>
            <CardDescription className="text-red-700">
              High-risk samples requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium text-red-800">{alert.title}</p>
                    <p className="text-sm text-red-600">{alert.message}</p>
                  </div>
                  <Badge variant="destructive">High Priority</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHomeTab;