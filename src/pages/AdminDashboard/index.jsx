import { Button } from '@/components/ui/button';
import { dashboardStats } from '@/data/dummyData';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    FileText,
    Home,
    LogOut,
    Map,
    Menu,
    Settings,
    Upload,
    User,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardHomeTab from './tabs/DashboardHomeTab';
import DataUploadTab from './tabs/DataUploadTab';
import HMPITab from './tabs/HMPITab';
import MapsTab from './tabs/MapsTab';
import ReportsTab from './tabs/ReportsTab';
import SettingsTab from './tabs/SettingsTab';
import UsersManagementTab from './tabs/UsersManagementTab';
import AlertManagementTab from './tabs/AlertManagementTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import AuditLogsTab from './tabs/AuditLogsTab';
import DataManagementTab from './tabs/DataManagementTab';
import OverviewTab from './tabs/OverviewTab';
import SystemSettingsTab from './tabs/SystemSettingsTab';
import UserManagementTab from './tabs/UserManagementTab';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map URL paths to tab IDs
  const tabRoutes = {
    '': 'dashboard', // default
    'dashboard': 'dashboard',
    'overview': 'overview',
    'analytics': 'analytics',
    'users': 'users',
    'user-management': 'user-management',
    'upload': 'upload',
    'data-management': 'data-management',
    'hmpi': 'hmpi',
    'maps': 'maps',
    'reports': 'reports',
    'alerts': 'alerts',
    'audit-logs': 'audit-logs',
    'settings': 'settings',
    'system-settings': 'system-settings'
  };

  // Get current tab from URL
  const getCurrentTab = () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    return tabRoutes[lastPart] || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const route = Object.keys(tabRoutes).find(key => tabRoutes[key] === tabId) || 'dashboard';
    navigate(`/admin/dashboard${route ? `/${route}` : ''}`);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: Home },
    { id: 'overview', label: 'System Overview', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'user-management', label: 'Advanced User Mgmt', icon: User },
    { id: 'upload', label: 'Data Upload', icon: Upload },
    { id: 'data-management', label: 'Data Management', icon: FileText },
    { id: 'hmpi', label: 'HMPI Results', icon: BarChart3 },
    { id: 'maps', label: 'Maps & Visualizations', icon: Map },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'Alert Management', icon: AlertTriangle },
    { id: 'audit-logs', label: 'Audit Logs', icon: LogOut },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'system-settings', label: 'System Settings', icon: Settings }
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHomeTab />;
      case 'overview':
        return <OverviewTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'users':
        return <UsersManagementTab />;
      case 'user-management':
        return <UserManagementTab />;
      case 'upload':
        return <DataUploadTab />;
      case 'data-management':
        return <DataManagementTab />;
      case 'hmpi':
        return <HMPITab />;
      case 'maps':
        return <MapsTab />;
      case 'reports':
        return <ReportsTab />;
      case 'alerts':
        return <AlertManagementTab />;
      case 'audit-logs':
        return <AuditLogsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'system-settings':
        return <SystemSettingsTab />;
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">HMPI Admin</h1>
                <p className="text-xs text-muted-foreground">Heavy Metal Pollution Index</p>
              </div>
            </div>
          </div>

          {/* Admin info and logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Admin User</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-primary">HMPI Admin</h2>
                <p className="text-sm text-muted-foreground">Heavy Metal Pollution Index</p>
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

          {/* Quick Stats */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Samples:</span>
                <span className="font-medium">{dashboardStats.totalSamples}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Safe Samples:</span>
                <span className="font-medium text-green-600">{dashboardStats.safeWater}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">High Risk:</span>
                <span className="font-medium text-red-600">{dashboardStats.highRisk}</span>
              </div>
            </div>
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

export default AdminDashboard;