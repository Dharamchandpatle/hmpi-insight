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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HMPI Results</h2>
          <p className="text-muted-foreground">
            View and analyze Heavy Metal Pollution Index calculations
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location or sample ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Risk Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="Safe">Safe</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High Risk">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="hmpi">HMPI Value</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
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
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{filteredAndSortedData.length}</div>
                <div className="text-sm text-muted-foreground">Total Results</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="text-2xl font-bold text-green-600">
                  {filteredAndSortedData.filter(s => s.category === 'Safe').length}
                </div>
                <div className="text-sm text-muted-foreground">Safe</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredAndSortedData.filter(s => s.category === 'Moderate').length}
                </div>
                <div className="text-sm text-muted-foreground">Moderate</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <div className="text-2xl font-bold text-red-600">
                  {filteredAndSortedData.filter(s => s.category === 'High Risk').length}
                </div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Detailed HMPI calculations for groundwater samples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Collection Date</TableHead>
                    <TableHead>HMPI Value</TableHead>
                    <TableHead>Risk Category</TableHead>
                    <TableHead>Heavy Metals (mg/L)</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((sample) => (
                    <TableRow key={sample.id} className={getRowClassName(sample.category)}>
                      <TableCell className="font-medium">{sample.id}</TableCell>
                      <TableCell>{sample.location}</TableCell>
                      <TableCell>{sample.collectionDate}</TableCell>
                      <TableCell className="font-mono">{sample.hmpiValue}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRiskIcon(sample.category)}
                          <Badge variant={getRiskBadgeVariant(sample.category)}>
                            {sample.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>Pb: {sample.metals.pb}</div>
                          <div>As: {sample.metals.as}</div>
                          <div>Cd: {sample.metals.cd}</div>
                          <div>Hg: {sample.metals.hg}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {sample.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAndSortedData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No results found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HMPIResultsTab;