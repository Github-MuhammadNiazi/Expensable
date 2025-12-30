'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useNetworkStatus() {
  const setOnlineStatus = useStore((state) => state.setOnlineStatus);
  const isOnline = useStore((state) => state.isOnline);
  const isSyncing = useStore((state) => state.isSyncing);
  const lastSyncTime = useStore((state) => state.lastSyncTime);
  const syncNow = useStore((state) => state.syncNow);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setOnlineStatus(true);
    };

    const handleOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncNow,
  };
}
