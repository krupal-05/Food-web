import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { authService } from '../../services/auth.service.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    pincode: user?.address?.pincode || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      await updateProfile({
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        phone: profileData.phone.trim(),
        address: {
          street: profileData.street.trim(),
          city: profileData.city.trim(),
          pincode: profileData.pincode.trim(),
        },
      });
      success('Profile details updated successfully!');
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!passwordData.oldPassword) errors.oldPassword = 'Old password is required';
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsChangingPassword(true);
      await authService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-950 tracking-tight font-['Outfit']">
          Account Profile & Security
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, delivery addresses, and login credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>

          <h3 className="text-lg font-black text-slate-900">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {user?.role || 'Customer'}</span>
          </div>

          <div className="w-full pt-6 mt-6 border-t border-slate-100 text-left text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span>Account Status</span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Member Since</span>
              <span className="font-bold text-slate-800">
                {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="md:col-span-7 flex flex-col gap-8">
          {/* Personal Information Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  required
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  disabled
                  value={user?.email || ''}
                  helperText="Email is unique and verified."
                />
                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="9876543210"
                />
              </div>

              {/* Address */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Saved Delivery Address
                </label>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Street / Building / Flat"
                    value={profileData.street}
                    onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                    <Input
                      placeholder="Pincode (6-digit)"
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdatingProfile}
                  icon={Save}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              <span>Change Password</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <Input
                label="Current Password"
                type="password"
                required
                value={passwordData.oldPassword}
                error={passwordErrors.oldPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  required
                  value={passwordData.newPassword}
                  error={passwordErrors.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  error={passwordErrors.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="outline"
                  size="md"
                  isLoading={isChangingPassword}
                  icon={Lock}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
