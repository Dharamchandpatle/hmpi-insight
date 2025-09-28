import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import L from 'leaflet';
import {
    AlertTriangle,
    CheckCircle,
    Filter,
    Info,
    MapPin,
    Search,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add custom CSS for markers
const markerStyles = `
  .custom-marker {
    background: transparent !important;
    border: none !important;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .leaflet-popup-tip {
    background-color: white;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = markerStyles;
  document.head.appendChild(style);
}

const MapsRiskVisualizationTab = () => {
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);

  // Create custom icons for different risk levels
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const safeIcon = createCustomIcon('#22c55e');
  const moderateIcon = createCustomIcon('#eab308');
  const highRiskIcon = createCustomIcon('#ef4444');

  // Filter samples based on criteria
  const filteredSamples = dummyWaterSamples.filter(sample => {
    const matchesRisk = selectedRisk === 'all' ||
      (selectedRisk === 'highrisk' && (sample.category === 'High' || sample.category === 'High Risk')) ||
      sample.category.toLowerCase().replace(' ', '') === selectedRisk;
    const matchesRegion = selectedRegion === 'all' || sample.location.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch = searchTerm === '' || sample.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRisk && matchesRegion && matchesSearch;
  });

  // Get unique regions for filter
  const regions = [...new Set(dummyWaterSamples.map(sample => sample.location.split(',')[0]))];

  // Get marker icon based on risk level
  const getMarkerIcon = (category) => {
    switch (category) {
      case 'Safe': return safeIcon;
      case 'Moderate': return moderateIcon;
      case 'High Risk': return highRiskIcon;
      default: return safeIcon;
    }
  };

  // Component to fit map bounds to markers
  const FitBoundsToMarkers = ({ samples }) => {
    const map = useMap();

    useEffect(() => {
      if (samples.length > 0) {
        const bounds = L.latLngBounds(
          samples.map(sample => [sample.coordinates.lat, sample.coordinates.lng])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [samples, map]);

    return null;
  };

  const getRiskIcon = (category) => {
    switch (category) {
      case 'Safe': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Moderate': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'High Risk': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4" />;
    }
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
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Risk Level</label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="moderate">Moderate Risk</SelectItem>
                    <SelectItem value="highrisk">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region.toLowerCase()}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Search Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Interactive Risk Map</CardTitle>
              <CardDescription>
                Click on markers to view detailed sample information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Real Leaflet Map */}
                <div className="w-full h-96 rounded-lg overflow-hidden border">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBoundsToMarkers samples={filteredSamples} />
                    {filteredSamples.map((sample, index) => (
                      <Marker
                        key={index}
                        position={[sample.coordinates.lat, sample.coordinates.lng]}
                        icon={getMarkerIcon(sample.category)}
                        eventHandlers={{
                          click: () => setSelectedSample(sample),
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-sm">{sample.location}</h3>
                            <p className="text-xs text-gray-600">HMPI: {sample.hmpiValue}</p>
                            <p className="text-xs text-gray-600">Category: {sample.category}</p>
                            <p className="text-xs text-gray-600">Date: {sample.collectionDate}</p>
                            <div className="mt-2">
                              <p className="text-xs font-medium">Heavy Metals:</p>
                              <ul className="text-xs">
                                {Object.entries(sample.metals).map(([metal, value]) => (
                                  <li key={metal} className="flex justify-between">
                                    <span>{metal}:</span>
                                    <span>{value} µg/L</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Map Legend */}
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg z-10">
                  <h4 className="font-medium text-sm mb-2">Risk Legend</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">Moderate Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs">High Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sample Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sample Details</CardTitle>
              <CardDescription>
                {selectedSample ? 'Selected sample information' : 'Click on a map marker to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSample ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Location</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedSample.location}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Risk Assessment</h4>
                    <div className="flex items-center gap-2">
                      {getRiskIcon(selectedSample.category)}
                      <Badge variant={getRiskBadgeVariant(selectedSample.category)}>
                        {selectedSample.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">HMPI Score</h4>
                    <p className="text-lg font-semibold">{selectedSample.hmpiValue}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Heavy Metal Concentrations</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Lead (Pb):</span>
                        <span>{selectedSample.metals?.pb || 'N/A'} µg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cadmium (Cd):</span>
                        <span>{selectedSample.metals?.cd || 'N/A'} µg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chromium (Cr):</span>
                        <span>{selectedSample.metals?.as || 'N/A'} µg/L</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Date Collected</h4>
                    <p className="text-sm text-gray-600">{selectedSample.collectionDate}</p>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Full Report
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a location on the map to view sample details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtered Samples List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filtered Samples ({filteredSamples.length})</CardTitle>
            <CardDescription>
              Samples matching current filter criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">HMPI Score</th>
                    <th className="text-left p-2">Risk Category</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.slice(0, 10).map((sample, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {sample.location}
                        </div>
                      </td>
                      <td className="p-2">{sample.collectionDate}</td>
                      <td className="p-2 font-medium">{sample.hmpiValue}</td>
                      <td className="p-2">
                        <Badge variant={getRiskBadgeVariant(sample.category === 'High' ? 'High Risk' : sample.category)}>
                          {sample.category === 'High' ? 'High Risk' : sample.category}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSample(sample)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSamples.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Showing 10 of {filteredSamples.length} samples
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MapsRiskVisualizationTab;