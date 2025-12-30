'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Input, Card } from '@/components';
import { Wallet, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  isSetup: boolean;
}

export default function LoginPage({ isSetup }: LoginPageProps) {
  const { login, setupPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!isSetup) {
        // Setting up for the first time
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }

        const result = await setupPassword(password);
        if (!result.success) {
          setError(result.error || 'Failed to set up password');
        }
      } else {
        // Logging in
        const result = await login(password);
        if (!result.success) {
          setError(result.error || 'Invalid password');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
              <Wallet className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Expensable</h1>
          <p className="text-[var(--muted)] mt-2">
            {isSetup ? 'Welcome back! Enter your password to continue.' : 'Welcome! Set up your admin password to get started.'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label={isSetup ? 'Password' : 'Create Password'}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />
            </div>

            {!isSetup && (
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            )}

            {error && (
              <div className="p-3 rounded-lg bg-[var(--danger-light)] border border-[var(--danger)]">
                <p className="text-sm text-[var(--danger)]">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSetup ? 'Login' : 'Set Up Password'}
            </Button>
          </form>

          {!isSetup && (
            <div className="mt-4 p-3 rounded-lg bg-[var(--muted-light)]">
              <p className="text-xs text-[var(--muted)]">
                <strong>Note:</strong> This password protects your Expensable instance.
                Make sure to remember it - password recovery requires Supabase configuration.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
