import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Bell,
    Home,
    LogOut,
    MapPin,
    Menu,
    Settings,
    Upload,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardHomeTab from './tabs/DashboardHomeTab';
import HMPIResultsTab from './tabs/HMPIResultsTab';
import MapsTab from './tabs/MapsTab';
import ProfileSettingsTab from './tabs/ProfileSettingsTab';
import UploadSamplesTab from './tabs/UploadSamplesTab';

const ScientistDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map URL paths to tab IDs
  const tabRoutes = {
    '': 'dashboard', // default
    'dashboard': 'dashboard',
    'upload': 'upload',
    'results': 'results',
    'maps': 'maps',
    'profile': 'profile',
  };

  // Sidebar menu items for Scientist
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Home',
      icon: Home,
      path: '/scientist/dashboard',
      description: 'Overview and key metrics'
    },
    {
      id: 'upload',
      label: 'Upload Samples',
      icon: Upload,
      path: '/scientist/dashboard/upload',
      description: 'Upload groundwater samples'
    },
    {
      id: 'results',
      label: 'HMPI Results',
      icon: BarChart3,
      path: '/scientist/dashboard/results',
      description: 'View calculation results'
    },
    {
      id: 'maps',
      label: 'Maps & Visualizations',
      icon: MapPin,
      path: '/scientist/dashboard/maps',
      description: 'Interactive sample maps'
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      icon: Settings,
      path: '/scientist/dashboard/profile',
      description: 'Manage your profile'
    }
  ];

  // Get current tab from URL
  const getCurrentTab = () => {
    const pathSegments = location.pathname.split('/');
    const tabSegment = pathSegments[pathSegments.length - 1];
    return tabRoutes[tabSegment] || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const menuItem = menuItems.find(item => item.id === tabId);
    if (menuItem) {
      navigate(menuItem.path);
    }
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHomeTab />;
      case 'upload':
        return <UploadSamplesTab />;
      case 'results':
        return <HMPIResultsTab />;
      case 'maps':
        return <MapsTab />;
      case 'profile':
        return <ProfileSettingsTab />;
      default:
        return <DashboardHomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 md:w-64'
        }`}
        animate={{ width: isSidebarOpen ? 256 : window.innerWidth >= 768 ? 256 : 0 }}
      >
        <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-r border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    HMPI Insight
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scientist Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden hover:bg-white/10 dark:hover:bg-slate-800/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-white/10 dark:border-slate-700/50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-blue-500/20 dark:ring-blue-400/20">
                    <AvatarImage src="/placeholder.svg" alt="Dr. Michael Chen" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      MC
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">Dr. Michael Chen</p>
                  <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    Scientist
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10 dark:border-slate-700/50">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={() => navigate('/')}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-64'}`}>
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden hover:bg-white/10 dark:hover:bg-slate-800/50 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Scientist Dashboard
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Heavy Metal Pollution Index Analysis Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hover:bg-white/10 dark:hover:bg-slate-800/50 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar className="w-10 h-10 ring-2 ring-blue-500/20 dark:ring-blue-400/20">
                <AvatarImage src="/placeholder.svg" alt="Dr. Michael Chen" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  MC
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ScientistDashboard;