import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboardStats, dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Calendar,
    Download,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// Generate trend data for the last 12 months
const generateTrendData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    const baseSamples = 40 + Math.random() * 20;
    const safe = Math.floor(baseSamples * (0.6 + Math.random() * 0.2));
    const moderate = Math.floor(baseSamples * (0.25 + Math.random() * 0.15));
    const high = Math.floor(baseSamples * (0.05 + Math.random() * 0.1));
    return {
      month,
      total: safe + moderate + high,
      safe,
      moderate,
      high,
      averageHMPI: 25 + Math.random() * 30
    };
  });
};

const AnalyticsTab = () => {
  const trendData = generateTrendData();

  // Location-based analysis
  const locationData = dummyWaterSamples.reduce((acc, sample) => {
    const existing = acc.find(item => item.location === sample.location);
    if (existing) {
      existing.samples++;
      existing.totalHMPI += sample.hmpiValue;
      existing.averageHMPI = existing.totalHMPI / existing.samples;
    } else {
      acc.push({
        location: sample.location,
        samples: 1,
        totalHMPI: sample.hmpiValue,
        averageHMPI: sample.hmpiValue
      });
    }
    return acc;
  }, []).sort((a, b) => b.samples - a.samples).slice(0, 10);

  // Category distribution
  const categoryData = [
    { name: 'Safe', value: dummyWaterSamples.filter(s => s.category === 'Safe').length, color: 'hsl(var(--safe))' },
    { name: 'Moderate', value: dummyWaterSamples.filter(s => s.category === 'Moderate').length, color: 'hsl(var(--moderate))' },
    { name: 'High', value: dummyWaterSamples.filter(s => s.category === 'High').length, color: 'hsl(var(--high-pollution))' }
  ];

  // Parameter trends
  const parameterData = trendData.map(item => ({
    month: item.month,
    pH: 7 + (Math.random() - 0.5) * 2,
    temperature: 25 + (Math.random() - 0.5) * 10,
    turbidity: 5 + Math.random() * 15,
    dissolvedOxygen: 8 + Math.random() * 4
  }));

  const handleExportAnalytics = () => {
    const analyticsData = {
      trendData,
      locationData,
      categoryData,
      parameterData,
      summary: {
        totalSamples: dashboardStats.totalSamples,
        averageHMPI: trendData.reduce((sum, item) => sum + item.averageHMPI, 0) / trendData.length,
        mostActiveLocation: locationData[0]?.location || 'N/A',
        pollutionTrend: 'stable'
      }
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const analyticsCards = [
    {
      title: 'Total Samples',
      value: dashboardStats.totalSamples,
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Average HMPI',
      value: '32.4',
      change: '-2.1%',
      trend: 'down',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      title: 'Monitoring Locations',
      value: locationData.length,
      change: '+3',
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Data Quality',
      value: '98.5%',
      change: '+0.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600'
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
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Advanced analytics and reporting for water quality monitoring</p>
        </div>
        <Button onClick={handleExportAnalytics} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-environmental transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground">
                      {card.value}
                    </div>
                    <Badge variant="secondary" className={`text-xs flex items-center space-x-1 ${
                      card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      <span>{card.change}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HMPI Trends Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle>HMPI Trends Over Time</CardTitle>
              <CardDescription>
                Monthly water quality trends and pollution levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="safe"
                    stackId="1"
                    stroke="hsl(var(--safe))"
                    fill="hsl(var(--safe))"
                  />
                  <Area
                    type="monotone"
                    dataKey="moderate"
                    stackId="1"
                    stroke="hsl(var(--moderate))"
                    fill="hsl(var(--moderate))"
                  />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke="hsl(var(--high-pollution))"
                    fill="hsl(var(--high-pollution))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pollution Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle>Pollution Distribution</CardTitle>
              <CardDescription>
                Current distribution of water quality categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {categoryData.map((item, index) => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>
                Top monitoring locations by sample count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="samples" fill="hsl(var(--primary))" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Parameter Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle>Water Parameter Trends</CardTitle>
              <CardDescription>
                Monthly trends for key water quality parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={parameterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="pH"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--moderate))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="dissolvedOxygen"
                    stroke="hsl(var(--safe))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-sm text-muted-foreground">pH</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-moderate rounded-full" />
                  <span className="text-sm text-muted-foreground">Temperature</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-safe rounded-full" />
                  <span className="text-sm text-muted-foreground">Dissolved Oxygen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>
            Generate custom reports and detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select defaultValue="12months">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locationData.map(loc => (
                    <SelectItem key={loc.location} value={loc.location.toLowerCase()}>
                      {loc.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="safe">Safe</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalyticsTab;