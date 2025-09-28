import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dummyWaterSamples } from '@/data/dummyData';
import { getCategoryBgColor, getCategoryColor } from '@/utils/hmpiCalculations';
import { ArrowUpDown, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const HMPITab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  // Get unique locations for filter
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(dummyWaterSamples.map(sample => sample.location))];
    return uniqueLocations.sort();
  }, []);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = dummyWaterSamples.filter(sample => {
      const matchesSearch = sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sample.id.toString().includes(searchTerm);
      const matchesCategory = filterCategory === 'all' || sample.category === filterCategory;
      const matchesLocation = filterLocation === 'all' || sample.location === filterLocation;

      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'hmpi':
          aValue = a.hmpiValue;
          bValue = b.hmpiValue;
          break;
        case 'location':
          aValue = a.location;
          bValue = b.location;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder, filterCategory, filterLocation]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
    return (
      <ArrowUpDown
        className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''} transition-transform`}
      />
    );
  };

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAndSortedData.length;
    const safe = filteredAndSortedData.filter(s => s.category === 'Safe').length;
    const moderate = filteredAndSortedData.filter(s => s.category === 'Moderate').length;
    const high = filteredAndSortedData.filter(s => s.category === 'High').length;
    const avgHMPI = total > 0 ? filteredAndSortedData.reduce((sum, s) => sum + s.hmpiValue, 0) / total : 0;

    return { total, safe, moderate, high, avgHMPI };
  }, [filteredAndSortedData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HMPI Results</h1>
          <p className="text-muted-foreground">View and analyze calculated HMPI values</p>
        </div>
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.safe}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.safe / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.moderate}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.moderate / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.high / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg HMPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHMPI.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter and search through HMPI results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by risk category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Safe">Safe</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterLocation('all');
                setSortBy('date');
                setSortOrder('desc');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>HMPI Analysis Results</CardTitle>
          <CardDescription>
            Detailed HMPI calculations for groundwater samples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('location')}
                      className="h-auto p-0 font-medium"
                    >
                      Location {getSortIcon('location')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('date')}
                      className="h-auto p-0 font-medium"
                    >
                      Date {getSortIcon('date')}
                    </Button>
                  </TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>Temp (°C)</TableHead>
                  <TableHead>Conductivity</TableHead>
                  <TableHead>DO (mg/L)</TableHead>
                  <TableHead>Pb (mg/L)</TableHead>
                  <TableHead>Cd (mg/L)</TableHead>
                  <TableHead>Cr (mg/L)</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('hmpi')}
                      className="h-auto p-0 font-medium"
                    >
                      HMPI Value {getSortIcon('hmpi')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-medium"
                    >
                      Risk Category {getSortIcon('category')}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.location}</TableCell>
                    <TableCell>{new Date(sample.date).toLocaleDateString()}</TableCell>
                    <TableCell>{sample.ph}</TableCell>
                    <TableCell>{sample.temperature}</TableCell>
                    <TableCell>{sample.conductivity}</TableCell>
                    <TableCell>{sample.dissolvedOxygen}</TableCell>
                    <TableCell>{sample.lead}</TableCell>
                    <TableCell>{sample.cadmium}</TableCell>
                    <TableCell>{sample.chromium}</TableCell>
                    <TableCell className="font-medium">{sample.hmpiValue.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${getCategoryBgColor(sample.category)} ${getCategoryColor(sample.category)}`}
                      >
                        {sample.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HMPITab;