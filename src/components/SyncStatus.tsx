'use client';

import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SyncStatus() {
  const { isOnline, isSyncing, lastSyncTime, syncNow } = useNetworkStatus();
  const configured = isSupabaseConfigured();

  if (!configured) {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <CloudOff className="h-3.5 w-3.5" />
        <span>Offline only</span>
      </div>
    );
  }

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <button
      onClick={() => syncNow()}
      disabled={!isOnline || isSyncing}
      className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={isOnline ? 'Click to sync now' : 'Offline - changes will sync when online'}
    >
      {isSyncing ? (
        <>
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[var(--primary)]" />
          <span>Syncing...</span>
        </>
      ) : isOnline ? (
        <>
          <Cloud className="h-3.5 w-3.5 text-[var(--success)]" />
          <span>Synced {formatLastSync(lastSyncTime)}</span>
        </>
      ) : (
        <>
          <CloudOff className="h-3.5 w-3.5 text-[var(--warning)]" />
          <span>Offline</span>
        </>
      )}
    </button>
  );
}
