import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dummyWaterSamples } from '@/data/dummyData';
import { getCategoryColor } from '@/utils/hmpiCalculations';
import { motion } from 'framer-motion';
import {
    Database,
    Download,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

const DataManagementTab = () => {
  const [samples, setSamples] = useState(dummyWaterSamples);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSample, setSelectedSample] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSample, setNewSample] = useState({
    location: '',
    hmpiValue: '',
    category: 'Safe',
    collectionDate: new Date().toISOString().split('T')[0],
    ph: '',
    turbidity: '',
    dissolvedOxygen: '',
    temperature: ''
  });

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.collectionDate.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || sample.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddSample = () => {
    const sample = {
      id: samples.length + 1,
      ...newSample,
      hmpiValue: parseFloat(newSample.hmpiValue),
      ph: parseFloat(newSample.ph),
      turbidity: parseFloat(newSample.turbidity),
      dissolvedOxygen: parseFloat(newSample.dissolvedOxygen),
      temperature: parseFloat(newSample.temperature)
    };
    setSamples([...samples, sample]);
    setNewSample({
      location: '',
      hmpiValue: '',
      category: 'Safe',
      collectionDate: new Date().toISOString().split('T')[0],
      ph: '',
      turbidity: '',
      dissolvedOxygen: '',
      temperature: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSample = () => {
    setSamples(samples.map(sample =>
      sample.id === selectedSample.id ? { ...sample, ...selectedSample } : sample
    ));
    setIsEditDialogOpen(false);
    setSelectedSample(null);
  };

  const handleDeleteSample = (sampleId) => {
    setSamples(samples.filter(sample => sample.id !== sampleId));
  };

  const handleExportData = () => {
    const csvContent = [
      ['ID', 'Location', 'HMPI Value', 'Category', 'Collection Date', 'pH', 'Turbidity', 'Dissolved Oxygen', 'Temperature'],
      ...filteredSamples.map(sample => [
        sample.id,
        sample.location,
        sample.hmpiValue,
        sample.category,
        sample.collectionDate,
        sample.ph,
        sample.turbidity,
        sample.dissolvedOxygen,
        sample.temperature
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water_samples.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const dataStats = {
    total: samples.length,
    safe: samples.filter(s => s.category === 'Safe').length,
    moderate: samples.filter(s => s.category === 'Moderate').length,
    high: samples.filter(s => s.category === 'High').length,
    averageHMPI: (samples.reduce((sum, s) => sum + s.hmpiValue, 0) / samples.length).toFixed(2)
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Data Management</h2>
          <p className="text-muted-foreground">Manage water quality samples and monitoring data</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Sample</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Sample</DialogTitle>
                <DialogDescription>
                  Enter water quality sample data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    value={newSample.location}
                    onChange={(e) => setNewSample({...newSample, location: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hmpi" className="text-right">HMPI</Label>
                  <Input
                    id="hmpi"
                    type="number"
                    step="0.01"
                    value={newSample.hmpiValue}
                    onChange={(e) => setNewSample({...newSample, hmpiValue: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Select value={newSample.category} onValueChange={(value) => setNewSample({...newSample, category: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Safe">Safe</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSample.collectionDate}
                    onChange={(e) => setNewSample({...newSample, collectionDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH</Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      value={newSample.ph}
                      onChange={(e) => setNewSample({...newSample, ph: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temp">Temperature (°C)</Label>
                    <Input
                      id="temp"
                      type="number"
                      step="0.1"
                      value={newSample.temperature}
                      onChange={(e) => setNewSample({...newSample, temperature: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                    <Input
                      id="turbidity"
                      type="number"
                      step="0.01"
                      value={newSample.turbidity}
                      onChange={(e) => setNewSample({...newSample, turbidity: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oxygen">Dissolved Oxygen (mg/L)</Label>
                    <Input
                      id="oxygen"
                      type="number"
                      step="0.01"
                      value={newSample.dissolvedOxygen}
                      onChange={(e) => setNewSample({...newSample, dissolvedOxygen: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddSample}>Add Sample</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{dataStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Samples</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{dataStats.safe}</p>
                <p className="text-xs text-muted-foreground">Safe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{dataStats.moderate}</p>
                <p className="text-xs text-muted-foreground">Moderate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{dataStats.high}</p>
                <p className="text-xs text-muted-foreground">High</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{dataStats.averageHMPI}</p>
                <p className="text-xs text-muted-foreground">Avg HMPI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Water Quality Samples</span>
          </CardTitle>
          <CardDescription>
            View and manage all water quality monitoring data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search samples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Safe">Safe</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>HMPI</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">#{sample.id}</TableCell>
                    <TableCell>{sample.location}</TableCell>
                    <TableCell>{sample.hmpiValue}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getCategoryColor(sample.category)}
                      >
                        {sample.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{sample.collectionDate}</TableCell>
                    <TableCell>{sample.ph}</TableCell>
                    <TableCell>{sample.temperature}°C</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSample(sample);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Sample
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSample(sample.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Sample
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Sample Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Sample</DialogTitle>
            <DialogDescription>
              Update water quality sample data.
            </DialogDescription>
          </DialogHeader>
          {selectedSample && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">Location</Label>
                <Input
                  id="edit-location"
                  value={selectedSample.location}
                  onChange={(e) => setSelectedSample({...selectedSample, location: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-hmpi" className="text-right">HMPI</Label>
                <Input
                  id="edit-hmpi"
                  type="number"
                  step="0.01"
                  value={selectedSample.hmpiValue}
                  onChange={(e) => setSelectedSample({...selectedSample, hmpiValue: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Select value={selectedSample.category} onValueChange={(value) => setSelectedSample({...selectedSample, category: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditSample}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DataManagementTab;