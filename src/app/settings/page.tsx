'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardTitle, Button, Input } from '@/components';
import { Lock, Shield, Database, Check } from 'lucide-react';

export default function SettingsPage() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="text-[var(--muted)] mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-light)]">
              <Shield className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <p className="text-sm text-[var(--muted)]">Manage your password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              leftIcon={<Lock className="h-4 w-4" />}
              helperText="Minimum 6 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-[var(--danger-light)] border border-[var(--danger)]">
                <p className="text-sm text-[var(--danger)]">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-[var(--primary-light)] border border-[var(--primary)] flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--primary)]" />
                <p className="text-sm text-[var(--primary-dark)]">{success}</p>
              </div>
            )}

            <Button type="submit" isLoading={isSubmitting}>
              Change Password
            </Button>
          </form>
        </Card>

        {/* Data Info */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--secondary)]/10">
              <Database className="h-5 w-5 text-[var(--secondary)]" />
            </div>
            <div>
              <CardTitle>Data Storage</CardTitle>
              <p className="text-sm text-[var(--muted)]">How your data is stored</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--muted-light)]">
              <Check className="h-4 w-4 text-[var(--success)] mt-0.5" />
              <div>
                <p className="font-medium text-[var(--foreground)]">Offline-First</p>
                <p className="text-[var(--muted)]">Your data is stored locally in your browser using IndexedDB. The app works even without internet.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--muted-light)]">
              <Check className="h-4 w-4 text-[var(--success)] mt-0.5" />
              <div>
                <p className="font-medium text-[var(--foreground)]">Private</p>
                <p className="text-[var(--muted)]">All expense data stays on your device. No tracking, no analytics.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--muted-light)]">
              <Check className="h-4 w-4 text-[var(--success)] mt-0.5" />
              <div>
                <p className="font-medium text-[var(--foreground)]">Self-Hosted</p>
                <p className="text-[var(--muted)]">You control your data. Deploy anywhere - Vercel, Netlify, or your own server.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card>
          <div className="text-center text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">Expensable</p>
            <p>Version 1.0.0</p>
            <p className="mt-2">A premium money management tool</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
