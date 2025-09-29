import { dummyWaterSamples } from '@/data/dummyData';
import { motion } from 'framer-motion';

// Simple responsive dummy map renderer that plots markers based on geo coords.
const MapView = ({ className = '' }) => {
  // Use dataset bounds to normalize lat/lng to percentages
  const lats = dummyWaterSamples.map((s) => s.coordinates.lat);
  const lngs = dummyWaterSamples.map((s) => s.coordinates.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const normalize = (lat, lng) => {
    // Normalize longitude -> x, latitude -> y (flip y for screen coords)
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { left: `${Math.min(Math.max(x, 0), 100)}%`, top: `${Math.min(Math.max(y, 0), 100)}%` };
  };

  const categoryColor = (category) => {
    if (!category) return 'bg-gray-400';
    switch (category.toLowerCase()) {
      case 'safe':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-card border border-border p-4 sm:p-6">
          <div className="relative w-full h-80 md:h-96 lg:h-[520px] bg-slate-50 overflow-hidden rounded-lg">
            {/* Simple stylized map background (no external deps) */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#eef2ff" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#g1)" />
            </svg>

            {/* Markers overlay */}
            <div className="absolute inset-0">
              {dummyWaterSamples.map((s) => {
                const pos = normalize(s.coordinates.lat, s.coordinates.lng);
                return (
                  <div
                    key={s.id}
                    title={`${s.location} — HMPI: ${s.hmpiValue} — Pb:${s.metals.pb}, As:${s.metals.as}, Hg:${s.metals.hg}`}
                    style={{ left: pos.left, top: pos.top }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full ring-2 ring-white ${categoryColor(s.category)} shadow-md`} />
                    <div className="mt-2 text-xs text-slate-600 text-center w-40 hidden group-hover:block">
                      <div className="font-semibold">{s.location}</div>
                      <div className="text-xs">HMPI: {s.hmpiValue}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-1">Groundwater Contamination Map</h3>
            <p className="text-sm text-muted-foreground">Visualize heavy metal pollution levels across different regions using geo-coordinates for better insights.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapView;
