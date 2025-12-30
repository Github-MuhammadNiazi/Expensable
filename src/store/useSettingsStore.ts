'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY_CODE } from '@/lib/currencies';
import { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  setDefaultCurrency: (currencyCode: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultCurrency: DEFAULT_CURRENCY_CODE,

      setDefaultCurrency: (currencyCode: string) => {
        set({ defaultCurrency: currencyCode });
      },
    }),
    {
      name: 'expensable-settings',
    }
  )
);
