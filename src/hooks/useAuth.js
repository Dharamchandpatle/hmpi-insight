import { AuthService } from '@/services/authService';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username, role) => {
    setLoading(true);
    try {
      const user = await AuthService.login(username, role);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user
  };
};