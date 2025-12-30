'use client';

import { useState, ReactNode, createContext, useContext } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultTab, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div
      className={`flex gap-1 p-1 rounded-lg bg-[var(--muted-light)] ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Tab({ value, children, icon }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all
        ${
          isActive
            ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}

export default Tabs;
