import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Save, TestTube } from 'lucide-react';
import { useState } from 'react';

// Default heavy metal standards (WHO guidelines)
const defaultStandards = {
  lead: { max: 0.01, unit: 'mg/L', description: 'Lead concentration limit' },
  cadmium: { max: 0.003, unit: 'mg/L', description: 'Cadmium concentration limit' },
  chromium: { max: 0.05, unit: 'mg/L', description: 'Chromium concentration limit' },
  arsenic: { max: 0.01, unit: 'mg/L', description: 'Arsenic concentration limit' },
  mercury: { max: 0.006, unit: 'mg/L', description: 'Mercury concentration limit' },
  nickel: { max: 0.07, unit: 'mg/L', description: 'Nickel concentration limit' },
  copper: { max: 2.0, unit: 'mg/L', description: 'Copper concentration limit' },
  zinc: { max: 3.0, unit: 'mg/L', description: 'Zinc concentration limit' },
  iron: { max: 0.3, unit: 'mg/L', description: 'Iron concentration limit' },
  manganese: { max: 0.1, unit: 'mg/L', description: 'Manganese concentration limit' }
};

// Default HMPI formula parameters
const defaultFormulaParams = {
  weights: {
    lead: 0.2,
    cadmium: 0.2,
    chromium: 0.2,
    arsenic: 0.1,
    mercury: 0.1,
    nickel: 0.05,
    copper: 0.05,
    zinc: 0.05,
    iron: 0.025,
    manganese: 0.025
  },
  riskCategories: {
    safe: { max: 50, color: 'green', label: 'Safe' },
    moderate: { max: 100, color: 'yellow', label: 'Moderate Risk' },
    high: { max: 999, color: 'red', label: 'High Risk' }
  },
  normalizationMethod: 'linear',
  aggregationMethod: 'weighted_sum'
};

