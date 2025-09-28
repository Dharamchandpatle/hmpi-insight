import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Filter,
    Layers,
    MapPin,
    Search,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Add custom CSS for Leaflet markers
const customMarkerStyles = `
  .leaflet-marker-icon {
    border-radius: 50% !important;
  }
  .custom-marker {
    border-radius: 50% !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
  }
  .custom-marker-fallback {
    filter: hue-rotate(120deg) !important;
  }
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
  .custom-popup .leaflet-popup-content {
    margin: 0;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = customMarkerStyles;
  document.head.appendChild(style);
}

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different risk levels
const createCustomIcon = (color) => {
  try {
    const svgString = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
    const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));

    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
      className: 'custom-marker'
    });
  } catch (error) {
    console.warn('Failed to create custom SVG icon, using default marker:', error);
    // Fallback to default Leaflet marker with custom color
    return new L.Icon.Default({
      className: 'custom-marker-fallback'
    });
  }
};

const riskIcons = (() => {
  try {
    const icons = {
      'Safe': createCustomIcon('#22c55e'),
      'Moderate': createCustomIcon('#eab308'),
      'High Risk': createCustomIcon('#ef4444')
    };
    console.log('Risk icons created successfully:', icons);
    return icons;
  } catch (error) {
    console.error('Failed to create risk icons:', error);
    return {
      'Safe': new L.Icon.Default(),
      'Moderate': new L.Icon.Default(),
      'High Risk': new L.Icon.Default()
    };
  }
})();

// Map controller component
const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const MapsTab = () => {
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7589, -73.9851]);
  const [mapZoom, setMapZoom] = useState(10);
  const [mapError, setMapError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map icons safely
  useEffect(() => {
    try {
      // Ensure Leaflet is loaded
      if (!L || !L.Icon) {
        throw new Error('Leaflet library not loaded');
      }

      // Ensure icons are properly created
      const testIcon = createCustomIcon('#22c55e');
      if (!testIcon || typeof testIcon !== 'object') {
        throw new Error('Failed to create map icons');
      }

      console.log('Map icons initialized successfully');
      setMapLoaded(true);
    } catch (error) {
      console.error('Map icon initialization error:', error);
      setMapError('Failed to initialize map markers');
      setMapLoaded(false);
    }
  }, []);

  // Filter samples based on risk and search
  const filteredSamples = dummyWaterSamples.filter(sample => {
    const matchesRisk = selectedRisk === 'all' || sample.category === selectedRisk;
    const matchesSearch = sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const handleSampleClick = (sample) => {
    setSelectedSample(sample);
    setMapCenter([sample.coordinates.lat, sample.coordinates.lng]);
    setMapZoom(15);
  };

  const getRiskBadgeVariant = (category) => {
    switch (category) {
      case 'Safe': return 'default';
      case 'Moderate': return 'secondary';
      case 'High Risk': return 'destructive';
      default: return 'outline';
    }
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
            Maps & Visualizations
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            Interactive map showing sample locations and risk levels
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          <span className="font-semibold">{filteredSamples.length} Samples</span>
        </Badge>
      </motion.div>

      {/* Controls */}
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
                <CardTitle className="text-xl text-slate-900 dark:text-white">Map Controls</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Filter and control map display options
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search locations or sample IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Filter by Risk" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                  <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">All Risk Levels</SelectItem>
                  <SelectItem value="Safe" className="hover:bg-slate-100 dark:hover:bg-slate-700">Safe</SelectItem>
                  <SelectItem value="Moderate" className="hover:bg-slate-100 dark:hover:bg-slate-700">Moderate</SelectItem>
                  <SelectItem value="High Risk" className="hover:bg-slate-100 dark:hover:bg-slate-700">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                  className="h-12 px-4 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-300"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                  className="h-12 px-4 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-300"
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMapCenter([40.7589, -73.9851]);
                    setMapZoom(10);
                  }}
                  className="h-12 px-4 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all duration-300"
                >
                  Reset View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Map and Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Sample Locations Map</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Click on markers to view sample details and risk information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 rounded-b-xl overflow-hidden border-t border-slate-200 dark:border-slate-600">
                {mapError ? (
                  <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Map failed to load</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{mapError}</p>
                      <Button
                        onClick={() => {
                          setMapError(null);
                          setMapLoaded(false);
                          // Re-initialize icons
                          setTimeout(() => {
                            try {
                              const testIcon = createCustomIcon('#22c55e');
                              if (testIcon) setMapLoaded(true);
                            } catch (error) {
                              setMapError('Failed to reinitialize map markers');
                            }
                          }, 100);
                        }}
                        className="mt-4"
                        size="sm"
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : !mapLoaded ? (
                  <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Loading map...</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Initializing map markers</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    className="rounded-b-xl"
                    whenReady={() => {
                      setMapError(null);
                      console.log('Map container ready');
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapController center={mapCenter} zoom={mapZoom} />

                    {filteredSamples.map((sample) => (
                      <Marker
                        key={sample.id}
                        position={[sample.coordinates.lat, sample.coordinates.lng]}
                        icon={riskIcons[sample.category] || createCustomIcon('#6b7280')}
                        eventHandlers={{
                          click: () => handleSampleClick(sample),
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{sample.location}</h3>
                            <div className="space-y-2">
                              <p className="text-sm text-slate-600 dark:text-slate-400">Sample ID: <span className="font-medium">{sample.id}</span></p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Date: <span className="font-medium">{sample.collectionDate}</span></p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">HMPI: <span className="font-bold text-lg">{sample.hmpiValue}</span></p>
                              <Badge variant={getRiskBadgeVariant(sample.category)} className="mt-2">
                                {sample.category}
                              </Badge>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sample Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Sample Details</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {selectedSample ? 'Detailed information for selected sample' : 'Click on a map marker to view details'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedSample ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-1">{selectedSample.location}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sample ID: <span className="font-medium">{selectedSample.id}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Collection Date</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedSample.collectionDate}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">HMPI Value</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">{selectedSample.hmpiValue}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Risk Category</p>
                    <Badge variant={getRiskBadgeVariant(selectedSample.category)} className="text-sm px-3 py-1">
                      {selectedSample.category}
                    </Badge>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Heavy Metal Concentrations (mg/L)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pb:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals.pb}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">As:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals.as}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cd:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals.cd}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hg:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals.hg}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSample.notes && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Notes</p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{selectedSample.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Coordinates: {selectedSample.coordinates.lat}, {selectedSample.coordinates.lng}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Select a sample marker on the map</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Click on any colored dot to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Map Legend</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Understanding risk levels and HMPI values
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-green-500 shadow-lg shadow-green-500/25 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-green-800 dark:text-green-200">Safe</span>
                  <p className="text-sm text-green-700 dark:text-green-300">HMPI &lt; 100</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/25 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">Moderate</span>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">100 ≤ HMPI &lt; 200</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-md transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-500/25 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-red-800 dark:text-red-200">High Risk</span>
                  <p className="text-sm text-red-700 dark:text-red-300">HMPI ≥ 200</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MapsTab;