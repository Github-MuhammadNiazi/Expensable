'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY_CODE } from '@/lib/currencies';
import { AppSettings } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

interface SettingsState extends AppSettings {
  isHydrated: boolean;
  setDefaultCurrency: (currencyCode: string) => void;
  setAdminUserId: (userId: string) => void;
  syncFromCloud: () => Promise<void>;
  setHydrated: (hydrated: boolean) => void;
}

// Sync setting to cloud
async function syncSettingToCloud(key: string, value: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from('app_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'key',
    });

    if (error) {
      console.error('Failed to sync setting to cloud:', error);
    }
  } catch (error) {
    console.error('Failed to sync setting to cloud:', error);
  }
}

// Fetch setting from cloud
async function fetchSettingFromCloud(key: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Failed to fetch setting from cloud:', error);
      }
      return null;
    }

    return data?.value || null;
  } catch (error) {
    console.error('Failed to fetch setting from cloud:', error);
    return null;
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultCurrency: DEFAULT_CURRENCY_CODE,
      adminUserId: null,
      isHydrated: false,

      setDefaultCurrency: (currencyCode: string) => {
        set({ defaultCurrency: currencyCode });
        // Sync to cloud in background
        syncSettingToCloud('defaultCurrency', currencyCode);
      },

      setAdminUserId: (userId: string) => {
        set({ adminUserId: userId });
        // Sync to cloud in background
        syncSettingToCloud('adminUserId', userId);
      },

      syncFromCloud: async () => {
        // Fetch currency from cloud
        const cloudCurrency = await fetchSettingFromCloud('defaultCurrency');
        if (cloudCurrency) {
          set({ defaultCurrency: cloudCurrency });
        }

        // Fetch admin user ID from cloud
        const cloudAdminUserId = await fetchSettingFromCloud('adminUserId');
        if (cloudAdminUserId) {
          set({ adminUserId: cloudAdminUserId });
        }
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'expensable-settings',
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated after rehydration
        state?.setHydrated(true);
        // Sync from cloud after local storage is hydrated
        state?.syncFromCloud();
      },
    }
  )
);
