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
    <div className="space-y-8">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-8 text-white shadow-2xl"
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
                Reports & Analytics
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-violet-100 text-lg"
              >
                Generate comprehensive reports and export data for policy decisions
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Report Generation Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-violet-600" />
              Generate Reports
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Create and download comprehensive HMPI assessment reports with advanced filtering
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Risk Filter */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <Label htmlFor="risk-filter" className="text-sm font-semibold text-slate-900 dark:text-white">Risk Level</Label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500">
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="moderate">Moderate Risk</SelectItem>
                    <SelectItem value="highrisk">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Region Filter */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <Label htmlFor="region-filter" className="text-sm font-semibold text-slate-900 dark:text-white">Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500">
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
              </motion.div>

              {/* Date Range */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <Label htmlFor="start-date" className="text-sm font-semibold text-slate-900 dark:text-white">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <Label htmlFor="end-date" className="text-sm font-semibold text-slate-900 dark:text-white">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500"
                />
              </motion.div>
            </div>

            {/* Download Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button onClick={handleDownloadCSV} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV Report
              </Button>
              <Button onClick={handleDownloadExcel} variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Excel Report
              </Button>
              <Button onClick={handleDownloadPDF} variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
              Report Summary
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Overview of filtered samples ({filteredSamples.length} total) with key statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-500"
              >
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{reportStats.totalSamples}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Samples</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700"
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{reportStats.safeSamples}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Safe</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-700"
              >
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{reportStats.moderateSamples}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Moderate Risk</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700"
              >
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{reportStats.highRiskSamples}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">High Risk</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{reportStats.averageHMPI}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Avg HMPI Score</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sample Data Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Data Preview
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Sample data that will be included in the report with detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Location</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Date</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">HMPI Score</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Risk Category</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">pH</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">TDS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.slice(0, 10).map((sample, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-slate-200 dark:border-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{sample.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">{sample.collectionDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-500 text-slate-900 dark:text-white font-semibold text-sm">
                          {sample.hmpiValue}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={getRiskBadgeVariant(sample.category === 'High' ? 'High Risk' : sample.category)}
                          className="font-medium px-3 py-1"
                        >
                          {sample.category === 'High' ? 'High Risk' : sample.category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-slate-900 dark:text-white">{sample.ph || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-slate-900 dark:text-white">{sample.tds || 'N/A'}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredSamples.length > 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center py-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 border-t border-slate-200 dark:border-slate-600"
                >
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Showing 10 of {filteredSamples.length} samples
                  </p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                    Full report will include all filtered data
                  </p>
                </motion.div>
              )}
              {filteredSamples.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No samples match the current filters</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Try adjusting your filter criteria</p>
                </motion.div>
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
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-rose-600" />
              Report Types
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Different report formats available for download with comprehensive analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group/card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">CSV Report</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  Tabular data format perfect for spreadsheet analysis and data processing.
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    All sample data with concentrations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Risk categories and HMPI scores
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Location and date information
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Compatible with Excel, Google Sheets
                  </li>
                </ul>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group/card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">Detailed Report</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  Comprehensive report with summary statistics and detailed analysis.
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Executive summary with key metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Risk distribution analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Filter criteria and applied parameters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Complete sample dataset
                  </li>
                </ul>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportsTab;