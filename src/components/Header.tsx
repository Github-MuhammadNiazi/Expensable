'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Users, UsersRound, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/groups', label: 'Groups', icon: UsersRound },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 btn-transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">Expensable</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-transition ${
                    isActive
                      ? 'bg-[var(--primary-light)] text-[var(--primary-dark)]'
                      : 'text-[var(--muted)] hover:bg-[var(--muted-light)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--muted-light)] btn-transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[var(--card-border)] animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium btn-transition ${
                      isActive
                        ? 'bg-[var(--primary-light)] text-[var(--primary-dark)]'
                        : 'text-[var(--muted)] hover:bg-[var(--muted-light)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
