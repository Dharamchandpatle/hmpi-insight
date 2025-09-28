import { dummyUsers } from '@/data/dummyData';

// Dummy authentication service for prototype
export class AuthService {
  static currentUser = null;
  
  /**
   * Simulate login authentication
   */
  static async login(username, role) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user by username and role
    const user = dummyUsers.find(u => u.username === username && u.role === role);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    this.currentUser = user;
    localStorage.setItem('hmpi_user', JSON.stringify(user));
    
    return user;
  }
  
  /**
   * Get current authenticated user
   */
  static getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Try to restore from localStorage
    const stored = localStorage.getItem('hmpi_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch {
        localStorage.removeItem('hmpi_user');
      }
    }
    
    return null;
  }
  
  /**
   * Logout current user
   */
  static logout() {
    this.currentUser = null;
    localStorage.removeItem('hmpi_user');
  }
  
  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
  
  /**
   * Check if user has specific role
   */
  static hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  
  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}