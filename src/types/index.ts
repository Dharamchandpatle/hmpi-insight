// Core data types for HMPI Application

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Scientist' | 'Policymaker';
  name: string;
  avatar?: string;
}

export interface WaterSample {
  id: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  collectionDate: string;
  metals: {
    pb: number; // Lead
    as: number; // Arsenic
    cd: number; // Cadmium
    hg: number; // Mercury
  };
  hmpiValue: number;
  category: 'Safe' | 'Moderate' | 'High';
  notes?: string;
}

export interface DashboardStats {
  totalSamples: number;
  safeWater: number;
  pollutedWater: number;
  alerts: number;
  recentTests: number;
}

export interface HMPIThreshold {
  safe: number;
  moderate: number;
  high: number;
}

export interface Alert {
  id: string;
  type: 'pollution' | 'threshold' | 'system';
  message: string;
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
}

export interface ChartData {
  month: string;
  safe: number;
  moderate: number;
  high: number;
}