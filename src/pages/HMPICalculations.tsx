import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Settings,
  Info,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { dummyWaterSamples } from '@/data/dummyData';
import { 
  calculateHMPI, 
  categorizeHMPI, 
  getCategoryColor, 
  getCategoryBgColor, 
  getRiskPercentage,
  formatMetalConcentration,
  calculateMetalIndex,
  whoStandards,
  hmpiWeights
} from '@/utils/hmpiCalculations';
import { WaterSample } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';

const HMPICalculations = () => {
  const [selectedSample, setSelectedSample] = useState<WaterSample>(dummyWaterSamples[0]);
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);

  // Calculate statistics
  const hmpiStats = dummyWaterSamples.map(sample => ({
    ...sample,
    calculatedHMPI: calculateHMPI(sample),
    riskPercentage: getRiskPercentage(sample.hmpiValue)
  }));

  const averageHMPI = hmpiStats.reduce((sum, sample) => sum + sample.hmpiValue, 0) / hmpiStats.length;
  const maxHMPI = Math.max(...hmpiStats.map(s => s.hmpiValue));
  const minHMPI = Math.min(...hmpiStats.map(s => s.hmpiValue));

  // Prepare chart data
  const chartData = hmpiStats.slice(0, 8).map(sample => ({
    name: sample.location.substring(0, 20) + '...',
    hmpi: sample.hmpiValue,
    category: sample.category
  }));

  // Metal analysis for selected sample
  const metalAnalysis = [
    {
      metal: 'Lead (Pb)',
      concentration: selectedSample.metals.pb,
      standard: whoStandards.pb,
      weight: hmpiWeights.pb,
      index: calculateMetalIndex(selectedSample.metals.pb, whoStandards.pb),
      color: 'hsl(var(--primary))'
    },
    {
      metal: 'Arsenic (As)',
      concentration: selectedSample.metals.as,
      standard: whoStandards.as,
      weight: hmpiWeights.as,
      index: calculateMetalIndex(selectedSample.metals.as, whoStandards.as),
      color: 'hsl(var(--moderate))'
    },
    {
      metal: 'Cadmium (Cd)',
      concentration: selectedSample.metals.cd,
      standard: whoStandards.cd,
      weight: hmpiWeights.cd,
      index: calculateMetalIndex(selectedSample.metals.cd, whoStandards.cd),
      color: 'hsl(var(--safe))'
    },
    {
      metal: 'Mercury (Hg)',
      concentration: selectedSample.metals.hg,
      standard: whoStandards.hg,
      weight: hmpiWeights.hg,
      index: calculateMetalIndex(selectedSample.metals.hg, whoStandards.hg),
      color: 'hsl(var(--highPollution))'
    }
  ];

  // Radar chart data for metal profile
  const radarData = metalAnalysis.map(metal => ({
    metal: metal.metal.split(' ')[0],
    value: Math.min(metal.index, 200), // Cap at 200 for visualization
    fullMetal: metal.metal
  }));

  const getBarColor = (category: string) => {
    switch (category) {
      case 'Safe': return 'hsl(var(--safe))';
      case 'Moderate': return 'hsl(var(--moderate))';
      case 'High': return 'hsl(var(--high-pollution))';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <Layout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">HMPI Calculations</h1>
              <p className="text-muted-foreground mt-1">
                Heavy Metal Pollution Index analysis and detailed calculations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="px-3 py-1">
                WHO Standards Applied
              </Badge>
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                {hmpiStats.length} Samples Analyzed
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Average HMPI',
              value: averageHMPI.toFixed(1),
              icon: Activity,
              color: 'text-primary',
              description: 'Across all samples'
            },
            {
              label: 'Highest Risk',
              value: maxHMPI.toFixed(1),
              icon: AlertTriangle,
              color: 'text-highPollution',
              description: 'Maximum detected'
            },
            {
              label: 'Lowest Risk',
              value: minHMPI.toFixed(1),
              icon: CheckCircle,
              color: 'text-safe',
              description: 'Best quality found'
            },
            {
              label: 'Safe Samples',
              value: `${hmpiStats.filter(s => s.category === 'Safe').length}`,
              icon: TrendingUp,
              color: 'text-safe',
              description: 'Within safe limits'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Sample Comparison</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HMPI Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>HMPI Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Heavy metal pollution index across sampling locations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                          dataKey="name" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          formatter={(value: any, name: string) => [value, 'HMPI Value']}
                          labelFormatter={(label) => `Location: ${label}`}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="hmpi" 
                          radius={[4, 4, 0, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                  <CardDescription>
                    Sample-by-sample pollution risk analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {hmpiStats.slice(0, 8).map((sample, index) => (
                      <motion.div
                        key={sample.id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setSelectedSample(sample)}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm text-foreground">
                              {sample.location}
                            </p>
                            <Badge 
                              variant="outline"
                              className={`text-xs ${getCategoryColor(sample.category)}`}
                            >
                              {sample.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={sample.riskPercentage} 
                              className="flex-1 h-2"
                            />
                            <span className="text-xs font-mono text-muted-foreground min-w-[3rem]">
                              {sample.hmpiValue}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="detailed" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sample Selection and Metal Analysis */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Detailed Metal Analysis</span>
                </CardTitle>
                <CardDescription>
                  Individual metal contribution to HMPI calculation
                </CardDescription>
                <div className="mt-2">
                  <select
                    value={selectedSample.id}
                    onChange={(e) => {
                      const sample = dummyWaterSamples.find(s => s.id === e.target.value);
                      if (sample) setSelectedSample(sample);
                    }}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    {dummyWaterSamples.map(sample => (
                      <option key={sample.id} value={sample.id}>
                        {sample.location} (HMPI: {sample.hmpiValue})
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metalAnalysis.map((metal, index) => (
                    <motion.div
                      key={metal.metal}
                      className="p-4 bg-background/30 rounded-lg border border-border/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">
                          {metal.metal}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          Weight: {(metal.weight * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                        <div>
                          <span className="block">Concentration:</span>
                          <span className="font-mono text-foreground">
                            {formatMetalConcentration(metal.concentration)}
                          </span>
                        </div>
                        <div>
                          <span className="block">WHO Standard:</span>
                          <span className="font-mono text-foreground">
                            {formatMetalConcentration(metal.standard)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Quality Index:</span>
                          <span className="text-xs font-semibold text-foreground">
                            {metal.index.toFixed(1)}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(metal.index, 200)} 
                          max={200}
                          className="h-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Final HMPI:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-foreground">
                        {selectedSample.hmpiValue}
                      </span>
                      <Badge 
                        className={`${getCategoryBgColor(selectedSample.category)} text-white`}
                      >
                        {selectedSample.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metal Profile Radar Chart */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Metal Contamination Profile</span>
                </CardTitle>
                <CardDescription>
                  Radar chart showing relative contamination levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--muted))" />
                      <PolarAngleAxis 
                        dataKey="metal" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 200]}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Radar
                        name="Contamination Index"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip
                        formatter={(value: any) => [value.toFixed(1), 'Quality Index']}
                        labelFormatter={(label) => `Metal: ${radarData.find(d => d.metal === label)?.fullMetal}`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Sample Comparison Matrix</CardTitle>
                <CardDescription>
                  Compare HMPI values and metal concentrations across samples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Comparison matrix feature coming soon</p>
                  <p className="text-sm">This will allow side-by-side sample analysis</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methodology">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-primary" />
                  <span>HMPI Calculation Methodology</span>
                </CardTitle>
                <CardDescription>
                  Understanding the Heavy Metal Pollution Index formula and standards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Formula</h3>
                  <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
                    HMPI = Σ(Wi × Qi)
                    <br />
                    where: Wi = Weight factor, Qi = Quality rating
                    <br />
                    Qi = (Ci / Si) × 100
                    <br />
                    where: Ci = Concentration, Si = WHO Standard
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">WHO Standards (mg/L)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(whoStandards).map(([metal, standard]) => (
                      <div key={metal} className="bg-background/30 p-3 rounded-lg border border-border/50">
                        <div className="font-semibold text-sm text-foreground">
                          {metal.toUpperCase()}
                        </div>
                        <div className="text-lg font-mono text-primary">
                          {standard}
                        </div>
                        <div className="text-xs text-muted-foreground">mg/L</div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Weight Factors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(hmpiWeights).map(([metal, weight]) => (
                      <div key={metal} className="bg-background/30 p-3 rounded-lg border border-border/50">
                        <div className="font-semibold text-sm text-foreground">
                          {metal.toUpperCase()}
                        </div>
                        <div className="text-lg font-mono text-primary">
                          {(weight * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">weight</div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">Classification</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-safe/10 rounded-lg border border-safe/20">
                      <CheckCircle className="w-5 h-5 text-safe" />
                      <div>
                        <span className="font-semibold text-safe">Safe (HMPI ≤ 30)</span>
                        <p className="text-sm text-muted-foreground">Water is safe for consumption</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-moderate/10 rounded-lg border border-moderate/20">
                      <AlertTriangle className="w-5 h-5 text-moderate" />
                      <div>
                        <span className="font-semibold text-moderate">Moderate (30 &lt; HMPI ≤ 100)</span>
                        <p className="text-sm text-muted-foreground">Monitoring and treatment recommended</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-highPollution/10 rounded-lg border border-highPollution/20">
                      <AlertTriangle className="w-5 h-5 text-highPollution" />
                      <div>
                        <span className="font-semibold text-highPollution">High (HMPI &gt; 100)</span>
                        <p className="text-sm text-muted-foreground">Immediate action required - not safe for consumption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default HMPICalculations;