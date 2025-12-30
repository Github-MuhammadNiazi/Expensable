'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardTitle, Button, EmptyState, Avatar, Modal, Input } from '@/components';
import { Users, Plus, Pencil, Trash2, Mail, Receipt } from 'lucide-react';
import AddTransactionModal from '@/components/AddTransactionModal';
import SettleUpModal from '@/components/SettleUpModal';

function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2);
}

export default function UsersPage() {
  const {
    initialize,
    isInitialized,
    isLoading,
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserBalance,
    transactions
  } = useStore();

  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsSubmitting(true);
    try {
      await addUser(userName.trim(), userEmail.trim() || undefined);
      setUserName('');
      setUserEmail('');
      setShowAddUser(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !selectedUserId) return;

    setIsSubmitting(true);
    try {
      await updateUser(selectedUserId, {
        name: userName.trim(),
        email: userEmail.trim() || undefined
      });
      setUserName('');
      setUserEmail('');
      setSelectedUserId(null);
      setShowEditUser(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    setIsSubmitting(true);
    try {
      await deleteUser(selectedUserId);
      setSelectedUserId(null);
      setShowDeleteConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setUserName(user.name);
      setUserEmail(user.email || '');
      setShowEditUser(true);
    }
  };

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteConfirm(true);
  };

  const openAddTransaction = (userId: string) => {
    setSelectedUserId(userId);
    setShowAddTransaction(true);
  };

  const openSettleUp = (userId: string) => {
    setSelectedUserId(userId);
    setShowSettleUp(true);
  };

  const getUserTransactionCount = (userId: string) => {
    return transactions.filter(t => t.paid_by === userId).length;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
          <p className="text-[var(--muted)] mt-1">Manage users and their balances</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddUser(true)}
        >
          Add User
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="Add users to start tracking expenses and splitting bills with them."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddUser(true)}>
              Add Your First User
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => {
            const balance = getUserBalance(user.id);
            const transactionCount = getUserTransactionCount(user.id);

            return (
              <Card
                key={user.id}
                className="animate-fade-in"
                style={{ animationDelay: index * 0.05 + 's' }}
                hover
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">{user.name}</h3>
                      {user.email && (
                        <p className="text-sm text-[var(--muted)] flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(user.id)}
                      className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--muted-light)] hover:text-[var(--foreground)] transition-colors"
                      title="Edit user"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user.id)}
                      className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Balance</span>
                    <span className={'font-semibold ' + (balance.netBalance >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                      {balance.netBalance >= 0 ? '+' : ''}{formatCurrency(balance.netBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Owed to them</span>
                    <span className="text-[var(--success)]">+{formatCurrency(balance.totalOwed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">They owe</span>
                    <span className="text-[var(--danger)]">-{formatCurrency(balance.totalOwing)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Transactions</span>
                    <span className="flex items-center gap-1 text-[var(--foreground)]">
                      <Receipt className="h-3 w-3" />
                      {transactionCount}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-[var(--card-border)]">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => openAddTransaction(user.id)}
                  >
                    Add Expense
                  </Button>
                  {balance.netBalance !== 0 && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => openSettleUp(user.id)}
                    >
                      Settle Up
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={showAddUser} onClose={() => setShowAddUser(false)} title="Add User">
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <Input
            label="Email (Optional)"
            type="email"
            placeholder="Enter email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowAddUser(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Add User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditUser} onClose={() => setShowEditUser(false)} title="Edit User">
        <form onSubmit={handleEditUser} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <Input
            label="Email (Optional)"
            type="email"
            placeholder="Enter email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowEditUser(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete User">
        <div className="space-y-4">
          <p className="text-[var(--foreground)]">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="danger" isLoading={isSubmitting} onClick={handleDeleteUser} className="flex-1">
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => {
          setShowAddTransaction(false);
          setSelectedUserId(null);
        }}
      />

      {/* Settle Up Modal */}
      <SettleUpModal
        isOpen={showSettleUp}
        onClose={() => {
          setShowSettleUp(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />
    </div>
  );
}