const SettingsTab = () => {
  const [standards, setStandards] = useState(defaultStandards);
  const [formulaParams, setFormulaParams] = useState(defaultFormulaParams);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState('365');
  const [backupFrequency, setBackupFrequency] = useState('weekly');

  // Update heavy metal standard
  const updateStandard = (metal, field, value) => {
    setStandards(prev => ({
      ...prev,
      [metal]: {
        ...prev[metal],
        [field]: value
      }
    }));
  };

  // Update formula weight
  const updateWeight = (metal, weight) => {
    setFormulaParams(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [metal]: weight
      }
    }));
  };

  // Update risk category threshold
  const updateRiskThreshold = (category, value) => {
    setFormulaParams(prev => ({
      ...prev,
      riskCategories: {
        ...prev.riskCategories,
        [category]: {
          ...prev.riskCategories[category],
          max: value
        }
      }
    }));
  };

  // Save settings
  const saveSettings = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully! (Mock implementation)');
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setStandards(defaultStandards);
    setFormulaParams(defaultFormulaParams);
    alert('Settings reset to defaults');
  };

  // Test HMPI calculation with current parameters
  const testCalculation = () => {
    const testSample = {
      lead: 0.02,
      cadmium: 0.005,
      chromium: 0.03,
      arsenic: 0.008,
      mercury: 0.004,
      nickel: 0.04,
      copper: 1.2,
      zinc: 1.8,
      iron: 0.15,
      manganese: 0.05
    };

    // Mock HMPI calculation
    let hmpi = 0;
    Object.keys(testSample).forEach(metal => {
      const concentration = testSample[metal];
      const standard = standards[metal]?.max || 1;
      const weight = formulaParams.weights[metal] || 0.1;
      hmpi += (concentration / standard) * weight * 100;
    });

    alert(`Test HMPI Calculation Result: ${hmpi.toFixed(2)}\n\nThis demonstrates how the current parameters affect HMPI scoring.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-muted-foreground">Configure heavy metal standards and HMPI calculation parameters</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={testCalculation}>
            <TestTube className="mr-2 h-4 w-4" />
            Test Calculation
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heavy Metal Standards */}
        <Card>
          <CardHeader>
            <CardTitle>Heavy Metal Standards</CardTitle>
            <CardDescription>
              Configure maximum allowable concentrations for heavy metals (WHO guidelines)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(standards).map(([metal, config]) => (
                <div key={metal} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <Label className="text-sm font-medium capitalize">{metal}</Label>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                  <Input
                    type="number"
                    step="0.001"
                    value={config.max}
                    onChange={(e) => updateStandard(metal, 'max', parseFloat(e.target.value))}
                    className="text-right"
                  />
                  <Select
                    value={config.unit}
                    onValueChange={(value) => updateStandard(metal, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg/L">mg/L</SelectItem>
                      <SelectItem value="µg/L">µg/L</SelectItem>
                      <SelectItem value="ppm">ppm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* HMPI Formula Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>HMPI Formula Parameters</CardTitle>
            <CardDescription>
              Configure weights and calculation parameters for HMPI scoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weights */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Parameter Weights</Label>
              <div className="space-y-3">
                {Object.entries(formulaParams.weights).map(([metal, weight]) => (
                  <div key={metal} className="flex items-center space-x-4">
                    <Label className="w-20 text-sm capitalize">{metal}:</Label>
                    <Slider
                      value={[weight]}
                      onValueChange={([value]) => updateWeight(metal, value)}
                      max={0.5}
                      min={0}
                      step={0.01}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm text-right">{(weight * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Risk Categories */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Risk Category Thresholds</Label>
              <div className="space-y-4">
                {Object.entries(formulaParams.riskCategories).map(([category, config]) => (
                  <div key={category} className="flex items-center space-x-4">
                    <Badge
                      className={`w-20 justify-center ${
                        config.color === 'green' ? 'bg-green-100 text-green-800' :
                        config.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {config.label}
                    </Badge>
                    <span className="text-sm">Max HMPI:</span>
                    <Input
                      type="number"
                      value={config.max}
                      onChange={(e) => updateRiskThreshold(category, parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Calculation Methods */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Normalization Method</Label>
                <Select
                  value={formulaParams.normalizationMethod}
                  onValueChange={(value) => setFormulaParams(prev => ({
                    ...prev,
                    normalizationMethod: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Scaling</SelectItem>
                    <SelectItem value="logarithmic">Logarithmic Scaling</SelectItem>
                    <SelectItem value="exponential">Exponential Scaling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Aggregation Method</Label>
                <Select
                  value={formulaParams.aggregationMethod}
                  onValueChange={(value) => setFormulaParams(prev => ({
                    ...prev,
                    aggregationMethod: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weighted_sum">Weighted Sum</SelectItem>
                    <SelectItem value="geometric_mean">Geometric Mean</SelectItem>
                    <SelectItem value="maximum">Maximum Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-save Changes</Label>
                  <p className="text-xs text-muted-foreground">Automatically save settings changes</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send alerts for high-risk samples</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Data Retention Period</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standards Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Standards Reference</CardTitle>
          <CardDescription>
            WHO and BIS drinking water quality standards for reference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heavy Metal</TableHead>
                  <TableHead>WHO Guideline (mg/L)</TableHead>
                  <TableHead>BIS Standard (mg/L)</TableHead>
                  <TableHead>Current Setting</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Lead</TableCell>
                  <TableCell>0.01</TableCell>
                  <TableCell>0.01</TableCell>
                  <TableCell>{standards.lead.max}</TableCell>
                  <TableCell>
                    <Badge variant={standards.lead.max <= 0.01 ? "default" : "destructive"}>
                      {standards.lead.max <= 0.01 ? "Compliant" : "Above Standard"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cadmium</TableCell>
                  <TableCell>0.003</TableCell>
                  <TableCell>0.003</TableCell>
                  <TableCell>{standards.cadmium.max}</TableCell>
                  <TableCell>
                    <Badge variant={standards.cadmium.max <= 0.003 ? "default" : "destructive"}>
                      {standards.cadmium.max <= 0.003 ? "Compliant" : "Above Standard"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Chromium</TableCell>
                  <TableCell>0.05</TableCell>
                  <TableCell>0.05</TableCell>
                  <TableCell>{standards.chromium.max}</TableCell>
                  <TableCell>
                    <Badge variant={standards.chromium.max <= 0.05 ? "default" : "destructive"}>
                      {standards.chromium.max <= 0.05 ? "Compliant" : "Above Standard"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Arsenic</TableCell>
                  <TableCell>0.01</TableCell>
                  <TableCell>0.01</TableCell>
                  <TableCell>{standards.arsenic?.max || 'Not set'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Reference Only</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Changes to standards and formula parameters will affect all future HMPI calculations.
                Historical data will remain unchanged. Please test calculations thoroughly before applying changes to production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;