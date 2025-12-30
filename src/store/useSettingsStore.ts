'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY_CODE } from '@/lib/currencies';
import { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  setDefaultCurrency: (currencyCode: string) => void;
  setAdminUserId: (userId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultCurrency: DEFAULT_CURRENCY_CODE,
      adminUserId: null,

      setDefaultCurrency: (currencyCode: string) => {
        set({ defaultCurrency: currencyCode });
      },

      setAdminUserId: (userId: string) => {
        set({ adminUserId: userId });
      },
    }),
    {
      name: 'expensable-settings',
    }
  )
);
