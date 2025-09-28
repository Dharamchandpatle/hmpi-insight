import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Droplets, Loader2, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const roles = [
  {
    value: 'Admin',
    label: 'Administrator',
    icon: Shield,
    description: 'Full system access and user management',
    color: 'bg-gradient-primary'
  },
  {
    value: 'Scientist',
    label: 'Environmental Scientist',
    icon: User,
    description: 'Data analysis and sample management',
    color: 'bg-gradient-environmental'
  },
  {
    value: 'Policymaker',
    label: 'Policy Maker',
    icon: Briefcase,
    description: 'Reports and regulatory oversight',
    color: 'bg-moderate'
  }
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!selectedRole || !username.trim()) {
      toast({
        title: 'Role Selection Required',
        description: 'Please select a role from the options above to continue.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await login(username.toLowerCase(), selectedRole);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${selectedRole}!`,
      });

      // Navigate to role-specific dashboard
      const dashboardRoutes = {
        'Admin': '/admin/dashboard',
        'Scientist': '/scientist/dashboard',
        'Policymaker': '/policymaker/dashboard'
      };

      navigate(dashboardRoutes[selectedRole] || '/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Try: admin, scientist, or policy',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Map role values to correct usernames
    const usernameMap = {
      'Admin': 'admin',
      'Scientist': 'scientist',
      'Policymaker': 'policy'
    };
    setUsername(usernameMap[role] || role.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Link to="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Droplets className="w-8 h-8 text-primary-foreground" />
              </div>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            HMPI Monitor System
          </h1>
          <p className="text-muted-foreground text-lg">
            Heavy Metal Pollution Index Environmental Monitoring Platform
          </p>
          <div className="mt-4">
            <Link 
              to="/homepage" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Select Your Role</span>
                </CardTitle>
                <CardDescription>
                  Choose your access level to continue to the monitoring dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  
                  return (
                    <motion.div
                      key={role.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full p-4 h-auto text-left justify-start ${
                          isSelected 
                            ? 'bg-gradient-primary text-primary-foreground shadow-environmental' 
                            : 'bg-card hover:bg-muted/50'
                        }`}
                        onClick={() => handleRoleSelect(role.value)}
                      >
                        <div className="flex items-center space-x-4 w-full">
                          <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{role.label}</h3>
                              {isSelected && (
                                <Badge variant="secondary" className="text-xs">
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm ${
                              isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }`}>
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Authentication</span>
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading || selectedRole}
                    className="bg-background/50"
                  />
                  {selectedRole ? (
                    <p className="text-xs text-muted-foreground">
                      Demo credentials: {selectedRole.toLowerCase()}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600">
                      Please select a role above to auto-fill credentials
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value="demo123"
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Demo mode - password not required
                  </p>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={!selectedRole || !username.trim() || loading}
                  className="w-full bg-gradient-primary text-primary-foreground shadow-environmental hover:shadow-glow"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Authenticating...' : 'Access Dashboard'}
                </Button>

                {/* Demo Instructions */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Demo Instructions:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Select a role above to auto-fill credentials</li>
                    <li>• Admin: Full system access and user management</li>
                    <li>• Scientist: Data upload and analysis features</li>
                    <li>• Policymaker: Reports and overview dashboards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;