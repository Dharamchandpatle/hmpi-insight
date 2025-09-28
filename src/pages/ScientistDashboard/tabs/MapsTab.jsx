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

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different risk levels
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 10px;
    ">●</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const riskIcons = {
  'Safe': createCustomIcon('#22c55e'),
  'Moderate': createCustomIcon('#eab308'),
  'High Risk': createCustomIcon('#ef4444')
};

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Maps & Visualizations</h2>
          <p className="text-muted-foreground">
            Interactive map showing sample locations and risk levels
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <MapPin className="w-4 h-4 mr-2" />
          {filteredSamples.length} Samples
        </Badge>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations or sample IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="Safe">Safe</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High Risk">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMapCenter([40.7589, -73.9851]);
                    setMapZoom(10);
                  }}
                >
                  Reset View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Map and Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Sample Locations Map
              </CardTitle>
              <CardDescription>
                Click on markers to view sample details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden border">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
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
                      icon={riskIcons[sample.category]}
                      eventHandlers={{
                        click: () => handleSampleClick(sample),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{sample.location}</h3>
                          <p className="text-sm text-gray-600">Sample ID: {sample.id}</p>
                          <p className="text-sm text-gray-600">Date: {sample.collectionDate}</p>
                          <p className="text-sm font-medium">HMPI: {sample.hmpiValue}</p>
                          <Badge variant={getRiskBadgeVariant(sample.category)} className="mt-1">
                            {sample.category}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sample Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                    <h3 className="font-semibold text-lg">{selectedSample.location}</h3>
                    <p className="text-sm text-muted-foreground">Sample ID: {selectedSample.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Collection Date</p>
                      <p className="text-sm text-muted-foreground">{selectedSample.collectionDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">HMPI Value</p>
                      <p className="text-lg font-bold">{selectedSample.hmpiValue}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Risk Category</p>
                    <Badge variant={getRiskBadgeVariant(selectedSample.category)}>
                      {selectedSample.category}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Heavy Metal Concentrations (mg/L)</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Pb: {selectedSample.metals.pb}</div>
                      <div>As: {selectedSample.metals.as}</div>
                      <div>Cd: {selectedSample.metals.cd}</div>
                      <div>Hg: {selectedSample.metals.hg}</div>
                    </div>
                  </div>

                  {selectedSample.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedSample.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Coordinates: {selectedSample.coordinates.lat}, {selectedSample.coordinates.lng}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a sample marker on the map to view details</p>
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
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Safe (HMPI &lt; 100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Moderate (100 ≤ HMPI &lt; 200)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">High Risk (HMPI ≥ 200)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MapsTab;