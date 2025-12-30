'use client';

import { AuthProvider } from './AuthProvider';
import AuthGuard from './AuthGuard';
import Header from './Header';
import Footer from './Footer';
import ServiceWorkerRegistration from './ServiceWorkerRegistration';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegistration />
      <Header />
      <main className="flex-1">
        <AuthGuard>{children}</AuthGuard>
      </main>
      <Footer />
    </AuthProvider>
  );
}
