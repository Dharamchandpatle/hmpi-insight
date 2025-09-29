import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  FileText,
  Home,
  LogOut,
  Map,
  Menu,
  Shield,
  User
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
              <Shield className="h-8 w-8 text-primary icon-accent" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">HMPI Policymaker</h1>
                <p className="text-xs text-muted-foreground">Policy & Decision Making</p>
              </div>
            </div>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground icon-accent" />
              <span className="text-sm font-medium">Dr. Rajesh Kumar</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
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
                <h2 className="text-xl font-bold text-primary">HMPI Policymaker</h2>
                <p className="text-sm text-muted-foreground">Policy & Decision Making</p>
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
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
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
                    onClick={() => navigate(item.path)}
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
                <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  PM
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Dr. Rajesh Kumar
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Policy Advisor
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
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

export default PolicymakerDashboard;