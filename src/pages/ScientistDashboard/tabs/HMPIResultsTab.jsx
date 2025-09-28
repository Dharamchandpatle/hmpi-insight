import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Download,
    Filter,
    Search,
    XCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';

const HMPIResultsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Get unique locations for filter dropdown
  const locations = [...new Set(dummyWaterSamples.map(sample => sample.location))];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = dummyWaterSamples.filter(sample => {
      const matchesSearch = sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sample.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || sample.category === riskFilter;
      const matchesLocation = locationFilter === 'all' || sample.location === locationFilter;

      return matchesSearch && matchesRisk && matchesLocation;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.collectionDate);
          bValue = new Date(b.collectionDate);
          break;
        case 'hmpi':
          aValue = a.hmpiValue;
          bValue = b.hmpiValue;
          break;
        case 'location':
          aValue = a.location;
          bValue = b.location;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, riskFilter, locationFilter, sortBy, sortOrder]);

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
      case 'Safe': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Moderate': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'High Risk': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getRowClassName = (category) => {
    switch (category) {
      case 'High Risk': return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'Moderate': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      default: return '';
    }
  };

  const exportToCSV = () => {
    const headers = ['Sample ID', 'Location', 'Collection Date', 'HMPI Value', 'Risk Category', 'Notes'];
    const csvData = filteredAndSortedData.map(sample => [
      sample.id,
      sample.location,
      sample.collectionDate,
      sample.hmpiValue,
      sample.category,
      sample.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hmpi_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            HMPI Results
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            View and analyze Heavy Metal Pollution Index calculations
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Filters & Search</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Refine your results with advanced filtering options
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search by location or sample ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Risk Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                  <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">All Risks</SelectItem>
                  <SelectItem value="Safe" className="hover:bg-slate-100 dark:hover:bg-slate-700">Safe</SelectItem>
                  <SelectItem value="Moderate" className="hover:bg-slate-100 dark:hover:bg-slate-700">Moderate</SelectItem>
                  <SelectItem value="High Risk" className="hover:bg-slate-100 dark:hover:bg-slate-700">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                  <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location} className="hover:bg-slate-100 dark:hover:bg-slate-700">{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                  <SelectItem value="date" className="hover:bg-slate-100 dark:hover:bg-slate-700">Date</SelectItem>
                  <SelectItem value="hmpi" className="hover:bg-slate-100 dark:hover:bg-slate-700">HMPI Value</SelectItem>
                  <SelectItem value="location" className="hover:bg-slate-100 dark:hover:bg-slate-700">Location</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                  <SelectItem value="desc" className="hover:bg-slate-100 dark:hover:bg-slate-700">Descending</SelectItem>
                  <SelectItem value="asc" className="hover:bg-slate-100 dark:hover:bg-slate-700">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Results</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{filteredAndSortedData.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Safe Samples</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {filteredAndSortedData.filter(s => s.category === 'Safe').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">Moderate Risk</p>
                  <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                    {filteredAndSortedData.filter(s => s.category === 'Moderate').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">High Risk</p>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                    {filteredAndSortedData.filter(s => s.category === 'High Risk').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Analysis Results</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Detailed HMPI calculations for groundwater samples
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-800/50 shadow-inner">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-600 dark:hover:to-slate-700">
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Sample ID</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Location</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Collection Date</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">HMPI Value</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Risk Category</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Heavy Metals (mg/L)</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-white">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((sample) => (
                    <TableRow
                      key={sample.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 ${
                        sample.category === 'High Risk'
                          ? 'bg-red-50/50 dark:bg-red-950/10 border-l-4 border-l-red-500'
                          : sample.category === 'Moderate'
                          ? 'bg-yellow-50/50 dark:bg-yellow-950/10 border-l-4 border-l-yellow-500'
                          : 'bg-green-50/30 dark:bg-green-950/5 border-l-4 border-l-green-500'
                      }`}
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-white">{sample.id}</TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">{sample.location}</TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">{sample.collectionDate}</TableCell>
                      <TableCell className="font-mono font-bold text-lg text-slate-900 dark:text-white">{sample.hmpiValue}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRiskIcon(sample.category)}
                          <Badge variant={getRiskBadgeVariant(sample.category)} className="font-medium">
                            {sample.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Pb:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{sample.metals.pb}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">As:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{sample.metals.as}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Cd:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{sample.metals.cd}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Hg:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{sample.metals.hg}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {sample.notes || 'No notes available'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAndSortedData.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No results found</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try adjusting your filters to see more results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HMPIResultsTab;