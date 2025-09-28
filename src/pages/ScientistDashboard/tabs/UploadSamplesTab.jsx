import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Download,
    FileText,
    Upload,
    X
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadSamplesTab = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Mock CSV data for preview
  const mockPreviewData = [
    {
      sampleId: 'GW001',
      latitude: '40.7589',
      longitude: '-73.9851',
      collectionDate: '2024-01-15',
      pb: '0.008',
      cd: '0.003',
      cr: '0.002',
      as: '0.006',
      hg: '0.001'
    },
    {
      sampleId: 'GW002',
      latitude: '40.7614',
      longitude: '-73.9776',
      collectionDate: '2024-01-16',
      pb: '0.025',
      cd: '0.008',
      cr: '0.015',
      as: '0.018',
      hg: '0.004'
    },
    {
      sampleId: 'GW003',
      latitude: '40.7505',
      longitude: '-73.9934',
      collectionDate: '2024-01-17',
      pb: '0.045',
      cd: '0.012',
      cr: '0.028',
      as: '0.032',
      hg: '0.008'
    }
  ];

  const requiredColumns = [
    'sampleId', 'latitude', 'longitude', 'collectionDate',
    'pb', 'cd', 'cr', 'as', 'hg'
  ];

  const onDrop = useCallback((acceptedFiles) => {
    setIsUploading(true);
    setUploadStatus(null);

    // Simulate file processing
    setTimeout(() => {
      setUploadedFiles(acceptedFiles);
      setPreviewData(mockPreviewData);
      setUploadStatus('success');
      setIsUploading(false);
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const removeFile = (fileIndex) => {
    const newFiles = uploadedFiles.filter((_, index) => index !== fileIndex);
    setUploadedFiles(newFiles);
    if (newFiles.length === 0) {
      setPreviewData([]);
      setUploadStatus(null);
    }
  };

  const downloadSampleTemplate = () => {
    // Create a sample CSV template
    const headers = ['sampleId', 'latitude', 'longitude', 'collectionDate', 'pb', 'cd', 'cr', 'as', 'hg'];
    const sampleData = [
      ['GW001', '40.7589', '-73.9851', '2024-01-15', '0.008', '0.003', '0.002', '0.006', '0.001'],
      ['GW002', '40.7614', '-73.9776', '2024-01-16', '0.025', '0.008', '0.015', '0.018', '0.004']
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_template.csv';
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
            Upload Samples
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            Upload groundwater sample data for HMPI analysis
          </p>
        </div>
        <Button
          onClick={downloadSampleTemplate}
          variant="outline"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Template
        </Button>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/50 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <Upload className="w-6 h-6 mr-3 text-blue-600" />
              File Upload
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
              Upload CSV or Excel files containing groundwater sample data.
              Required columns: SampleID, Lat, Lon, Collection Date, Pb, Cd, Cr, As, Hg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files (CSV, XLS, XLSX)
                  </p>
                </div>
                {isUploading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Processing file...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Status */}
            {uploadStatus && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  File uploaded successfully! Preview data below.
                </AlertDescription>
              </Alert>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Preview */}
      {previewData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Review the uploaded sample data before processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Latitude</TableHead>
                      <TableHead>Longitude</TableHead>
                      <TableHead>Collection Date</TableHead>
                      <TableHead>Pb (mg/L)</TableHead>
                      <TableHead>Cd (mg/L)</TableHead>
                      <TableHead>Cr (mg/L)</TableHead>
                      <TableHead>As (mg/L)</TableHead>
                      <TableHead>Hg (mg/L)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.sampleId}</TableCell>
                        <TableCell>{row.latitude}</TableCell>
                        <TableCell>{row.longitude}</TableCell>
                        <TableCell>{row.collectionDate}</TableCell>
                        <TableCell>{row.pb}</TableCell>
                        <TableCell>{row.cd}</TableCell>
                        <TableCell>{row.cr}</TableCell>
                        <TableCell>{row.as}</TableCell>
                        <TableCell>{row.hg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setPreviewData([])}>
                  Clear Preview
                </Button>
                <Button>
                  Process Samples
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Upload Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>sampleId:</strong> Unique sample identifier</li>
                  <li>• <strong>latitude:</strong> GPS latitude coordinate</li>
                  <li>• <strong>longitude:</strong> GPS longitude coordinate</li>
                  <li>• <strong>collectionDate:</strong> Date of sample collection (YYYY-MM-DD)</li>
                  <li>• <strong>pb, cd, cr, as, hg:</strong> Heavy metal concentrations (mg/L)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Validation:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All required columns must be present</li>
                  <li>• Coordinates must be valid GPS values</li>
                  <li>• Metal concentrations must be numeric</li>
                  <li>• Dates must be in YYYY-MM-DD format</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadSamplesTab;