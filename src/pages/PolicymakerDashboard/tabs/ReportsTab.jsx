import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    Download,
    FileText,
    MapPin,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

const ReportsTab = () => {
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('summary');

  // Filter samples based on criteria
  const filteredSamples = dummyWaterSamples.filter(sample => {
    const matchesRisk = selectedRisk === 'all' || sample.category.toLowerCase().replace(' ', '') === selectedRisk;
    const matchesRegion = selectedRegion === 'all' || sample.location.toLowerCase().includes(selectedRegion.toLowerCase());

    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const sampleDate = new Date(sample.collectionDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = sampleDate >= startDate && sampleDate <= endDate;
    }

    return matchesRisk && matchesRegion && matchesDate;
  });

  // Get unique regions for filter
  const regions = [...new Set(dummyWaterSamples.map(sample => sample.location.split(',')[0]))];

  const getRiskIcon = (category) => {
    switch (category) {
      case 'Safe': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Moderate': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'High Risk': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRiskBadgeVariant = (category) => {
    switch (category) {
      case 'Safe': return 'default';
      case 'Moderate': return 'secondary';
      case 'High Risk': return 'destructive';
      default: return 'outline';
    }
  };

  // Generate CSV content
  const generateCSV = () => {
    const headers = ['Location', 'Date', 'HMPI Score', 'Risk Category', 'Lead (Pb)', 'Cadmium (Cd)', 'Chromium (Cr)', 'pH', 'TDS'];
    const csvContent = [
      headers.join(','),
      ...filteredSamples.map(sample => [
        `"${sample.location}"`,
        sample.collectionDate,
        sample.hmpiValue,
        sample.category === 'High' ? 'High Risk' : sample.category,
        sample.metals?.pb || 'N/A',
        sample.metals?.cd || 'N/A',
        sample.metals?.as || 'N/A',
        sample.ph || 'N/A',
        sample.tds || 'N/A'
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  // Generate Excel content (mock - in real app, use a library like xlsx)
  const generateExcel = () => {
    // For now, return CSV content with Excel MIME type
    // In a real app, you'd use a library like 'xlsx' to create proper Excel files
    return generateCSV();
  };

  // Generate PDF content (mock - in real app, use a library like jsPDF)
  const generatePDF = () => {
    const reportData = {
      title: 'HMPI Assessment Report',
      generatedDate: new Date().toLocaleDateString(),
      filters: {
        risk: selectedRisk,
        region: selectedRegion,
        dateRange: dateRange
      },
      summary: {
        totalSamples: filteredSamples.length,
        safe: filteredSamples.filter(s => s.category === 'Safe').length,
        moderate: filteredSamples.filter(s => s.category === 'Moderate').length,
        highRisk: filteredSamples.filter(s => s.category === 'High Risk').length,
        averageHMPI: reportStats.averageHMPI
      },
      samples: filteredSamples.map(sample => ({
        location: sample.location,
        date: sample.collectionDate,
        hmpiValue: sample.hmpiValue,
        category: sample.category,
        metals: sample.metals,
        ph: sample.ph,
        tds: sample.tds
      }))
    };

    // In a real app, you'd use jsPDF or similar to create actual PDF
    // For now, return JSON that could be used to generate PDF
    return JSON.stringify(reportData, null, 2);
  };  // Download file
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSV();
    const filename = `hmpi-report-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
  };

  const handleDownloadExcel = () => {
    const excelContent = generateExcel();
    const filename = `hmpi-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    downloadFile(excelContent, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const handleDownloadPDF = () => {
    const pdfContent = generatePDF();
    const filename = `hmpi-report-${new Date().toISOString().split('T')[0]}.pdf`;
    downloadFile(pdfContent, filename, 'application/pdf');
  };

  // Report summary statistics
  const reportStats = {
    totalSamples: filteredSamples.length,
    safeSamples: filteredSamples.filter(s => s.category === 'Safe').length,
    moderateSamples: filteredSamples.filter(s => s.category === 'Moderate').length,
    highRiskSamples: filteredSamples.filter(s => s.category === 'High Risk').length,
    averageHMPI: filteredSamples.length > 0
      ? (filteredSamples.reduce((sum, s) => sum + parseFloat(s.hmpiValue), 0) / filteredSamples.length).toFixed(2)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Report Generation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Reports
            </CardTitle>
            <CardDescription>
              Create and download comprehensive HMPI assessment reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Risk Filter */}
              <div>
                <Label htmlFor="risk-filter">Risk Level</Label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="moderate">Moderate Risk</SelectItem>
                    <SelectItem value="highrisk">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region Filter */}
              <div>
                <Label htmlFor="region-filter">Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region.toLowerCase()}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleDownloadCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV Report
              </Button>
              <Button onClick={handleDownloadExcel} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Excel Report
              </Button>
              <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Report Summary
            </CardTitle>
            <CardDescription>
              Overview of filtered samples ({filteredSamples.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{reportStats.totalSamples}</div>
                <p className="text-sm text-muted-foreground">Total Samples</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reportStats.safeSamples}</div>
                <p className="text-sm text-muted-foreground">Safe</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{reportStats.moderateSamples}</div>
                <p className="text-sm text-muted-foreground">Moderate Risk</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{reportStats.highRiskSamples}</div>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reportStats.averageHMPI}</div>
                <p className="text-sm text-muted-foreground">Avg HMPI Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sample Data Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Sample data that will be included in the report
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
                    <th className="text-left p-2">pH</th>
                    <th className="text-left p-2">TDS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.slice(0, 10).map((sample, index) => (
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
                      <td className="p-2">{sample.ph || 'N/A'}</td>
                      <td className="p-2">{sample.tds || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSamples.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Showing 10 of {filteredSamples.length} samples. Full report will include all filtered data.
                  </p>
                </div>
              )}
              {filteredSamples.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No samples match the current filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Types Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Report Types</CardTitle>
            <CardDescription>
              Different report formats available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  CSV Report
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Tabular data format perfect for spreadsheet analysis and data processing.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• All sample data with concentrations</li>
                  <li>• Risk categories and HMPI scores</li>
                  <li>• Location and date information</li>
                  <li>• Compatible with Excel, Google Sheets</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5 text-green-600" />
                  Detailed Report
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive report with summary statistics and detailed analysis.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Executive summary with key metrics</li>
                  <li>• Risk distribution analysis</li>
                  <li>• Filter criteria and applied parameters</li>
                  <li>• Complete sample dataset</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsTab;