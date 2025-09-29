import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Home,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Upload,
  User
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5 icon-accent" />
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-primary icon-accent" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">HMPI Scientist</h1>
                <p className="text-xs text-muted-foreground">Analysis & Research</p>
              </div>
            </div>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground icon-accent" />
              <span className="text-sm font-medium">Dr. Michael Chen</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <LogOut className="mr-2 h-4 w-4 icon-accent" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-primary">HMPI Scientist</h2>
                <p className="text-sm text-muted-foreground">Analysis & Research</p>
              </div>

              {/* Mobile Sidebar Menu */}
              <div className="flex-1 p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-primary">Navigation</h2>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange(item.id)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="Scientist" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  MC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Dr. Michael Chen
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Research Scientist
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ScientistDashboard;