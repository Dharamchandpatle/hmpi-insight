import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getCategoryBgColor, getCategoryColor } from '@/utils/hmpiCalculations';
import { FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';

const DataUploadTab = () => {
  const [uploadedData, setUploadedData] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample CSV data for demonstration
  const sampleCSV = `Location,Date,pH,Temperature,Conductivity,Dissolved_Oxygen,Lead,Cadmium,Chromium
Well A,2024-01-15,7.2,25.5,450,8.2,0.05,0.01,0.02
Well B,2024-01-15,6.8,24.8,520,7.8,0.08,0.02,0.03
Well C,2024-01-15,7.5,26.2,380,8.5,0.03,0.005,0.01
Well D,2024-01-15,6.5,23.9,680,6.9,0.12,0.04,0.06`;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate file processing
    setTimeout(() => {
      // Mock processed data - in real app, this would parse the CSV/Excel
      const mockData = [
        {
          id: 1,
          location: 'Well A',
          date: '2024-01-15',
          ph: 7.2,
          temperature: 25.5,
          conductivity: 450,
          dissolvedOxygen: 8.2,
          lead: 0.05,
          cadmium: 0.01,
          chromium: 0.02,
          hmpiValue: 45.2,
          category: 'Safe'
        },
        {
          id: 2,
          location: 'Well B',
          date: '2024-01-15',
          ph: 6.8,
          temperature: 24.8,
          conductivity: 520,
          dissolvedOxygen: 7.8,
          lead: 0.08,
          cadmium: 0.02,
          chromium: 0.03,
          hmpiValue: 67.8,
          category: 'Moderate'
        },
        {
          id: 3,
          location: 'Well C',
          date: '2024-01-15',
          ph: 7.5,
          temperature: 26.2,
          conductivity: 380,
          dissolvedOxygen: 8.5,
          lead: 0.03,
          cadmium: 0.005,
          chromium: 0.01,
          hmpiValue: 32.1,
          category: 'Safe'
        }
      ];
      setUploadedData(mockData);
      setIsProcessing(false);
    }, 2000);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadedData([]);
    setIsProcessing(false);
  };

  const saveData = () => {
    // In a real app, this would save to database
    alert('Data saved successfully! (Mock implementation)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Upload</h1>
          <p className="text-muted-foreground">Upload groundwater sample data for HMPI analysis</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Data File</CardTitle>
            <CardDescription>
              Upload CSV or Excel files containing groundwater sample data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop your file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports CSV and Excel files (.csv, .xlsx, .xls)
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 mt-4"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Choose File
                </Label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearUpload}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isProcessing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Processing file...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {uploadedData.length} samples processed
                      </span>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={clearUpload}>
                          Clear
                        </Button>
                        <Button onClick={saveData}>
                          Save Data
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Data Format */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Data Format</CardTitle>
            <CardDescription>
              Your CSV file should contain these columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Location</div>
                  <div>• Date</div>
                  <div>• pH</div>
                  <div>• Temperature (°C)</div>
                  <div>• Conductivity (µS/cm)</div>
                  <div>• Dissolved Oxygen (mg/L)</div>
                  <div>• Lead (mg/L)</div>
                  <div>• Cadmium (mg/L)</div>
                  <div>• Chromium (mg/L)</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Sample CSV Format:</h4>
                <Textarea
                  value={sampleCSV}
                  readOnly
                  className="font-mono text-xs h-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      {uploadedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Preview of uploaded data with calculated HMPI values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Temp (°C)</TableHead>
                    <TableHead>Conductivity</TableHead>
                    <TableHead>DO (mg/L)</TableHead>
                    <TableHead>Pb (mg/L)</TableHead>
                    <TableHead>Cd (mg/L)</TableHead>
                    <TableHead>Cr (mg/L)</TableHead>
                    <TableHead>HMPI Value</TableHead>
                    <TableHead>Risk Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.location}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.ph}</TableCell>
                      <TableCell>{row.temperature}</TableCell>
                      <TableCell>{row.conductivity}</TableCell>
                      <TableCell>{row.dissolvedOxygen}</TableCell>
                      <TableCell>{row.lead}</TableCell>
                      <TableCell>{row.cadmium}</TableCell>
                      <TableCell>{row.chromium}</TableCell>
                      <TableCell className="font-medium">{row.hmpiValue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getCategoryBgColor(row.category)} ${getCategoryColor(row.category)}`}
                        >
                          {row.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadedFile ? 1 : 0}</div>
            <p className="text-xs text-muted-foreground">This session</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Samples Processed</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadedData.length}</div>
            <p className="text-xs text-muted-foreground">From uploaded file</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Samples</CardTitle>
            <Badge className="h-4 w-4 bg-green-100 text-green-800 p-0 flex items-center justify-center text-xs">S</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadedData.filter(d => d.category === 'Safe').length}
            </div>
            <p className="text-xs text-muted-foreground">Within limits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Badge className="h-4 w-4 bg-red-100 text-red-800 p-0 flex items-center justify-center text-xs">H</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadedData.filter(d => d.category === 'High').length}
            </div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataUploadTab;