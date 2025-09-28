import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyWaterSamples } from '@/data/dummyData';
import { getCategoryBgColor, getCategoryColor } from '@/utils/hmpiCalculations';
import { motion } from 'framer-motion';
import { Filter, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { useMemo, useState } from 'react';

// Mock coordinates for sample locations
const locationCoordinates = {
  'Well A': { lat: 28.6139, lng: 77.2090 }, // Delhi
  'Well B': { lat: 28.7041, lng: 77.1025 }, // North Delhi
  'Well C': { lat: 28.5355, lng: 77.3910 }, // South Delhi
  'Well D': { lat: 28.6692, lng: 77.4538 }, // East Delhi
  'Well E': { lat: 28.6280, lng: 77.0750 }, // West Delhi
  'Well F': { lat: 28.4595, lng: 77.0266 }, // Gurgaon
  'Well G': { lat: 28.4089, lng: 77.3178 }, // Faridabad
  'Well H': { lat: 28.5355, lng: 77.3910 }, // Noida
};

const MapsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mapZoom, setMapZoom] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Add coordinates to samples
  const samplesWithCoords = useMemo(() => {
    return dummyWaterSamples.map(sample => ({
      ...sample,
      coordinates: locationCoordinates[sample.location] || {
        lat: 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: 77.2090 + (Math.random() - 0.5) * 0.1
      }
    }));
  }, []);

  // Filtered samples based on category
  const filteredSamples = useMemo(() => {
    if (selectedCategory === 'all') return samplesWithCoords;
    return samplesWithCoords.filter(sample => sample.category === selectedCategory);
  }, [samplesWithCoords, selectedCategory]);

  // Statistics for filtered data
  const mapStats = useMemo(() => {
    const total = filteredSamples.length;
    const safe = filteredSamples.filter(s => s.category === 'Safe').length;
    const moderate = filteredSamples.filter(s => s.category === 'Moderate').length;
    const high = filteredSamples.filter(s => s.category === 'High').length;

    return { total, safe, moderate, high };
  }, [filteredSamples]);

  const getMarkerColor = (category) => {
    switch (category) {
      case 'Safe': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMarkerSize = (category) => {
    switch (category) {
      case 'Safe': return 'w-3 h-3';
      case 'Moderate': return 'w-4 h-4';
      case 'High': return 'w-5 h-5';
      default: return 'w-3 h-3';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maps & Visualizations</h1>
          <p className="text-muted-foreground">Interactive map view of groundwater monitoring locations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Export Map
          </Button>
        </div>
      </div>

      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Map Controls</CardTitle>
          <CardDescription>Filter and control map display options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Risk Category:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
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

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapZoom(Math.min(mapZoom + 1, 15))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm">Zoom: {mapZoom}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapZoom(Math.max(mapZoom - 1, 5))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Safe</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations Shown</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapStats.total}</div>
            <p className="text-xs text-muted-foreground">Monitoring points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mapStats.safe}</div>
            <p className="text-xs text-muted-foreground">Green markers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mapStats.moderate}</div>
            <p className="text-xs text-muted-foreground">Yellow markers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mapStats.high}</div>
            <p className="text-xs text-muted-foreground">Red markers</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>
              Click on markers to view sample details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Sample Markers */}
                {filteredSamples.map((sample) => {
                  // Calculate relative position (mock positioning)
                  const x = ((sample.coordinates.lng - 77.0) * 1000) % 300 + 50;
                  const y = ((28.7 - sample.coordinates.lat) * 1000) % 200 + 50;

                  return (
                    <motion.div
                      key={sample.id}
                      className={`absolute rounded-full border-2 border-white shadow-lg cursor-pointer ${getMarkerColor(sample.category)} ${getMarkerSize(sample.category)}`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                      }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedLocation(sample)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: sample.id * 0.1 }}
                    />
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                <h4 className="font-medium text-sm mb-2">Risk Levels</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Safe (HMPI &lt; 50)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Moderate (50 ≤ HMPI &lt; 100)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                    <span>High Risk (HMPI ≥ 100)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>
              {selectedLocation ? 'Selected location information' : 'Click on a marker to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedLocation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedLocation.location}</h4>
                  <p className="text-sm text-muted-foreground">
                    Sample ID: {selectedLocation.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span>
                    <p>{new Date(selectedLocation.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">HMPI Value:</span>
                    <p className="font-bold">{selectedLocation.hmpiValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Risk Category:</span>
                    <Badge
                      className={`${getCategoryBgColor(selectedLocation.category)} ${getCategoryColor(selectedLocation.category)}`}
                    >
                      {selectedLocation.category}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p>{selectedLocation.status}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Water Parameters</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>pH: {selectedLocation.ph}</div>
                    <div>Temp: {selectedLocation.temperature}°C</div>
                    <div>Conductivity: {selectedLocation.conductivity} µS/cm</div>
                    <div>DO: {selectedLocation.dissolvedOxygen} mg/L</div>
                    <div>Pb: {selectedLocation.lead} mg/L</div>
                    <div>Cd: {selectedLocation.cadmium} mg/L</div>
                    <div>Cr: {selectedLocation.chromium} mg/L</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedLocation(null)}
                >
                  Clear Selection
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a location on the map</p>
                <p className="text-sm text-muted-foreground">Click on any marker to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Locations</CardTitle>
          <CardDescription>All monitoring locations with their coordinates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Coordinates</th>
                  <th className="text-left p-2">Latest Sample</th>
                  <th className="text-left p-2">HMPI Value</th>
                  <th className="text-left p-2">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredSamples.map((sample) => (
                  <tr key={sample.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{sample.location}</td>
                    <td className="p-2 text-muted-foreground">
                      {sample.coordinates.lat.toFixed(4)}, {sample.coordinates.lng.toFixed(4)}
                    </td>
                    <td className="p-2">{new Date(sample.date).toLocaleDateString()}</td>
                    <td className="p-2 font-medium">{sample.hmpiValue.toFixed(2)}</td>
                    <td className="p-2">
                      <Badge
                        className={`${getCategoryBgColor(sample.category)} ${getCategoryColor(sample.category)}`}
                      >
                        {sample.category}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapsTab;