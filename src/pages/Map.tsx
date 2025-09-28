import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map as MapIcon, 
  MapPin, 
  Filter, 
  Layers,
  Search,
  Info,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { dummyWaterSamples } from '@/data/dummyData';
import { getCategoryColor, formatMetalConcentration } from '@/utils/hmpiCalculations';
import { WaterSample } from '@/types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/placeholder.svg',
  iconUrl: '/placeholder.svg',
  shadowUrl: '/placeholder.svg',
});

// Custom marker icons based on pollution level
const createCustomIcon = (category: 'Safe' | 'Moderate' | 'High') => {
  const colors = {
    Safe: '#10B981',
    Moderate: '#F59E0B',
    High: '#EF4444'
  };
  
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="${colors[category]}" opacity="0.8" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="${colors[category]}" stroke="white" stroke-width="1"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Map center controller component
function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

const MapPage = () => {
  const [filteredSamples, setFilteredSamples] = useState(dummyWaterSamples);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSample, setSelectedSample] = useState<WaterSample | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7589, -73.9851]);

  // Filter samples based on search and category
  useEffect(() => {
    let filtered = dummyWaterSamples;
    
    if (searchTerm) {
      filtered = filtered.filter(sample =>
        sample.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sample => sample.category === selectedCategory);
    }
    
    setFilteredSamples(filtered);
  }, [searchTerm, selectedCategory]);

  const categoryStats = {
    all: dummyWaterSamples.length,
    Safe: dummyWaterSamples.filter(s => s.category === 'Safe').length,
    Moderate: dummyWaterSamples.filter(s => s.category === 'Moderate').length,
    High: dummyWaterSamples.filter(s => s.category === 'High').length
  };

  const handleSampleClick = (sample: WaterSample) => {
    setSelectedSample(sample);
    setMapCenter([sample.coordinates.lat, sample.coordinates.lng]);
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
              <h1 className="text-3xl font-bold text-foreground">Interactive Map</h1>
              <p className="text-muted-foreground mt-1">
                Geographic visualization of water quality monitoring points
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="px-3 py-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {filteredSamples.length} Locations
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls and Sample List */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Controls */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <span>Map Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    <option value="all">All Categories ({categoryStats.all})</option>
                    <option value="Safe">Safe ({categoryStats.Safe})</option>
                    <option value="Moderate">Moderate ({categoryStats.Moderate})</option>
                    <option value="High">High Risk ({categoryStats.High})</option>
                  </select>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Legend</h4>
                  <div className="space-y-2">
                    {['Safe', 'Moderate', 'High'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white"
                          style={{ 
                            backgroundColor: category === 'Safe' ? '#10B981' : 
                                           category === 'Moderate' ? '#F59E0B' : '#EF4444'
                          }}
                        />
                        <span className="text-sm text-foreground">{category}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {categoryStats[category as keyof typeof categoryStats]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample List */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Monitoring Points</span>
                </CardTitle>
                <CardDescription>
                  Click to focus on location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredSamples.map((sample, index) => (
                    <motion.div
                      key={sample.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSample?.id === sample.id
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-background/30 border-border/50 hover:bg-muted/30'
                      }`}
                      onClick={() => handleSampleClick(sample)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-foreground">
                          {sample.location}
                        </p>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getCategoryColor(sample.category)}`}
                        >
                          {sample.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>HMPI: {sample.hmpiValue}</span>
                        <span>{new Date(sample.collectionDate).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapIcon className="w-5 h-5 text-primary" />
                  <span>Geographic Distribution</span>
                </CardTitle>
                <CardDescription>
                  Water quality monitoring locations with pollution levels
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full rounded-b-lg overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapCenter center={mapCenter} />
                    
                    {filteredSamples.map((sample) => (
                      <Marker
                        key={sample.id}
                        position={[sample.coordinates.lat, sample.coordinates.lng]}
                        icon={createCustomIcon(sample.category)}
                        eventHandlers={{
                          click: () => setSelectedSample(sample)
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-3 min-w-[280px]">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-base text-foreground">
                                {sample.location}
                              </h3>
                              <Badge 
                                className={`${
                                  sample.category === 'Safe' ? 'bg-safe text-safe-foreground' :
                                  sample.category === 'Moderate' ? 'bg-moderate text-moderate-foreground' :
                                  'bg-highPollution text-highPollution-foreground'
                                }`}
                              >
                                {sample.category}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">HMPI Value:</span>
                                <span className="font-bold text-foreground">{sample.hmpiValue}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Collection Date:</span>
                                <span className="text-sm text-foreground">
                                  {new Date(sample.collectionDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border">
                              <h4 className="text-sm font-semibold text-foreground mb-2">
                                Metal Concentrations:
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Lead (Pb):</span>
                                  <span className="font-mono ml-1 text-foreground">
                                    {formatMetalConcentration(sample.metals.pb)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Arsenic (As):</span>
                                  <span className="font-mono ml-1 text-foreground">
                                    {formatMetalConcentration(sample.metals.as)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Cadmium (Cd):</span>
                                  <span className="font-mono ml-1 text-foreground">
                                    {formatMetalConcentration(sample.metals.cd)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Mercury (Hg):</span>
                                  <span className="font-mono ml-1 text-foreground">
                                    {formatMetalConcentration(sample.metals.hg)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {sample.notes && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                  <Info className="w-3 h-3 inline mr-1" />
                                  {sample.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Selected Sample Details */}
        {selectedSample && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-card shadow-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Selected Location Details</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis for {selectedSample.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Location Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sample ID:</span>
                        <span className="font-mono text-foreground">{selectedSample.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span className="font-mono text-foreground">
                          {selectedSample.coordinates.lat.toFixed(4)}, {selectedSample.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Collection Date:</span>
                        <span className="text-foreground">
                          {new Date(selectedSample.collectionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* HMPI Analysis */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">HMPI Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">HMPI Value:</span>
                        <span className="text-2xl font-bold text-foreground">
                          {selectedSample.hmpiValue}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category:</span>
                        <Badge 
                          className={`${
                            selectedSample.category === 'Safe' ? 'bg-safe text-safe-foreground' :
                            selectedSample.category === 'Moderate' ? 'bg-moderate text-moderate-foreground' :
                            'bg-highPollution text-highPollution-foreground'
                          }`}
                        >
                          {selectedSample.category === 'Safe' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {selectedSample.category !== 'Safe' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {selectedSample.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Metal Concentrations */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Metal Concentrations</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedSample.metals).map(([metal, concentration]) => (
                        <div key={metal} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {metal.toUpperCase()}:
                          </span>
                          <span className="font-mono text-foreground">
                            {formatMetalConcentration(concentration)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default MapPage;