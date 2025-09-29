import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState(3); // Dummy notification count

  useEffect(() => {
    // Check for existing dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-64 h-16 bg-gradient-card/95 backdrop-blur-sm border-b border-border shadow-card z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Page Title / Breadcrumb */}
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-xl font-semibold text-foreground">
              Heavy Metal Pollution Index Monitor
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time environmental water quality assessment
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* System Status */}
          <motion.div
            className="flex items-center space-x-2 px-3 py-1.5 bg-safe/10 text-safe rounded-lg border border-safe/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-safe rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">System Online</span>
          </motion.div>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-9 w-9 p-0 hover:bg-muted"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 icon-accent" />
            ) : (
              <Moon className="w-4 h-4 icon-accent" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-muted relative"
          >
            <Bell className="w-4 h-4 icon-accent" />
            {notifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-highPollution text-highPollution-foreground flex items-center justify-center"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 h-9 px-3 hover:bg-muted"
              >
                <div className="w-6 h-6 bg-gradient-environmental rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-accent-foreground icon-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user?.name?.split(' ')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {user?.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2 icon-accent" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="w-4 h-4 mr-2 icon-accent" />
                Notifications
                <Badge variant="secondary" className="ml-auto">
                  {notifications}
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2 icon-accent" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};