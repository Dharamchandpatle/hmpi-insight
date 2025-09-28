// HMPI Calculation Utilities
// Based on standard heavy metal pollution index formulas

// WHO drinking water quality standards (mg/L)
export const whoStandards = {
  pb: 0.01,  // Lead: 0.01 mg/L
  as: 0.01,  // Arsenic: 0.01 mg/L
  cd: 0.003, // Cadmium: 0.003 mg/L
  hg: 0.006  // Mercury: 0.006 mg/L
};

// Standard weights for HMPI calculation
export const hmpiWeights = {
  pb: 0.25, // Lead: 25% weight
  as: 0.30, // Arsenic: 30% weight (highest toxicity)
  cd: 0.25, // Cadmium: 25% weight
  hg: 0.20  // Mercury: 20% weight
};

/**
 * Calculate Heavy Metal Pollution Index (HMPI) for a water sample
 * HMPI = Σ(Wi × Qi) where Wi = weight, Qi = quality rating
 * Qi = (Ci / Si) × 100 where Ci = concentration, Si = standard
 */
export function calculateHMPI(sample) {
  const metals = sample.metals;
  
  // Calculate quality ratings (Qi) for each metal
  const qPb = (metals.pb / whoStandards.pb) * 100;
  const qAs = (metals.as / whoStandards.as) * 100;
  const qCd = (metals.cd / whoStandards.cd) * 100;
  const qHg = (metals.hg / whoStandards.hg) * 100;
  
  // Calculate weighted HMPI
  const hmpi = 
    (hmpiWeights.pb * qPb) +
    (hmpiWeights.as * qAs) +
    (hmpiWeights.cd * qCd) +
    (hmpiWeights.hg * qHg);
  
  return Math.round(hmpi * 100) / 100; // Round to 2 decimal places
}

/**
 * Categorize water quality based on HMPI value
 */
export function categorizeHMPI(hmpiValue) {
  if (hmpiValue <= 30) return 'Safe';
  if (hmpiValue <= 100) return 'Moderate';
  return 'High';
}

/**
 * Get color class based on pollution category
 */
export function getCategoryColor(category) {
  switch (category) {
    case 'Safe': return 'text-safe';
    case 'Moderate': return 'text-moderate';
    case 'High': return 'text-highPollution';
    default: return 'text-foreground';
  }
}

/**
 * Get background color class based on pollution category
 */
export function getCategoryBgColor(category) {
  switch (category) {
    case 'Safe': return 'bg-safe';
    case 'Moderate': return 'bg-moderate';
    case 'High': return 'bg-highPollution';
    default: return 'bg-muted';
  }
}

/**
 * Calculate risk level percentage for progress bars
 */
export function getRiskPercentage(hmpiValue) {
  // Normalize HMPI to 0-100% scale (max expected value ~200)
  return Math.min((hmpiValue / 200) * 100, 100);
}

/**
 * Format metal concentration for display
 */
export function formatMetalConcentration(value) {
  return `${value.toFixed(3)} mg/L`;
}

/**
 * Calculate individual metal pollution index
 */
export function calculateMetalIndex(concentration, standard) {
  return (concentration / standard) * 100;
}

/**
 * Validate if sample data is complete
 */
export function validateSampleData(sample) {
  return !!(
    sample.location &&
    sample.coordinates &&
    sample.metals &&
    typeof sample.metals.pb === 'number' &&
    typeof sample.metals.as === 'number' &&
    typeof sample.metals.cd === 'number' &&
    typeof sample.metals.hg === 'number'
  );
}