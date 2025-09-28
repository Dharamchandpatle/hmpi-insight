import { WaterSample, User, Alert, ChartData, DashboardStats } from '@/types';

// Dummy users for role-based authentication
export const dummyUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hmpi.gov',
    role: 'Admin',
    name: 'Dr. Sarah Johnson',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    username: 'scientist',
    email: 'scientist@hmpi.gov',
    role: 'Scientist',
    name: 'Dr. Michael Chen',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    username: 'policy',
    email: 'policy@hmpi.gov',
    role: 'Policymaker',
    name: 'Dr. Emily Rodriguez',
    avatar: '/placeholder.svg'
  }
];

// Dummy water samples with various pollution levels
export const dummyWaterSamples: WaterSample[] = [
  {
    id: '1',
    location: 'Downtown Treatment Plant',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    collectionDate: '2024-01-15',
    metals: { pb: 0.008, as: 0.006, cd: 0.003, hg: 0.001 },
    hmpiValue: 15.2,
    category: 'Safe',
    notes: 'Regular monitoring sample'
  },
  {
    id: '2',
    location: 'Industrial Zone Well #3',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    collectionDate: '2024-01-16',
    metals: { pb: 0.025, as: 0.018, cd: 0.008, hg: 0.004 },
    hmpiValue: 67.8,
    category: 'Moderate',
    notes: 'Elevated metal concentrations detected'
  },
  {
    id: '3',
    location: 'Riverside Community Center',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    collectionDate: '2024-01-17',
    metals: { pb: 0.045, as: 0.035, cd: 0.015, hg: 0.008 },
    hmpiValue: 125.6,
    category: 'High',
    notes: 'URGENT: Immediate action required'
  },
  {
    id: '4',
    location: 'North Suburban Well',
    coordinates: { lat: 40.7831, lng: -73.9712 },
    collectionDate: '2024-01-18',
    metals: { pb: 0.005, as: 0.004, cd: 0.002, hg: 0.001 },
    hmpiValue: 12.8,
    category: 'Safe',
    notes: 'Within acceptable limits'
  },
  {
    id: '5',
    location: 'Chemical Plant Vicinity',
    coordinates: { lat: 40.7282, lng: -73.9942 },
    collectionDate: '2024-01-19',
    metals: { pb: 0.032, as: 0.028, cd: 0.012, hg: 0.006 },
    hmpiValue: 89.4,
    category: 'Moderate',
    notes: 'Monitoring required'
  },
  {
    id: '6',
    location: 'School District Water Supply',
    coordinates: { lat: 40.7648, lng: -73.9808 },
    collectionDate: '2024-01-20',
    metals: { pb: 0.007, as: 0.005, cd: 0.003, hg: 0.001 },
    hmpiValue: 14.5,
    category: 'Safe',
    notes: 'Safe for consumption'
  },
  {
    id: '7',
    location: 'Mining Area Groundwater',
    coordinates: { lat: 40.7489, lng: -73.9680 },
    collectionDate: '2024-01-21',
    metals: { pb: 0.052, as: 0.041, cd: 0.019, hg: 0.010 },
    hmpiValue: 145.2,
    category: 'High',
    notes: 'Contamination source identified'
  },
  {
    id: '8',
    location: 'Central Park Reservoir',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    collectionDate: '2024-01-22',
    metals: { pb: 0.006, as: 0.004, cd: 0.002, hg: 0.001 },
    hmpiValue: 11.9,
    category: 'Safe',
    notes: 'Excellent water quality'
  },
  {
    id: '9',
    location: 'Airport Runoff Area',
    coordinates: { lat: 40.7282, lng: -73.9776 },
    collectionDate: '2024-01-23',
    metals: { pb: 0.028, as: 0.022, cd: 0.010, hg: 0.005 },
    hmpiValue: 75.3,
    category: 'Moderate',
    notes: 'Regular industrial monitoring'
  },
  {
    id: '10',
    location: 'Residential Area Well',
    coordinates: { lat: 40.7505, lng: -73.9712 },
    collectionDate: '2024-01-24',
    metals: { pb: 0.009, as: 0.007, cd: 0.004, hg: 0.002 },
    hmpiValue: 18.6,
    category: 'Safe',
    notes: 'Routine residential testing'
  }
];

// Dashboard statistics
export const dashboardStats: DashboardStats = {
  totalSamples: dummyWaterSamples.length,
  safeWater: dummyWaterSamples.filter(s => s.category === 'Safe').length,
  pollutedWater: dummyWaterSamples.filter(s => s.category !== 'Safe').length,
  alerts: 3,
  recentTests: 24
};

// Alert notifications
export const dummyAlerts: Alert[] = [
  {
    id: '1',
    type: 'pollution',
    message: 'High pollution levels detected at Mining Area Groundwater',
    location: 'Mining Area Groundwater',
    timestamp: '2024-01-21T10:30:00Z',
    severity: 'high',
    read: false
  },
  {
    id: '2',
    type: 'threshold',
    message: 'Moderate pollution threshold exceeded at Chemical Plant Vicinity',
    location: 'Chemical Plant Vicinity',
    timestamp: '2024-01-19T14:15:00Z',
    severity: 'medium',
    read: false
  },
  {
    id: '3',
    type: 'system',
    message: 'Monthly report generation completed',
    location: 'System',
    timestamp: '2024-01-24T09:00:00Z',
    severity: 'low',
    read: true
  }
];

// Chart data for trends
export const chartData: ChartData[] = [
  { month: 'Oct', safe: 65, moderate: 28, high: 7 },
  { month: 'Nov', safe: 59, moderate: 32, high: 9 },
  { month: 'Dec', safe: 62, moderate: 29, high: 9 },
  { month: 'Jan', safe: 60, moderate: 30, high: 10 },
];