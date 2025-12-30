'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { Avatar } from '@/components';
import { SplitType, SplitDetail, Transaction } from '@/types';
import { Percent, Hash, Equal } from 'lucide-react';
import { getCurrency, formatCurrency } from '@/lib/currencies';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string;
  editTransaction?: Transaction | null;
}

export default function AddTransactionModal({ isOpen, onClose, groupId, editTransaction }: AddTransactionModalProps) {
  const { users, groups, addTransaction, updateTransaction, getGroupMembers, getTransactionSplits } = useStore();
  const { defaultCurrency } = useSettingsStore();
  const currency = getCurrency(defaultCurrency);

  const isEditMode = !!editTransaction;

  const splitTypeOptions: { value: SplitType; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'equal', label: 'Equal', icon: <Equal className="h-4 w-4" />, description: 'Split equally among all' },
    { value: 'exact', label: 'Exact', icon: <span className="text-sm font-medium">{currency.symbol}</span>, description: 'Enter exact amounts' },
    { value: 'percentage', label: 'Percentage', icon: <Percent className="h-4 w-4" />, description: 'Split by percentage' },
    { value: 'shares', label: 'Shares', icon: <Hash className="h-4 w-4" />, description: 'Split by share ratio' },
  ];

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [participants, setParticipants] = useState<string[]>([]);
  const [splits, setSplits] = useState<SplitDetail[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableUsers = selectedGroupId ? getGroupMembers(selectedGroupId) : users;

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        // Edit mode - populate with existing transaction data
        setDescription(editTransaction.description);
        setAmount(editTransaction.amount.toString());
        setPaidBy(editTransaction.paid_by);
        setSelectedGroupId(editTransaction.group_id || '');
        setSplitType(editTransaction.split_type);
        setDate(editTransaction.date.split('T')[0]);

        // Get existing splits
        const existingSplits = getTransactionSplits(editTransaction.id);
        const participantIds = existingSplits.map(s => s.user_id);
        setParticipants(participantIds);

        // Set splits with existing values
        const splitDetails: SplitDetail[] = existingSplits.map(s => ({
          userId: s.user_id,
          amount: s.amount,
          percentage: s.percentage,
          shares: s.shares,
        }));
        setSplits(splitDetails);
      } else {
        // Add mode - reset form
        setDescription('');
        setAmount('');
        setPaidBy(users[0]?.id || '');
        setSelectedGroupId(groupId || '');
        setSplitType('equal');
        setParticipants(availableUsers.map(u => u.id));
        setSplits([]);
        setDate(new Date().toISOString().split('T')[0]);
      }
      setErrors({});
    }
  }, [isOpen, editTransaction, groupId, users]);

  // Update participants when group changes (only in add mode)
  useEffect(() => {
    if (!isEditMode) {
      if (selectedGroupId) {
        const members = getGroupMembers(selectedGroupId);
        setParticipants(members.map(u => u.id));
        if (members.length > 0 && !members.find(m => m.id === paidBy)) {
          setPaidBy(members[0].id);
        }
      } else {
        setParticipants(users.map(u => u.id));
      }
    }
  }, [selectedGroupId, isEditMode]);

  // Update splits when participants or split type changes (only when not initially loading edit data)
  useEffect(() => {
    if (!isEditMode || splits.length === 0) {
      const newSplits = participants.map(userId => {
        const existingSplit = splits.find(s => s.userId === userId);
        return {
          userId,
          amount: splitType === 'exact' ? (existingSplit?.amount || 0) : undefined,
          percentage: splitType === 'percentage' ? (existingSplit?.percentage || 100 / participants.length) : undefined,
          shares: splitType === 'shares' ? (existingSplit?.shares || 1) : undefined,
        };
      });
      setSplits(newSplits);
    }
  }, [participants, splitType]);

  const toggleParticipant = (userId: string) => {
    if (participants.includes(userId)) {
      if (participants.length > 1) {
        setParticipants(participants.filter(id => id !== userId));
        setSplits(splits.filter(s => s.userId !== userId));
      }
    } else {
      setParticipants([...participants, userId]);
    }
  };

  const updateSplit = (userId: string, field: 'amount' | 'percentage' | 'shares', value: number) => {
    setSplits(splits.map(s =>
      s.userId === userId ? { ...s, [field]: value } : s
    ));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }

    if (!paidBy) {
      newErrors.paidBy = 'Select who paid';
    }

    if (participants.length === 0) {
      newErrors.participants = 'Select at least one participant';
    }

    if (splitType === 'exact') {
      const totalSplit = splits.reduce((sum, s) => sum + (s.amount || 0), 0);
      if (Math.abs(totalSplit - amountNum) > 0.01) {
        newErrors.splits = 'Split amounts must equal total';
      }
    }

    if (splitType === 'percentage') {
      const totalPercent = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
      if (Math.abs(totalPercent - 100) > 0.01) {
        newErrors.splits = 'Percentages must equal 100%';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const transactionData = {
        description: description.trim(),
        amount: parseFloat(amount),
        paidBy,
        groupId: selectedGroupId || undefined,
        splitType,
        participants,
        splits,
        date,
      };

      if (isEditMode && editTransaction) {
        await updateTransaction(editTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountNum = parseFloat(amount) || 0;
  const perPersonAmount = participants.length > 0 ? amountNum / participants.length : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Expense" : "Add Expense"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Description"
          placeholder="What was this expense for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            leftIcon={<span className="text-sm font-medium">{currency.symbol}</span>}
            error={errors.amount}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {groups.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Group (Optional)
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 focus:outline-none"
            >
              <option value="">No group (individual)</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            Paid by
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 focus:outline-none"
          >
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          {errors.paidBy && <p className="mt-1 text-sm text-[var(--danger)]">{errors.paidBy}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            Split Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {splitTypeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSplitType(option.value)}
                className={'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ' + (
                  splitType === option.value
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary-dark)]'
                    : 'border-[var(--card-border)] hover:border-[var(--muted)] text-[var(--muted)]'
                )}
              >
                {option.icon}
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            Split between
          </label>
          {errors.participants && <p className="mb-2 text-sm text-[var(--danger)]">{errors.participants}</p>}
          {errors.splits && <p className="mb-2 text-sm text-[var(--danger)]">{errors.splits}</p>}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableUsers.map(user => {
              const isSelected = participants.includes(user.id);
              const split = splits.find(s => s.userId === user.id);

              return (
                <div
                  key={user.id}
                  className={'flex items-center justify-between p-3 rounded-lg border transition-all ' + (
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/30'
                      : 'border-[var(--card-border)] opacity-60'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleParticipant(user.id)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className={'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ' + (
                      isSelected
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'border-[var(--muted)]'
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <Avatar name={user.name} size="sm" />
                    <span className="font-medium text-[var(--foreground)]">{user.name}</span>
                  </button>

                  {isSelected && splitType !== 'equal' && (
                    <div className="flex items-center gap-2">
                      {splitType === 'exact' && (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={split?.amount || ''}
                          onChange={(e) => updateSplit(user.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-sm rounded border border-[var(--card-border)] bg-[var(--card)]"
                          placeholder="$0.00"
                        />
                      )}
                      {splitType === 'percentage' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={split?.percentage || ''}
                            onChange={(e) => updateSplit(user.id, 'percentage', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm rounded border border-[var(--card-border)] bg-[var(--card)]"
                          />
                          <span className="text-sm text-[var(--muted)]">%</span>
                        </div>
                      )}
                      {splitType === 'shares' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="1"
                            min="1"
                            value={split?.shares || ''}
                            onChange={(e) => updateSplit(user.id, 'shares', parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 text-sm rounded border border-[var(--card-border)] bg-[var(--card)]"
                          />
                          <span className="text-sm text-[var(--muted)]">shares</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isSelected && splitType === 'equal' && amountNum > 0 && (
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {formatCurrency(perPersonAmount, defaultCurrency)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[var(--card-border)]">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            {isEditMode ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
