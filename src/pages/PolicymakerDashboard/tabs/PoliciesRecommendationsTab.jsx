import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Lightbulb,
    MapPin,
    Shield,
    Target,
    TrendingUp,
    Users,
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
    <div className="space-y-6">
      {/* Policy Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Policy Recommendations Dashboard
            </CardTitle>
            <CardDescription>
              AI-generated policy suggestions based on groundwater quality data analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{highRiskSamples.length}</div>
                <p className="text-sm text-muted-foreground">Critical Areas</p>
              </div>
              <div className="text-2xl font-bold text-orange-600">{moderateSamples.length}</div>
              <p className="text-sm text-muted-foreground">Moderate Risk Areas</p>
              <div className="text-2xl font-bold text-blue-600">{policyRecommendations.length}</div>
              <p className="text-sm text-muted-foreground">Policy Recommendations</p>
              <div className="text-2xl font-bold text-green-600">{highRiskRegions.length}</div>
              <p className="text-sm text-muted-foreground">Regions Needing Action</p>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPriority === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('all')}
              >
                All Priorities
              </Button>
              <Button
                variant={selectedPriority === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('critical')}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Critical
              </Button>
              <Button
                variant={selectedPriority === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('high')}
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                High
              </Button>
              <Button
                variant={selectedPriority === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('medium')}
                className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              >
                Medium
              </Button>
            </div>
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
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Critical Action Required</AlertTitle>
            <AlertDescription className="text-red-700">
              {highRiskSamples.length} locations have been identified with critical groundwater contamination levels.
              Immediate policy intervention is recommended for {highRiskRegions.join(', ')}.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Policy Recommendations */}
      <div className="space-y-4">
        {filteredRecommendations.map((policy, index) => (
          <motion.div
            key={policy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      {policy.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPriorityColor(policy.priority)}>
                        {getPriorityIcon(policy.priority)}
                        <span className="ml-1 capitalize">{policy.priority} Priority</span>
                      </Badge>
                      <Badge variant="outline">{policy.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getImpactColor(policy.impact)}`}>
                      {policy.impact} Impact
                    </div>
                    <div className="text-sm text-muted-foreground">{policy.timeline}</div>
                  </div>
                </div>
                <CardDescription>{policy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Affected Regions</div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{policy.affectedRegions.join(', ')}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Population Impact</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{policy.affectedPopulation}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Estimated Cost</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{policy.estimatedCost}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Timeline</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{policy.timeline}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Rationale</div>
                  <p className="text-sm text-gray-700">{policy.rationale}</p>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Recommended Actions</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {policy.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Implementation Status:</span>
                    <select
                      value={policyStatuses[policy.id] || 'not-started'}
                      onChange={(e) => updatePolicyStatus(policy.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" className={policyStatuses[policy.id] === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                      {policyStatuses[policy.id] === 'completed' ? 'Completed' : 'Start Implementation'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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