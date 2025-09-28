import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Building,
    Eye,
    EyeOff,
    Key,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User
} from 'lucide-react';
import { useState } from 'react';

const ProfileSettingsTab = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@gov.in',
    phone: '+91-9876543210',
    designation: 'Environmental Policy Advisor',
    department: 'Ministry of Environment, Forest and Climate Change',
    location: 'New Delhi, India',
    bio: 'Experienced environmental policy advisor with 15+ years in water resource management and pollution control. Leading initiatives for sustainable groundwater management across India.',
    joinDate: 'January 2020',
    permissions: ['Policy Creation', 'Report Access', 'Data Analysis', 'Public Communication']
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = () => {
    const errors = {};

    if (!userData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!userData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(userData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!userData.designation.trim()) {
      errors.designation = 'Designation is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = () => {
    if (!validateForm()) {
      setSaveStatus('error');
      return;
    }

    // Mock save operation
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setIsEditing(false);
      setValidationErrors({});
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  const handlePasswordChange = () => {
    const errors = {};

    if (!passwordData.current) {
      errors.current = 'Current password is required';
    }

    if (!passwordData.new) {
      errors.new = 'New password is required';
    } else if (passwordData.new.length < 8) {
      errors.new = 'Password must be at least 8 characters long';
    }

    if (!passwordData.confirm) {
      errors.confirm = 'Please confirm your new password';
    } else if (passwordData.new !== passwordData.confirm) {
      errors.confirm = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSaveStatus('error');
      return;
    }

    // Mock password change
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setPasswordData({ current: '', new: '', confirm: '' });
      setValidationErrors({});
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Manage your policymaker profile and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                <AvatarFallback className="text-lg">RK</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-semibold">{userData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Designation</Label>
                    <p className="text-sm">{userData.designation}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-sm">{userData.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                    <p className="text-sm">{userData.joinDate}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                  <p className="text-sm text-gray-600 mt-1">{userData.bio}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your personal and professional information
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {saveStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className={`pl-10 ${validationErrors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={userData.designation}
                  onChange={(e) => setUserData(prev => ({ ...prev, designation: e.target.value }))}
                  disabled={!isEditing}
                  className={validationErrors.designation ? 'border-red-500' : ''}
                />
                {validationErrors.designation && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.designation}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="department"
                    value={userData.department}
                    onChange={(e) => setUserData(prev => ({ ...prev, department: e.target.value }))}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={userData.location}
                    onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate} disabled={saveStatus === 'saving'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password for security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {saveStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Passwords do not match. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Enter current password"
                    className={validationErrors.current ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {validationErrors.current && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.current}</p>
                )}
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="Enter new password"
                    className={validationErrors.new ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {validationErrors.new && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.new}</p>
                )}
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirm new password"
                    className={validationErrors.confirm ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {validationErrors.confirm && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.confirm}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handlePasswordChange}
                disabled={saveStatus === 'saving' || !passwordData.current || !passwordData.new || !passwordData.confirm}
              >
                <Key className="h-4 w-4 mr-2" />
                {saveStatus === 'saving' ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Permissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Permissions
            </CardTitle>
            <CardDescription>
              Your current access permissions and roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">{permission}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    As a policymaker, you have access to sensitive environmental data.
                    Please ensure your account credentials are kept secure and report any suspicious activity immediately.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileSettingsTab;