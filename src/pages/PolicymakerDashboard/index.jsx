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
import React, { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden flex">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Policymaker Portal
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Policy & Decision Making
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-700/50 shadow-lg backdrop-blur-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-800/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 group-hover:bg-white/20'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold block">{item.label}</span>
                    <span className={`text-xs block transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {item.id === 'home' && 'Overview & KPIs'}
                      {item.id === 'maps' && 'Risk Visualization'}
                      {item.id === 'reports' && 'Data Reports'}
                      {item.id === 'policies' && 'Policy Framework'}
                      {item.id === 'profile' && 'Account Settings'}
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-6 border-t border-white/20 dark:border-slate-700/20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white/20 dark:ring-slate-700/20">
                  <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    PM
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Dr. Rajesh Kumar
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  Environmental Policy Advisor
                </p>
                <Badge variant="secondary" className="mt-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  Active
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white/10 dark:bg-slate-800/10 border-white/20 dark:border-slate-700/20 hover:bg-red-500/10 hover:border-red-300/30 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/10 rounded-xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  {React.createElement(menuItems.find(item => item.id === activeTab)?.icon || Home, {
                    className: "w-6 h-6 text-white"
                  })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Welcome back, Dr. Kumar • {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">System Online</span>
              </div>
              <Button variant="ghost" size="sm" className="relative hover:bg-white/10 dark:hover:bg-slate-800/10 rounded-xl">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                  2
                </Badge>
              </Button>
              <Avatar className="h-10 w-10 ring-2 ring-white/20 dark:ring-slate-700/20">
                <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  PM
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PolicymakerDashboard;