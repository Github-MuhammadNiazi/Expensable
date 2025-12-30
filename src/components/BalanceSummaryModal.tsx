'use client';

import { useMemo } from 'react';
import Modal from './Modal';
import { BalanceSummary, BalanceDetail } from '@/lib/balanceSummary';
import { formatCurrency } from '@/lib/currencies';
import { ArrowRight, TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface BalanceSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: BalanceSummary | null;
}

export default function BalanceSummaryModal({ isOpen, onClose, summary }: BalanceSummaryModalProps) {
  if (!summary) return null;

  const format = (amount: number) => formatCurrency(amount, summary.currency);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={summary.title} size="md">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/20">
                <TrendingUp className="h-5 w-5 text-[var(--success)]" />
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">Owed to You</span>
            </div>
            <span className="text-lg font-bold text-[var(--success)]">
              {format(summary.totalOwed)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--danger)]/20">
                <TrendingDown className="h-5 w-5 text-[var(--danger)]" />
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">You Owe</span>
            </div>
            <span className="text-lg font-bold text-[var(--danger)]">
              {format(summary.totalOwing)}
            </span>
          </div>

          <div className={'flex items-center justify-between p-4 rounded-lg border ' + (
            summary.netBalance >= 0
              ? 'bg-[var(--success)]/5 border-[var(--success)]/30'
              : 'bg-[var(--danger)]/5 border-[var(--danger)]/30'
          )}>
            <div className="flex items-center gap-3">
              <div className={'flex h-10 w-10 items-center justify-center rounded-full ' + (
                summary.netBalance >= 0 ? 'bg-[var(--success)]/20' : 'bg-[var(--danger)]/20'
              )}>
                <Scale className={'h-5 w-5 ' + (
                  summary.netBalance >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                )} />
              </div>
              <span className="text-sm font-medium text-[var(--foreground)]">Net Balance</span>
            </div>
            <span className={'text-lg font-bold ' + (
              summary.netBalance >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
            )}>
              {(summary.netBalance >= 0 ? '+' : '') + format(summary.netBalance)}
            </span>
          </div>
        </div>

        {/* Settlement Details */}
        {summary.details.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              Settlement Details
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {summary.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted-light)] border border-[var(--card-border)]"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium text-[var(--foreground)] truncate">
                      {detail.fromUser}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--muted)] flex-shrink-0" />
                    <span className="font-medium text-[var(--foreground)] truncate">
                      {detail.toUser}
                    </span>
                  </div>
                  <span className="ml-3 font-semibold text-[var(--danger)] flex-shrink-0">
                    {format(detail.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {summary.details.length === 0 && (
          <div className="text-center py-6 text-[var(--muted)]">
            No outstanding balances to settle.
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-[var(--muted)] pt-2 border-t border-[var(--card-border)]">
          Generated on {summary.date}
        </div>
      </div>
    </Modal>
  );
}
