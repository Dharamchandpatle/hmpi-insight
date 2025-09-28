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
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
                isDragActive
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 scale-105'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input {...getInputProps()} />
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDragActive
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/25 scale-110'
                    : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
                }`}>
                  <Upload className={`w-8 h-8 transition-colors duration-300 ${
                    isDragActive ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                    isDragActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300'
                  }`}>
                    {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    or click to browse files (CSV, XLS, XLSX)
                  </p>
                </div>
                {isUploading && (
                  <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-950/50 px-4 py-2 rounded-full">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Processing file...</span>
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
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Uploaded Files
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                              {file.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Processed
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
          <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Data Preview</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Review the uploaded sample data before processing
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
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Latitude</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Longitude</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Collection Date</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Pb (mg/L)</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Cd (mg/L)</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Cr (mg/L)</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">As (mg/L)</TableHead>
                      <TableHead className="font-semibold text-slate-900 dark:text-white">Hg (mg/L)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                        <TableCell className="font-medium text-slate-900 dark:text-white">{row.sampleId}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.latitude}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.longitude}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.collectionDate}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.pb}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.cd}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.cr}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.as}</TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{row.hg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPreviewData([])}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Preview
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CheckCircle className="w-4 h-4 mr-2" />
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
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Upload Instructions</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Follow these guidelines to ensure successful data upload
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  Required Columns
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-100">sampleId:</span>
                      <span className="text-blue-700 dark:text-blue-300 ml-1">Unique sample identifier</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-100">latitude/longitude:</span>
                      <span className="text-blue-700 dark:text-blue-300 ml-1">GPS coordinates</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-100">collectionDate:</span>
                      <span className="text-blue-700 dark:text-blue-300 ml-1">Date in YYYY-MM-DD format</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-100">pb, cd, cr, as, hg:</span>
                      <span className="text-blue-700 dark:text-blue-300 ml-1">Heavy metal concentrations (mg/L)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Data Validation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-300">All required columns must be present</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-300">Coordinates must be valid GPS values</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-300">Metal concentrations must be numeric</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-300">Maximum file size: 10MB</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadSamplesTab;