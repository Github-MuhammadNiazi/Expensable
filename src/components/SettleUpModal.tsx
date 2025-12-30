'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { Avatar } from '@/components';
import { DollarSign, ArrowRight } from 'lucide-react';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  groupId?: string | null;
}

export default function SettleUpModal({ isOpen, onClose, userId, groupId }: SettleUpModalProps) {
  const { users, groups, settleUp, getUserBalance, getGroupBalance } = useStore();

  const [fromUserId, setFromUserId] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedGroup = groupId ? groups.find(g => g.id === groupId) : null;
  const selectedUser = userId ? users.find(u => u.id === userId) : null;

  useEffect(() => {
    if (isOpen) {
      setFromUserId(users[0]?.id || '');
      setToUserId(userId || (users[1]?.id || ''));
      setNote('');
      setErrors({});

      if (userId) {
        const balance = getUserBalance(userId);
        if (balance.netBalance < 0) {
          setFromUserId(userId);
          setToUserId(users.find(u => u.id !== userId)?.id || '');
          setAmount(Math.abs(balance.netBalance).toFixed(2));
        } else {
          setFromUserId(users.find(u => u.id !== userId)?.id || '');
          setToUserId(userId);
          setAmount(balance.netBalance.toFixed(2));
        }
      } else if (groupId) {
        const groupBalance = getGroupBalance(groupId);
        const owingUsers = groupBalance.balances.filter(b => b.amount < 0);
        const owedUsers = groupBalance.balances.filter(b => b.amount > 0);

        if (owingUsers.length > 0 && owedUsers.length > 0) {
          setFromUserId(owingUsers[0].userId);
          setToUserId(owedUsers[0].userId);
          setAmount(Math.min(Math.abs(owingUsers[0].amount), owedUsers[0].amount).toFixed(2));
        }
      } else {
        setAmount('');
      }
    }
  }, [isOpen, userId, groupId, users]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fromUserId) {
      newErrors.fromUserId = 'Select who is paying';
    }

    if (!toUserId) {
      newErrors.toUserId = 'Select who is receiving';
    }

    if (fromUserId === toUserId) {
      newErrors.toUserId = 'Cannot settle with same person';
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await settleUp(
        fromUserId,
        toUserId,
        parseFloat(amount),
        groupId || undefined,
        note.trim() || undefined
      );
      onClose();
    } catch (error) {
      console.error('Failed to settle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fromUser = users.find(u => u.id === fromUserId);
  const toUser = users.find(u => u.id === toUserId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settle Up" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedGroup && (
          <div className="p-4 rounded-lg bg-[var(--muted-light)] border border-[var(--card-border)]">
            <p className="text-sm text-[var(--muted)]">Settling within group</p>
            <p className="font-medium text-[var(--foreground)]">{selectedGroup.name}</p>
          </div>
        )}

        {selectedUser && !groupId && (
          <div className="p-4 rounded-lg bg-[var(--muted-light)] border border-[var(--card-border)]">
            <p className="text-sm text-[var(--muted)]">Settling with</p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={selectedUser.name} size="sm" />
              <p className="font-medium text-[var(--foreground)]">{selectedUser.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              From (Who is paying)
            </label>
            <select
              value={fromUserId}
              onChange={(e) => setFromUserId(e.target.value)}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 focus:outline-none"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            {errors.fromUserId && <p className="mt-1 text-sm text-[var(--danger)]">{errors.fromUserId}</p>}
          </div>

          <ArrowRight className="h-5 w-5 text-[var(--muted)] mt-6" />

          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              To (Who is receiving)
            </label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 focus:outline-none"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            {errors.toUserId && <p className="mt-1 text-sm text-[var(--danger)]">{errors.toUserId}</p>}
          </div>
        </div>

        {fromUser && toUser && fromUserId !== toUserId && (
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-[var(--primary-light)]/30">
            <div className="flex items-center gap-2">
              <Avatar name={fromUser.name} size="sm" />
              <span className="font-medium">{fromUser.name}</span>
            </div>
            <ArrowRight className="h-5 w-5 text-[var(--primary)]" />
            <div className="flex items-center gap-2">
              <Avatar name={toUser.name} size="sm" />
              <span className="font-medium">{toUser.name}</span>
            </div>
          </div>
        )}

        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          leftIcon={<DollarSign className="h-4 w-4" />}
          error={errors.amount}
        />

        <Input
          label="Note (Optional)"
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-3 pt-4 border-t border-[var(--card-border)]">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            Settle Up
          </Button>
        </div>
      </form>
    </Modal>
  );
}
