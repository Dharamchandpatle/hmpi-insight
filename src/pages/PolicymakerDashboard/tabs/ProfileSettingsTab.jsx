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
    CheckCircle,
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
    <div className="space-y-8">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-8 text-white shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold mb-2"
              >
                Profile Settings
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-indigo-100 text-lg"
              >
                Manage your policymaker profile and account security
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <User className="h-5 w-5 text-indigo-600" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Manage your policymaker profile and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-start gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Avatar className="h-24 w-24 ring-4 ring-indigo-100 dark:ring-indigo-900/30">
                  <AvatarImage src="/placeholder.svg" alt="Policymaker" />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">RK</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</Label>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{userData.name}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Designation</Label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{userData.designation}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Department</Label>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{userData.department}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Member Since</Label>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{userData.joinDate}</p>
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600"
                >
                  <Label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Professional Bio</Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{userData.bio}</p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-white">Edit Profile</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Update your personal and professional information
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? 'bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold'}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {saveStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl"
              >
                <Alert className="border-0 bg-transparent">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200 font-semibold">
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={`transition-all duration-200 ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.name}</p>
                )}
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className={`pl-12 transition-all duration-200 ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl`}
                    placeholder="Enter your email"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.email}</p>
                )}
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className={`pl-12 transition-all duration-200 ${validationErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.phone}</p>
                )}
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="designation" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Designation</Label>
                <Input
                  id="designation"
                  value={userData.designation}
                  onChange={(e) => setUserData(prev => ({ ...prev, designation: e.target.value }))}
                  disabled={!isEditing}
                  className={`transition-all duration-200 ${validationErrors.designation ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl`}
                  placeholder="Enter your designation"
                />
                {validationErrors.designation && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.designation}</p>
                )}
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} className="md:col-span-2">
                <Label htmlFor="department" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Department</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="department"
                    value={userData.department}
                    onChange={(e) => setUserData(prev => ({ ...prev, department: e.target.value }))}
                    disabled={!isEditing}
                    className={`pl-12 transition-all duration-200 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl`}
                    placeholder="Enter your department"
                  />
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="location" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="location"
                    value={userData.location}
                    onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    className={`pl-12 transition-all duration-200 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl`}
                    placeholder="Enter your location"
                  />
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} className="md:col-span-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  className={`transition-all duration-200 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 ${isEditing ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-600'} rounded-xl resize-none`}
                  placeholder="Enter your professional bio"
                />
              </motion.div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end pt-4"
              >
                <Button
                  onClick={handleProfileUpdate}
                  disabled={saveStatus === 'saving'}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Key className="h-5 w-5 text-indigo-600" />
              Change Password
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Update your account password for enhanced security
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {saveStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-xl"
              >
                <Alert className="border-0 bg-transparent">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200 font-semibold">
                    Passwords do not match. Please try again.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="current-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    placeholder="Enter current password"
                    className={`pr-12 transition-all duration-200 ${validationErrors.current ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} bg-white dark:bg-slate-700 rounded-xl`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {validationErrors.current && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.current}</p>
                )}
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="new-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="Enter new password"
                    className={`pr-12 transition-all duration-200 ${validationErrors.new ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} bg-white dark:bg-slate-700 rounded-xl`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {validationErrors.new && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.new}</p>
                )}
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirm new password"
                    className={`pr-12 transition-all duration-200 ${validationErrors.confirm ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500'} bg-white dark:bg-slate-700 rounded-xl`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {validationErrors.confirm && (
                  <p className="text-sm text-red-600 mt-2 font-medium">{validationErrors.confirm}</p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end pt-4"
            >
              <Button
                onClick={handlePasswordChange}
                disabled={saveStatus === 'saving' || !passwordData.current || !passwordData.new || !passwordData.confirm}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Key className="h-4 w-4 mr-2" />
                {saveStatus === 'saving' ? 'Updating...' : 'Update Password'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Permissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group"
      >
        <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/50 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Shield className="h-5 w-5 text-indigo-600" />
              Account Permissions
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your current access permissions and roles in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.permissions.map((permission, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{permission}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Security Notice</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    As a policymaker, you have access to sensitive environmental data and critical decision-making tools.
                    Please ensure your account credentials are kept secure and report any suspicious activity immediately.
                    Regular password updates and secure access practices help maintain the integrity of our environmental monitoring systems.
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileSettingsTab;