'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardTitle, Button, EmptyState, Avatar, Modal, Input } from '@/components';
import { UsersRound, Plus, Pencil, Trash2, UserPlus, UserMinus, Receipt } from 'lucide-react';
import AddTransactionModal from '@/components/AddTransactionModal';
import SettleUpModal from '@/components/SettleUpModal';

function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2);
}

export default function GroupsPage() {
  const {
    initialize,
    isInitialized,
    isLoading,
    users,
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    getGroupMembers,
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupBalance,
    transactions
  } = useStore();

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
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

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsSubmitting(true);
    try {
      await addGroup(groupName.trim(), groupDescription.trim() || undefined);
      setGroupName('');
      setGroupDescription('');
      setShowAddGroup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !selectedGroupId) return;

    setIsSubmitting(true);
    try {
      await updateGroup(selectedGroupId, {
        name: groupName.trim(),
        description: groupDescription.trim() || undefined
      });
      setGroupName('');
      setGroupDescription('');
      setSelectedGroupId(null);
      setShowEditGroup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupId) return;

    setIsSubmitting(true);
    try {
      await deleteGroup(selectedGroupId);
      setSelectedGroupId(null);
      setShowDeleteConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroupId(groupId);
      setGroupName(group.name);
      setGroupDescription(group.description || '');
      setShowEditGroup(true);
    }
  };

  const openDeleteModal = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowDeleteConfirm(true);
  };

  const openManageMembers = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowManageMembers(true);
  };

  const openAddTransaction = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowAddTransaction(true);
  };

  const openSettleUp = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowSettleUp(true);
  };

  const toggleMember = async (userId: string) => {
    if (!selectedGroupId) return;
    const members = getGroupMembers(selectedGroupId);
    const isMember = members.some(m => m.id === userId);

    if (isMember) {
      await removeMemberFromGroup(selectedGroupId, userId);
    } else {
      await addMemberToGroup(selectedGroupId, userId);
    }
  };

  const getGroupTransactionCount = (groupId: string) => {
    return transactions.filter(t => t.group_id === groupId).length;
  };

  const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;
  const selectedGroupMembers = selectedGroupId ? getGroupMembers(selectedGroupId) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Groups</h1>
          <p className="text-[var(--muted)] mt-1">Manage groups and their expenses</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowAddGroup(true)}
        >
          Create Group
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Add users first"
          description="You need to add users before creating groups."
          action={
            <a href="/users">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Add Users
              </Button>
            </a>
          }
        />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No groups yet"
          description="Create groups to organize expenses and split bills with multiple people."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddGroup(true)}>
              Create Your First Group
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, index) => {
            const members = getGroupMembers(group.id);
            const balance = getGroupBalance(group.id);
            const transactionCount = getGroupTransactionCount(group.id);

            return (
              <Card
                key={group.id}
                className="animate-fade-in"
                style={{ animationDelay: index * 0.05 + 's' }}
                hover
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-[var(--muted)] mt-1">{group.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openManageMembers(group.id)}
                      className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--muted-light)] hover:text-[var(--foreground)] transition-colors"
                      title="Manage members"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(group.id)}
                      className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--muted-light)] hover:text-[var(--foreground)] transition-colors"
                      title="Edit group"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(group.id)}
                      className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                      title="Delete group"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-[var(--muted)] mb-2">{members.length} members</p>
                  <div className="flex -space-x-2">
                    {members.slice(0, 5).map(member => (
                      <Avatar key={member.id} name={member.name} size="sm" className="ring-2 ring-[var(--card)]" />
                    ))}
                    {members.length > 5 && (
                      <div className="h-8 w-8 rounded-full bg-[var(--muted-light)] flex items-center justify-center text-xs font-medium text-[var(--muted)] ring-2 ring-[var(--card)]">
                        +{members.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Total owed</span>
                    <span className="text-[var(--success)]">+{formatCurrency(balance.totalOwed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Total owing</span>
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
                    onClick={() => openAddTransaction(group.id)}
                    disabled={members.length === 0}
                  >
                    Add Expense
                  </Button>
                  {(balance.totalOwed > 0 || balance.totalOwing > 0) && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => openSettleUp(group.id)}
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

      {/* Add Group Modal */}
      <Modal isOpen={showAddGroup} onClose={() => setShowAddGroup(false)} title="Create Group">
        <form onSubmit={handleAddGroup} className="space-y-4">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <Input
            label="Description (Optional)"
            placeholder="Enter description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowAddGroup(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Create Group
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Group Modal */}
      <Modal isOpen={showEditGroup} onClose={() => setShowEditGroup(false)} title="Edit Group">
        <form onSubmit={handleEditGroup} className="space-y-4">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <Input
            label="Description (Optional)"
            placeholder="Enter description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowEditGroup(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manage Members Modal */}
      <Modal isOpen={showManageMembers} onClose={() => setShowManageMembers(false)} title={'Manage Members' + (selectedGroup ? ' - ' + selectedGroup.name : '')} size="md">
        <div className="space-y-2">
          {users.map(user => {
            const isMember = selectedGroupMembers.some(m => m.id === user.id);
            return (
              <button
                key={user.id}
                onClick={() => toggleMember(user.id)}
                className={'w-full flex items-center justify-between p-3 rounded-lg border transition-all ' + (
                  isMember
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/30'
                    : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <div className="text-left">
                    <p className="font-medium text-[var(--foreground)]">{user.name}</p>
                    {user.email && (
                      <p className="text-sm text-[var(--muted)]">{user.email}</p>
                    )}
                  </div>
                </div>
                {isMember ? (
                  <UserMinus className="h-5 w-5 text-[var(--danger)]" />
                ) : (
                  <UserPlus className="h-5 w-5 text-[var(--primary)]" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex gap-3 pt-4 mt-4 border-t border-[var(--card-border)]">
          <Button type="button" variant="ghost" onClick={() => setShowManageMembers(false)} className="flex-1">
            Done
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Group">
        <div className="space-y-4">
          <p className="text-[var(--foreground)]">
            Are you sure you want to delete this group? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="danger" isLoading={isSubmitting} onClick={handleDeleteGroup} className="flex-1">
              Delete Group
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => {
          setShowAddTransaction(false);
          setSelectedGroupId(null);
        }}
        groupId={selectedGroupId || undefined}
      />

      {/* Settle Up Modal */}
      <SettleUpModal
        isOpen={showSettleUp}
        onClose={() => {
          setShowSettleUp(false);
          setSelectedGroupId(null);
        }}
        groupId={selectedGroupId}
      />
    </div>
  );
}
