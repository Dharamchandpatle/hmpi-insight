import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { dummyWaterSamples } from '@/data/dummyData';
import { getCategoryColor, getCategoryBgColor, formatMetalConcentration } from '@/utils/hmpiCalculations';
import { WaterSample } from '@/types';

const DataUpload = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof WaterSample>('collectionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [samples, setSamples] = useState(dummyWaterSamples);
  const [isUploading, setIsUploading] = useState(false);
  
  const { user, hasAnyRole } = useAuth();
  const { toast } = useToast();

  // Filter and sort samples
  const filteredSamples = samples
    .filter(sample => {
      const matchesSearch = sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sample.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || sample.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload processing
    setTimeout(() => {
      toast({
        title: 'File Uploaded Successfully',
        description: `${file.name} has been processed and added to the database.`,
      });
      setIsUploading(false);
      
      // Simulate adding new samples (in real app, would parse the file)
      const newSample: WaterSample = {
        id: `new-${Date.now()}`,
        location: 'Uploaded Sample Location',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        collectionDate: new Date().toISOString().split('T')[0],
        metals: { pb: 0.012, as: 0.008, cd: 0.004, hg: 0.002 },
        hmpiValue: 28.5,
        category: 'Safe',
        notes: `Uploaded from ${file.name}`
      };
      
      setSamples(prev => [newSample, ...prev]);
    }, 2000);
  };

  const handleSort = (field: keyof WaterSample) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data export is being prepared and will be downloaded shortly.',
    });
  };

  const canUpload = hasAnyRole(['Admin', 'Scientist']);
  const categoryStats = {
    all: samples.length,
    Safe: samples.filter(s => s.category === 'Safe').length,
    Moderate: samples.filter(s => s.category === 'Moderate').length,
    High: samples.filter(s => s.category === 'High').length
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
              <h1 className="text-3xl font-bold text-foreground">Data Management</h1>
              <p className="text-muted-foreground mt-1">
                Upload, manage, and analyze water quality samples
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="px-3 py-1">
                {samples.length} Total Samples
              </Badge>
              {canUpload && (
                <Badge className="bg-safe text-safe-foreground px-3 py-1">
                  Upload Enabled
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        {canUpload && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <span>Data Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload CSV or Excel files containing water quality test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file-upload">Select Data File</Label>
                      <div className="mt-2 flex items-center space-x-4">
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="bg-background/50"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Template
                        </Button>
                      </div>
                    </div>
                    
                    {isUploading && (
                      <div className="flex items-center space-x-2 text-sm text-primary">
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                        <span>Processing file...</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-foreground mb-2">
                      Upload Requirements:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• CSV or Excel format (.csv, .xlsx, .xls)</li>
                      <li>• Include columns: Location, Pb, As, Cd, Hg, Coordinates</li>
                      <li>• Metal concentrations in mg/L</li>
                      <li>• Coordinates in decimal degrees</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <span>Sample Database</span>
              </CardTitle>
              <CardDescription>
                Complete database of water quality samples and test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search samples..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-background/50"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All ({categoryStats.all})</option>
                      <option value="Safe">Safe ({categoryStats.Safe})</option>
                      <option value="Moderate">Moderate ({categoryStats.Moderate})</option>
                      <option value="High">High ({categoryStats.High})</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  {canUpload && (
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sample
                    </Button>
                  )}
                </div>
              </div>

              {/* Results Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('id')}
                      >
                        ID
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('location')}
                      >
                        Location
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('collectionDate')}
                      >
                        Date
                      </TableHead>
                      <TableHead>Lead (Pb)</TableHead>
                      <TableHead>Arsenic (As)</TableHead>
                      <TableHead>Cadmium (Cd)</TableHead>
                      <TableHead>Mercury (Hg)</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('hmpiValue')}
                      >
                        HMPI
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSamples.map((sample, index) => (
                      <motion.tr
                        key={sample.id}
                        className="hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <TableCell className="font-mono text-xs">
                          {sample.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {sample.location}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(sample.collectionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatMetalConcentration(sample.metals.pb)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatMetalConcentration(sample.metals.as)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatMetalConcentration(sample.metals.cd)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatMetalConcentration(sample.metals.hg)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {sample.hmpiValue}
                            </span>
                            {sample.category === 'Safe' && (
                              <CheckCircle className="w-4 h-4 text-safe" />
                            )}
                            {sample.category === 'High' && (
                              <AlertCircle className="w-4 h-4 text-highPollution" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={`${getCategoryColor(sample.category)} border-current`}
                          >
                            {sample.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canUpload && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredSamples.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No samples match your current filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default DataUpload;