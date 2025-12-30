'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardTitle, Button, EmptyState, Avatar, BalanceSummaryModal } from '@/components';
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Users,
  UsersRound,
  Plus,
  Wallet,
  Receipt,
  Pencil,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import AddTransactionModal from '@/components/AddTransactionModal';
import SettleUpModal from '@/components/SettleUpModal';
import { formatCurrency as formatCurrencyUtil } from '@/lib/currencies';
import { Transaction } from '@/types';
import { BalanceSummary, generateBalancePDF, isMobileDevice } from '@/lib/balanceSummary';

export default function Dashboard() {
  const {
    initialize,
    isInitialized,
    isLoading,
    users,
    groups,
    transactions,
    getAllBalances,
    getGroupBalance,
  } = useStore();

  const { defaultCurrency } = useSettingsStore();

  const formatCurrency = (amount: number) => formatCurrencyUtil(amount, defaultCurrency);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [settleUserId, setSettleUserId] = useState<string | null>(null);
  const [settleGroupId, setSettleGroupId] = useState<string | null>(null);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [showBalanceSummary, setShowBalanceSummary] = useState(false);
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummary | null>(null);

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

  const balances = getAllBalances();
  const totalOwed = balances.reduce((sum, b) => sum + b.totalOwed, 0);
  const totalOwing = balances.reduce((sum, b) => sum + b.totalOwing, 0);
  const netBalance = totalOwed - totalOwing;

  const usersWithBalance = balances.filter(b => b.netBalance !== 0).sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));

  const groupsWithBalance = groups.map(g => ({
    ...g,
    balance: getGroupBalance(g.id)
  })).filter(g => g.balance.totalOwed > 0 || g.balance.totalOwing > 0);

  const handleSettleUser = (userId: string) => {
    setSettleUserId(userId);
    setSettleGroupId(null);
    setShowSettleUp(true);
  };

  const handleSettleGroup = (groupId: string) => {
    setSettleGroupId(groupId);
    setSettleUserId(null);
    setShowSettleUp(true);
  };

  const handleViewGroupSummary = (groupId: string) => {
    const groupBalance = getGroupBalance(groupId);
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    // Calculate who owes whom within the group
    const details = groupBalance.balances
      .filter(b => b.amount < 0)
      .map(debtor => {
        // Find creditors (those with positive balance)
        const creditors = groupBalance.balances.filter(b => b.amount > 0);
        return creditors.map(creditor => ({
          fromUser: debtor.userName,
          toUser: creditor.userName,
          amount: Math.min(Math.abs(debtor.amount), creditor.amount),
        }));
      })
      .flat()
      .filter(d => d.amount > 0);

    const summary: BalanceSummary = {
      title: `${group.name} - Balance Summary`,
      date: new Date().toLocaleDateString(),
      currency: defaultCurrency,
      totalOwed: groupBalance.totalOwed,
      totalOwing: groupBalance.totalOwing,
      netBalance: groupBalance.totalOwed - groupBalance.totalOwing,
      details,
    };

    if (isMobileDevice()) {
      setBalanceSummary(summary);
      setShowBalanceSummary(true);
    } else {
      generateBalancePDF(summary);
    }
  };

  const handleViewUserSummary = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const userBalance = balances.find(b => b.userId === userId);
    if (!userBalance) return;

    // Calculate detailed balance with this user
    const details: { fromUser: string; toUser: string; amount: number }[] = [];

    // Get admin user name (first user is typically admin)
    const adminName = users[0]?.name || 'You';

    if (userBalance.totalOwing > 0) {
      // Admin owes this user
      details.push({
        fromUser: adminName,
        toUser: user.name,
        amount: userBalance.totalOwing,
      });
    }

    if (userBalance.totalOwed > 0) {
      // This user owes admin
      details.push({
        fromUser: user.name,
        toUser: adminName,
        amount: userBalance.totalOwed,
      });
    }

    const summary: BalanceSummary = {
      title: `${user.name} - Balance Summary`,
      date: new Date().toLocaleDateString(),
      currency: defaultCurrency,
      totalOwed: userBalance.totalOwed,
      totalOwing: userBalance.totalOwing,
      netBalance: userBalance.netBalance,
      details,
    };

    if (isMobileDevice()) {
      setBalanceSummary(summary);
      setShowBalanceSummary(true);
    } else {
      generateBalancePDF(summary);
    }
  };

  const hasData = users.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--muted)] mt-1">Track your expenses and balances</p>
        </div>
        {hasData && (
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddTransaction(true)}
          >
            Add Expense
          </Button>
        )}
      </div>

      {!hasData ? (
        <EmptyState
          icon={Wallet}
          title="Welcome to Expensable"
          description="Get started by adding users to track expenses with. You can create groups and split bills easily."
          action={
            <Link href="/users">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Add Your First User
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="animate-fade-in" hover>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--success)]/10">
                  <TrendingUp className="h-6 w-6 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">You are owed</p>
                  <p className="text-xl font-bold text-[var(--success)]">
                    {formatCurrency(totalOwed)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="animate-fade-in" hover>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--danger)]/10">
                  <TrendingDown className="h-6 w-6 text-[var(--danger)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">You owe</p>
                  <p className="text-xl font-bold text-[var(--danger)]">
                    {formatCurrency(totalOwing)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="animate-fade-in" hover>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                  <ArrowRightLeft className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">Net Balance</p>
                  <p className={'text-xl font-bold ' + (netBalance >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                    {(netBalance >= 0 ? '+' : '') + formatCurrency(netBalance)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="animate-fade-in" hover>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--secondary)]/10">
                  <Receipt className="h-6 w-6 text-[var(--secondary)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">Transactions</p>
                  <p className="text-xl font-bold text-[var(--foreground)]">
                    {transactions.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="none">
              <div className="p-6 border-b border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UsersRound className="h-5 w-5 text-[var(--primary)]" />
                    <CardTitle>Group Balances</CardTitle>
                  </div>
                  <Link href="/groups" className="text-sm text-[var(--primary)] hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-[var(--card-border)]">
                {groupsWithBalance.length === 0 ? (
                  <div className="p-6 text-center text-[var(--muted)]">
                    No unsettled group balances
                  </div>
                ) : (
                  groupsWithBalance.slice(0, 5).map((group) => (
                    <div key={group.id} className="p-4 flex items-center justify-between hover:bg-[var(--muted-light)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                          <UsersRound className="h-5 w-5 text-[var(--primary)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{group.name}</p>
                          <p className="text-sm text-[var(--muted)]">
                            {group.balance.balances.length} members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          {group.balance.totalOwed > 0 && (
                            <p className="text-sm text-[var(--success)]">
                              +{formatCurrency(group.balance.totalOwed)}
                            </p>
                          )}
                          {group.balance.totalOwing > 0 && (
                            <p className="text-sm text-[var(--danger)]">
                              -{formatCurrency(group.balance.totalOwing)}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewGroupSummary(group.id)}
                          title="View balance summary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSettleGroup(group.id)}
                        >
                          Settle
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card padding="none">
              <div className="p-6 border-b border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[var(--secondary)]" />
                    <CardTitle>Individual Balances</CardTitle>
                  </div>
                  <Link href="/users" className="text-sm text-[var(--primary)] hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-[var(--card-border)]">
                {usersWithBalance.length === 0 ? (
                  <div className="p-6 text-center text-[var(--muted)]">
                    No unsettled individual balances
                  </div>
                ) : (
                  usersWithBalance.slice(0, 5).map((balance) => {
                    const user = users.find(u => u.id === balance.userId);
                    if (!user) return null;
                    return (
                      <div key={balance.userId} className="p-4 flex items-center justify-between hover:bg-[var(--muted-light)] transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <div>
                            <p className="font-medium text-[var(--foreground)]">{user.name}</p>
                            {user.email && (
                              <p className="text-sm text-[var(--muted)]">{user.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className={'font-medium ' + (balance.netBalance >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                            {(balance.netBalance >= 0 ? '+' : '') + formatCurrency(balance.netBalance)}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewUserSummary(user.id)}
                            title="View balance summary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSettleUser(user.id)}
                          >
                            Settle
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {transactions.length > 0 && (
            <Card padding="none" className="mt-6">
              <div className="p-6 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-[var(--warning)]" />
                  <CardTitle>Recent Transactions</CardTitle>
                </div>
              </div>
              <div className="divide-y divide-[var(--card-border)]">
                {transactions.slice(-5).reverse().map((tx) => {
                  const payer = users.find(u => u.id === tx.paid_by);
                  const group = tx.group_id ? groups.find(g => g.id === tx.group_id) : null;
                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-[var(--muted-light)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--warning)]/10">
                          <Receipt className="h-5 w-5 text-[var(--warning)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{tx.description}</p>
                          <p className="text-sm text-[var(--muted)]">
                            Paid by {payer?.name || 'Unknown'} {group ? 'in ' + group.name : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-[var(--foreground)]">{formatCurrency(tx.amount)}</p>
                          <p className="text-xs text-[var(--muted)]">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditTransaction(tx);
                            setShowAddTransaction(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}

      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => {
          setShowAddTransaction(false);
          setEditTransaction(null);
        }}
        editTransaction={editTransaction}
      />
      <SettleUpModal
        isOpen={showSettleUp}
        onClose={() => {
          setShowSettleUp(false);
          setSettleUserId(null);
          setSettleGroupId(null);
        }}
        userId={settleUserId}
        groupId={settleGroupId}
      />
      <BalanceSummaryModal
        isOpen={showBalanceSummary}
        onClose={() => {
          setShowBalanceSummary(false);
          setBalanceSummary(null);
        }}
        summary={balanceSummary}
      />
    </div>
  );
}
