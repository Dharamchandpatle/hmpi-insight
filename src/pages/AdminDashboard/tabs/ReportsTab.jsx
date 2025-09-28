import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dummyWaterSamples } from '@/data/dummyData';
import { getCategoryBgColor, getCategoryColor } from '@/utils/hmpiCalculations';
import { Download, FileText, PieChart } from 'lucide-react';
import { useMemo, useState } from 'react';

const ReportsTab = () => {
  const [reportType, setReportType] = useState('full');
  const [dateRange, setDateRange] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState({
    location: true,
    date: true,
    ph: true,
    temperature: true,
    conductivity: true,
    dissolvedOxygen: true,
    lead: true,
    cadmium: true,
    chromium: true,
    hmpiValue: true,
    category: true,
    status: true
  });

  // Available columns for selection
  const availableColumns = [
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'ph', label: 'pH' },
    { key: 'temperature', label: 'Temperature (°C)' },
    { key: 'conductivity', label: 'Conductivity (µS/cm)' },
    { key: 'dissolvedOxygen', label: 'Dissolved Oxygen (mg/L)' },
    { key: 'lead', label: 'Lead (mg/L)' },
    { key: 'cadmium', label: 'Cadmium (mg/L)' },
    { key: 'chromium', label: 'Chromium (mg/L)' },
    { key: 'hmpiValue', label: 'HMPI Value' },
    { key: 'category', label: 'Risk Category' },
    { key: 'status', label: 'Status' }
  ];

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = dummyWaterSamples;

    // Apply risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(sample => sample.category === riskFilter);
    }

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(sample => sample.location === locationFilter);
    }

    // Apply date range filter (mock implementation)
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case 'last7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'last90days':
          filterDate.setDate(now.getDate() - 90);
          break;
      }

      filtered = filtered.filter(sample => new Date(sample.date) >= filterDate);
    }

    return filtered;
  }, [riskFilter, locationFilter, dateRange]);

  // Get unique locations for filter
  const locations = useMemo(() => {
    return [...new Set(dummyWaterSamples.map(sample => sample.location))].sort();
  }, []);

  // Generate CSV content
  const generateCSV = () => {
    const headers = availableColumns
      .filter(col => selectedColumns[col.key])
      .map(col => col.label);

    const rows = filteredData.map(sample => {
      return availableColumns
        .filter(col => selectedColumns[col.key])
        .map(col => {
          const value = sample[col.key];
          if (col.key === 'date') {
            return new Date(value).toLocaleDateString();
          }
          return value;
        });
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // Mock download functions
  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hmpi_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    // Mock PDF download - in real implementation, would use a library like jsPDF
    alert('PDF Report Generated!\n\nThis would create a comprehensive PDF report with:\n- Executive Summary\n- Data Tables\n- Charts and Visualizations\n- Risk Analysis\n- Recommendations\n\nFile: hmpi_report_' + new Date().toISOString().split('T')[0] + '.pdf');
  };

  const downloadExcel = () => {
    // Mock Excel download
    alert('Excel Report Generated!\n\nThis would create an Excel file with:\n- Multiple worksheets\n- Formatted tables\n- Embedded charts\n- Data validation\n\nFile: hmpi_report_' + new Date().toISOString().split('T')[0] + '.xlsx');
  };

  // Report statistics
  const reportStats = useMemo(() => {
    const total = filteredData.length;
    const safe = filteredData.filter(s => s.category === 'Safe').length;
    const moderate = filteredData.filter(s => s.category === 'Moderate').length;
    const high = filteredData.filter(s => s.category === 'High').length;
    const avgHMPI = total > 0 ? filteredData.reduce((sum, s) => sum + s.hmpiValue, 0) / total : 0;

    return { total, safe, moderate, high, avgHMPI };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-muted-foreground">Generate and download HMPI analysis reports</p>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStats.total}</div>
            <p className="text-xs text-muted-foreground">In current filter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportStats.safe}</div>
            <p className="text-xs text-muted-foreground">
              {reportStats.total > 0 ? ((reportStats.safe / reportStats.total) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{reportStats.moderate}</div>
            <p className="text-xs text-muted-foreground">
              {reportStats.total > 0 ? ((reportStats.moderate / reportStats.total) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reportStats.high}</div>
            <p className="text-xs text-muted-foreground">
              {reportStats.total > 0 ? ((reportStats.high / reportStats.total) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg HMPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportStats.avgHMPI.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Customize your report settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Report (All Data)</SelectItem>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="risk">Risk Analysis Only</SelectItem>
                  <SelectItem value="trends">Trends Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <Label>Filters</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                      <SelectItem value="last90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Risk Category</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Safe">Safe</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm">Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Report Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={includeCharts}
                  onCheckedChange={setIncludeCharts}
                />
                <Label htmlFor="charts" className="text-sm">Include charts and visualizations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeMetadata}
                  onCheckedChange={setIncludeMetadata}
                />
                <Label htmlFor="metadata" className="text-sm">Include metadata and analysis notes</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Data Columns</CardTitle>
            <CardDescription>Select which columns to include in the report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {availableColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={selectedColumns[column.key]}
                    onCheckedChange={(checked) =>
                      setSelectedColumns(prev => ({ ...prev, [column.key]: checked }))
                    }
                  />
                  <Label htmlFor={column.key} className="text-sm">{column.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Download Report</CardTitle>
          <CardDescription>Choose your preferred format and download the report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={downloadCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </Button>
            <Button onClick={downloadExcel} variant="outline" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Download Excel</span>
            </Button>
            <Button onClick={downloadPDF} variant="outline" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="text-sm text-muted-foreground">
            <p><strong>Report Summary:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{reportStats.total} samples included in the report</li>
              <li>Risk distribution: {reportStats.safe} Safe, {reportStats.moderate} Moderate, {reportStats.high} High Risk</li>
              <li>Average HMPI score: {reportStats.avgHMPI.toFixed(1)}</li>
              <li>Report type: {reportType.replace(/([A-Z])/g, ' $1').toLowerCase()}</li>
              <li>Columns selected: {Object.values(selectedColumns).filter(Boolean).length} of {availableColumns.length}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Preview of data that will be included in the report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {availableColumns
                    .filter(col => selectedColumns[col.key])
                    .map(col => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.slice(0, 5).map((sample) => (
                  <TableRow key={sample.id}>
                    {availableColumns
                      .filter(col => selectedColumns[col.key])
                      .map(col => (
                        <TableCell key={col.key}>
                          {col.key === 'date'
                            ? new Date(sample[col.key]).toLocaleDateString()
                            : col.key === 'category'
                            ? <Badge className={`${getCategoryBgColor(sample.category)} ${getCategoryColor(sample.category)}`}>
                                {sample.category}
                              </Badge>
                            : col.key === 'hmpiValue'
                            ? sample[col.key].toFixed(2)
                            : sample[col.key]
                          }
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length > 5 && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing first 5 of {filteredData.length} records. Full report will include all filtered data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;