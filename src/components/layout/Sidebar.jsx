import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
    Bell,
    Calculator,
    ChevronLeft,
    ChevronRight,
    Droplets,
    FileText,
    LayoutDashboard,
    Map,
    Settings,
    Upload,
    User as UserIcon
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Data Upload', icon: Upload, roles: ['Admin', 'Scientist'] },
  { path: '/calculations', label: 'HMPI Results', icon: Calculator },
  { path: '/map', label: 'Map View', icon: Map },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/admin', label: 'Admin Panel', icon: Settings, roles: ['Admin'] },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, hasAnyRole } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || hasAnyRole(item.roles)
  );

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-gradient-card border-r border-border shadow-card z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">HMPI Monitor</h2>
              <p className="text-xs text-muted-foreground">v2.0</p>
            </div>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          {collapsed ? 
            <ChevronRight className="w-4 h-4" /> : 
            <ChevronLeft className="w-4 h-4" />
          }
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <motion.div
          className="p-4 border-b border-border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-environmental rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name}
              </p>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5"
                >
                  {user.role}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-0.5"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  3
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {filteredMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-10 ${
                      collapsed ? 'px-2' : 'px-3'
                    } ${
                      isActive 
                        ? 'bg-gradient-primary text-primary-foreground shadow-environmental' 
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-primary-glow rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="text-xs text-muted-foreground text-center">
            <p>© 2024 HMPI Monitor</p>
            <p>Environmental Protection</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};