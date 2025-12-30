'use client';

const SESSION_KEY = 'expensable_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Get admin password from environment variable
const getAdminPassword = (): string => {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
};

// Check if admin password is configured
export function isPasswordConfigured(): boolean {
  return getAdminPassword().length > 0;
}

// Check if password is set up (always true if env is configured)
export async function isPasswordSetup(): Promise<boolean> {
  return isPasswordConfigured();
}

// Login with password
export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return { success: false, error: 'Admin password not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD in environment.' };
  }

  if (password !== adminPassword) {
    return { success: false, error: 'Invalid password' };
  }

  // Create session
  if (typeof window !== 'undefined') {
    const session = {
      authenticated: true,
      expiresAt: Date.now() + SESSION_DURATION,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { success: true };
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return false;

  try {
    const session = JSON.parse(sessionStr);
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return session.authenticated === true;
  } catch {
    return false;
  }
}

// Logout
export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Setup password - not needed anymore, just login
export async function setupPassword(password: string): Promise<{ success: boolean; error?: string }> {
  return login(password);
}

// Change password - not supported with env-based auth
export async function changePassword(_currentPassword: string, _newPassword: string): Promise<{ success: boolean; error?: string }> {
  return {
    success: false,
    error: 'Password is configured in environment variables. Update NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local file to change it.'
  };
}
