'use client';

import { Wallet, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and tagline */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold text-[var(--foreground)]">Expensable</span>
                <p className="text-xs text-[var(--muted)]">Track expenses, split bills, settle debts</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] btn-transition"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-[var(--card-border)]">
            <p className="text-center text-sm text-[var(--muted)]">
              <span className="flex items-center justify-center gap-1">
                Made with <Heart className="h-4 w-4 text-[var(--danger)] fill-current" />
                <span>&copy; {currentYear} Expensable. Self-hosted money management.</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
