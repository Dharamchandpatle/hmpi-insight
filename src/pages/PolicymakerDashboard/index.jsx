import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    Bell,
    FileText,
    Home,
    LogOut,
    Map,
    Menu,
    Shield,
    User,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Import tab components
import DashboardHomeTab from './tabs/DashboardHomeTab';
import MapsRiskVisualizationTab from './tabs/MapsRiskVisualizationTab';
import PoliciesRecommendationsTab from './tabs/PoliciesRecommendationsTab';
import ProfileSettingsTab from './tabs/ProfileSettingsTab';
import ReportsTab from './tabs/ReportsTab';

const PolicymakerDashboard = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to home tab if no tab is specified
  useEffect(() => {
    if (!tab) {
      navigate('/policymaker/dashboard/home', { replace: true });
    }
  }, [tab, navigate]);

  const menuItems = [
    { id: 'home', label: 'Dashboard Home', icon: Home, path: '/policymaker/dashboard/home' },
    { id: 'maps', label: 'Maps & Risk Visualization', icon: Map, path: '/policymaker/dashboard/maps' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/policymaker/dashboard/reports' },
    { id: 'policies', label: 'Policies / Recommendations', icon: Shield, path: '/policymaker/dashboard/policies' },
    { id: 'profile', label: 'Profile & Settings', icon: User, path: '/policymaker/dashboard/profile' },
  ];

  const activeTab = tab || 'home';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHomeTab />;
      case 'maps':
        return <MapsRiskVisualizationTab />;
      case 'reports':
        return <ReportsTab />;
      case 'policies':
        return <PoliciesRecommendationsTab />;
      case 'profile':
        return <ProfileSettingsTab />;
      default:
        return <DashboardHomeTab />;
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HMPI</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Policymaker Portal</h1>
                <p className="text-xs text-gray-500">Policy & Decision Making</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                <AvatarFallback>PM</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Dr. Rajesh Kumar</p>
                <p className="text-xs text-gray-500 truncate">Environmental Policy Advisor</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  Welcome back, Dr. Kumar
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  2
                </Badge>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                <AvatarFallback>PM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div
            key={activeTab}
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

export default PolicymakerDashboard;