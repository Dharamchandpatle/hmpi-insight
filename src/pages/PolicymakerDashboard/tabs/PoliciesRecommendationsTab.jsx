import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Shield,
    Target,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

const PoliciesRecommendationsTab = () => {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [policyStatuses, setPolicyStatuses] = useState({});

  // Initialize policy statuses
  useEffect(() => {
    const initialStatuses = {};
    policyRecommendations.forEach(policy => {
      initialStatuses[policy.id] = 'not-started'; // not-started, in-progress, completed
    });
    setPolicyStatuses(initialStatuses);
  }, []);

  const updatePolicyStatus = (policyId, status) => {
    setPolicyStatuses(prev => ({
      ...prev,
      [policyId]: status
    }));
  };

  // Calculate policy recommendations based on data
  const highRiskSamples = dummyWaterSamples.filter(s => s.category === 'High Risk');
  const moderateSamples = dummyWaterSamples.filter(s => s.category === 'Moderate');
  const safeSamples = dummyWaterSamples.filter(s => s.category === 'Safe');

  // Get regions with high risk
  const highRiskRegions = [...new Set(highRiskSamples.map(s => s.location.split(',')[0]))];
  const moderateRiskRegions = [...new Set(moderateSamples.map(s => s.location.split(',')[0]))];

  // Policy recommendations based on data analysis
  const policyRecommendations = [
    {
      id: 1,
      title: 'Immediate Water Treatment Infrastructure',
      priority: 'critical',
      category: 'Infrastructure',
      description: 'Deploy emergency water treatment facilities in high-risk areas',
      affectedRegions: highRiskRegions,
      affectedPopulation: '50,000+',
      estimatedCost: '₹25-35 crores',
      timeline: '3-6 months',
      impact: 'High',
      rationale: `${highRiskSamples.length} samples show critical contamination levels requiring immediate intervention.`,
      actions: [
        'Install mobile water treatment units',
        'Set up community RO plants',
        'Conduct emergency water quality monitoring',
        'Distribute clean water supplies'
      ]
    },
    {
      id: 2,
      title: 'Industrial Pollution Control Measures',
      priority: 'high',
      category: 'Regulation',
      description: 'Strengthen regulations for industrial wastewater discharge',
      affectedRegions: moderateRiskRegions,
      affectedPopulation: '100,000+',
      estimatedCost: '₹15-20 crores',
      timeline: '6-12 months',
      impact: 'Medium-High',
      rationale: `${moderateSamples.length} samples indicate industrial pollution sources need stricter controls.`,
      actions: [
        'Implement effluent treatment standards',
        'Regular industrial inspections',
        'Penalties for non-compliance',
        'Industry training programs'
      ]
    },
    {
      id: 3,
      title: 'Community Awareness and Education',
      priority: 'medium',
      category: 'Education',
      description: 'Launch public awareness campaigns about water contamination',
      affectedRegions: [...new Set(dummyWaterSamples.map(s => s.location.split(',')[0]))],
      affectedPopulation: 'All communities',
      estimatedCost: '₹2-5 crores',
      timeline: 'Ongoing',
      impact: 'Medium',
      rationale: 'Public awareness is crucial for long-term water quality management.',
      actions: [
        'School education programs',
        'Community workshops',
        'Media campaigns',
        'Mobile testing awareness'
      ]
    },
    {
      id: 4,
      title: 'Long-term Monitoring Network',
      priority: 'medium',
      category: 'Monitoring',
      description: 'Establish comprehensive groundwater monitoring system',
      affectedRegions: [...new Set(dummyWaterSamples.map(s => s.location.split(',')[0]))],
      affectedPopulation: 'State-wide',
      estimatedCost: '₹10-15 crores',
      timeline: '12-18 months',
      impact: 'High',
      rationale: `Only ${dummyWaterSamples.length} samples collected. Need systematic monitoring across all regions.`,
      actions: [
        'Install automated monitoring stations',
        'Train local monitoring teams',
        'Digital data management system',
        'Real-time alert systems'
      ]
    },
    {
      id: 5,
      title: 'Agricultural Chemical Management',
      priority: 'low',
      category: 'Agriculture',
      description: 'Regulate use of pesticides and fertilizers in farming',
      affectedRegions: moderateRiskRegions,
      affectedPopulation: 'Agricultural communities',
      estimatedCost: '₹5-8 crores',
      timeline: '6-12 months',
      impact: 'Medium',
      rationale: 'Agricultural runoff contributes to groundwater contamination in rural areas.',
      actions: [
        'Organic farming incentives',
        'Chemical usage guidelines',
        'Farmer training programs',
        'Alternative pest control methods'
      ]
    }
  ];

  const filteredRecommendations = selectedPriority === 'all'
    ? policyRecommendations
    : policyRecommendations.filter(rec => rec.priority === selectedPriority);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-green-600';
      case 'Medium-High': return 'text-yellow-600';
      case 'Medium': return 'text-orange-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold mb-2"
              >
                Policy Framework
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-emerald-100 text-lg"
              >
                AI-driven policy recommendations for sustainable water management
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Policy Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Shield className="h-5 w-5 text-emerald-600" />
              Policy Recommendations Dashboard
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              AI-generated policy suggestions based on groundwater quality data analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700"
              >
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{highRiskSamples.length}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Critical Areas</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700"
              >
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{moderateSamples.length}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Moderate Risk Areas</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{policyRecommendations.length}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Policy Recommendations</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700"
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{highRiskRegions.length}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Regions Needing Action</p>
              </motion.div>
            </div>

            {/* Priority Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                variant={selectedPriority === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('all')}
                className={selectedPriority === 'all' ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold' : 'bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}
              >
                All Priorities
              </Button>
              <Button
                variant={selectedPriority === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('critical')}
                className={selectedPriority === 'critical' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold' : 'bg-white/80 backdrop-blur-sm border-red-300 text-red-700 hover:bg-red-50'}
              >
                Critical
              </Button>
              <Button
                variant={selectedPriority === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('high')}
                className={selectedPriority === 'high' ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold' : 'bg-white/80 backdrop-blur-sm border-orange-300 text-orange-700 hover:bg-orange-50'}
              >
                High
              </Button>
              <Button
                variant={selectedPriority === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('medium')}
                className={selectedPriority === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold' : 'bg-white/80 backdrop-blur-sm border-yellow-300 text-yellow-700 hover:bg-yellow-50'}
              >
                Medium
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Critical Alert */}
      {highRiskSamples.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800 dark:text-red-200 font-semibold">Critical Action Required</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              {highRiskSamples.length} locations have been identified with critical groundwater contamination levels.
              Immediate policy intervention is recommended for {highRiskRegions.join(', ')}.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Policy Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="h-6 w-6 text-emerald-600" />
            Policy Recommendations
          </h2>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-semibold">
            {filteredRecommendations.length} Active Policies
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecommendations.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                {/* Priority Indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  policy.priority === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  policy.priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  policy.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}></div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
                </div>

                <CardHeader className="relative z-10 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {policy.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={`${
                            policy.priority === 'critical' ? 'border-red-300 text-red-700 bg-red-50 dark:bg-red-900/20' :
                            policy.priority === 'high' ? 'border-orange-300 text-orange-700 bg-orange-50 dark:bg-orange-900/20' :
                            policy.priority === 'medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20' :
                            'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/20'
                          } font-medium`}
                        >
                          {policy.priority.charAt(0).toUpperCase() + policy.priority.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {policy.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        policy.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                        policy.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        policy.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <Shield className={`w-6 h-6 ${
                          policy.priority === 'critical' ? 'text-red-600' :
                          policy.priority === 'high' ? 'text-orange-600' :
                          policy.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 flex-1 flex flex-col">
                  <CardDescription className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                    {policy.description}
                  </CardDescription>

                  <div className="space-y-3">
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{policy.expectedImpact}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Expected Impact</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{policy.timeline}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Timeline</div>
                      </div>
                    </div>

                    {/* Implementation Status */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Implementation</span>
                        <span className="font-medium text-slate-900 dark:text-white">{policy.implementationStatus}%</span>
                      </div>
                      <Progress
                        value={policy.implementationStatus}
                        className="h-2 bg-slate-200 dark:bg-slate-700"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        onClick={() => handleViewDetails(policy)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
                        onClick={() => handleImplementPolicy(policy)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Implement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Policies Found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your priority filter to see more recommendations.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Implementation Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guidelines</CardTitle>
            <CardDescription>
              Best practices for implementing water quality policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Priority Implementation Order
                </h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">1</span>
                    Critical infrastructure in high-risk areas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">2</span>
                    Regulatory measures for industries
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">3</span>
                    Public awareness campaigns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">4</span>
                    Long-term monitoring systems
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Success Metrics
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Reduction in high-risk sample percentage</li>
                  <li>• Improved water quality in treated areas</li>
                  <li>• Increased public awareness levels</li>
                  <li>• Compliance with new regulations</li>
                  <li>• Reduction in waterborne diseases</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PoliciesRecommendationsTab;