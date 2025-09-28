import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';
import L from 'leaflet';
import {
    AlertTriangle,
    Calendar,
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
    <div className="space-y-8">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-600 p-8 text-white shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold mb-2"
              >
                Risk Visualization Map
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-indigo-100 text-lg"
              >
                Interactive geographical risk assessment and monitoring
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Filter className="h-5 w-5 text-slate-600" />
              Advanced Filters
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Filter samples by risk level, region, and search locations
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2 block">Risk Level</label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="moderate">Moderate Risk</SelectItem>
                    <SelectItem value="highrisk">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500">
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
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-slate-900 dark:text-white mb-2 block">Search Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 group"
        >
          <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Interactive Risk Map
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Click on markers to view detailed sample information and risk assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="relative">
                {/* Real Leaflet Map */}
                <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-inner">
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
                        <Popup className="custom-popup">
                          <div className="p-4 min-w-64">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="h-4 w-4 text-slate-600" />
                              <h3 className="font-semibold text-slate-900">{sample.location}</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">HMPI Score:</span>
                                <span className="font-bold text-lg text-slate-900">{sample.hmpiValue}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Risk Level:</span>
                                <Badge variant={getRiskBadgeVariant(sample.category)} className="text-xs">
                                  {sample.category}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">Date:</span>
                                <span className="text-sm text-slate-700">{sample.collectionDate}</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <p className="text-xs font-medium text-slate-600 mb-2">Heavy Metals (µg/L):</p>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                {Object.entries(sample.metals).map(([metal, value]) => (
                                  <div key={metal} className="flex justify-between">
                                    <span className="text-slate-600">{metal.toUpperCase()}:</span>
                                    <span className="font-medium text-slate-900">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Enhanced Map Legend */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 z-10">
                  <h4 className="font-semibold text-sm mb-3 text-slate-900 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Risk Legend
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                      <span className="text-sm font-medium text-slate-700">Safe</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm"></div>
                      <span className="text-sm font-medium text-slate-700">Moderate Risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                      <span className="text-sm font-medium text-slate-700">High Risk</span>
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
          className="group"
        >
          <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-600" />
                Sample Details
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {selectedSample ? 'Detailed sample information and analysis' : 'Click on a map marker to view sample details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {selectedSample ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Location
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedSample.location}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      Risk Assessment
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(selectedSample.category)}
                        <Badge variant={getRiskBadgeVariant(selectedSample.category)} className="text-sm px-3 py-1">
                          {selectedSample.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedSample.hmpiValue}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">HMPI Score</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      Heavy Metal Concentrations
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Lead (Pb):</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals?.pb || 'N/A'} µg/L</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Cadmium (Cd):</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals?.cd || 'N/A'} µg/L</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Arsenic (As):</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedSample.metals?.as || 'N/A'} µg/L</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700 dark:to-gray-700 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      Collection Date
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedSample.collectionDate}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      View Full Report
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Select a location on the map</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Click on any marker to view sample details</p>
                </motion.div>
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
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-rose-600" />
              Filtered Samples ({filteredSamples.length})
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Samples matching current filter criteria with detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Location</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Date</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">HMPI Score</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Risk Category</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.slice(0, 10).map((sample, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b border-slate-200 dark:border-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{sample.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">{sample.collectionDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-500 text-slate-900 dark:text-white font-semibold text-sm">
                          {sample.hmpiValue}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={getRiskBadgeVariant(sample.category === 'High' ? 'High Risk' : sample.category)}
                          className="font-medium px-3 py-1"
                        >
                          {sample.category === 'High' ? 'High Risk' : sample.category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSample(sample)}
                          className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 font-medium px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          View Details
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredSamples.length > 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center py-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 border-t border-slate-200 dark:border-slate-600"
                >
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Showing 10 of {filteredSamples.length} samples
                  </p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                    Use filters above to narrow down results
                  </p>
                </motion.div>
              )}
              {filteredSamples.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No samples match current filters</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Try adjusting your filter criteria</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MapsRiskVisualizationTab;