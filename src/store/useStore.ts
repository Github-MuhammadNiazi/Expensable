'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Group,
  GroupMember,
  Transaction,
  TransactionSplit,
  Settlement,
  SplitType,
  UserBalance,
  GroupBalance,
  TransactionFormData,
} from '@/types';
import * as db from '@/lib/db';

interface AppState {
  users: User[];
  groups: Group[];
  groupMembers: GroupMember[];
  transactions: Transaction[];
  transactionSplits: TransactionSplit[];
  settlements: Settlement[];
  isLoading: boolean;
  isInitialized: boolean;

  // Initialization
  initialize: () => Promise<void>;

  // User actions
  addUser: (name: string, email?: string) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => User | undefined;

  // Group actions
  addGroup: (name: string, description?: string) => Promise<Group>;
  updateGroup: (id: string, data: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  getGroup: (id: string) => Group | undefined;
  addMemberToGroup: (groupId: string, userId: string) => Promise<void>;
  removeMemberFromGroup: (groupId: string, userId: string) => Promise<void>;
  getGroupMembers: (groupId: string) => User[];

  // Transaction actions
  addTransaction: (data: TransactionFormData) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransaction: (id: string) => Transaction | undefined;
  getTransactionSplits: (transactionId: string) => TransactionSplit[];

  // Settlement actions
  settleUp: (fromUserId: string, toUserId: string, amount: number, groupId?: string, note?: string) => Promise<void>;

  // Balance calculations
  getUserBalance: (userId: string) => UserBalance;
  getGroupBalance: (groupId: string) => GroupBalance;
  getAllBalances: () => UserBalance[];
  getUnsettledAmountWithUser: (userId: string) => number;
  getUnsettledAmountWithGroup: (groupId: string) => number;
}

export const useStore = create<AppState>((set, get) => ({
  users: [],
  groups: [],
  groupMembers: [],
  transactions: [],
  transactionSplits: [],
  settlements: [],
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      const [users, groups, groupMembers, transactions, transactionSplits, settlements] = await Promise.all([
        db.dbGetAllUsers(),
        db.dbGetAllGroups(),
        db.dbGetAllTransactionSplits().then(async () => {
          const allGroups = await db.dbGetAllGroups();
          const members: GroupMember[] = [];
          for (const group of allGroups) {
            const gm = await db.dbGetGroupMembers(group.id);
            members.push(...gm);
          }
          return members;
        }),
        db.dbGetAllTransactions(),
        db.dbGetAllTransactionSplits(),
        db.dbGetAllSettlements(),
      ]);

      // Flatten groupMembers properly
      const allGroupMembers: GroupMember[] = [];
      for (const group of groups) {
        const members = await db.dbGetGroupMembers(group.id);
        allGroupMembers.push(...members);
      }

      set({
        users,
        groups,
        groupMembers: allGroupMembers,
        transactions,
        transactionSplits,
        settlements,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  // User actions
  addUser: async (name: string, email?: string) => {
    const now = new Date().toISOString();
    const user: User = {
      id: uuidv4(),
      name,
      email,
      created_at: now,
      updated_at: now,
    };
    await db.dbAddUser(user);
    set((state) => ({ users: [...state.users, user] }));
    return user;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;

    const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
    await db.dbAddUser(updatedUser);
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? updatedUser : u)),
    }));
  },

  deleteUser: async (id: string) => {
    await db.dbDeleteUser(id);
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
  },

  getUser: (id: string) => {
    return get().users.find((u) => u.id === id);
  },

  // Group actions
  addGroup: async (name: string, description?: string) => {
    const now = new Date().toISOString();
    const group: Group = {
      id: uuidv4(),
      name,
      description,
      created_at: now,
      updated_at: now,
    };
    await db.dbAddGroup(group);
    set((state) => ({ groups: [...state.groups, group] }));
    return group;
  },

  updateGroup: async (id: string, data: Partial<Group>) => {
    const group = get().groups.find((g) => g.id === id);
    if (!group) return;

    const updatedGroup = { ...group, ...data, updated_at: new Date().toISOString() };
    await db.dbAddGroup(updatedGroup);
    set((state) => ({
      groups: state.groups.map((g) => (g.id === id ? updatedGroup : g)),
    }));
  },

  deleteGroup: async (id: string) => {
    await db.dbDeleteGroup(id);
    set((state) => ({ groups: state.groups.filter((g) => g.id !== id) }));
  },

  getGroup: (id: string) => {
    return get().groups.find((g) => g.id === id);
  },

  addMemberToGroup: async (groupId: string, userId: string) => {
    const existing = get().groupMembers.find(
      (m) => m.group_id === groupId && m.user_id === userId
    );
    if (existing) return;

    const member: GroupMember = {
      id: uuidv4(),
      group_id: groupId,
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    await db.dbAddGroupMember(member);
    set((state) => ({ groupMembers: [...state.groupMembers, member] }));
  },

  removeMemberFromGroup: async (groupId: string, userId: string) => {
    const member = get().groupMembers.find(
      (m) => m.group_id === groupId && m.user_id === userId
    );
    if (!member) return;

    await db.dbRemoveGroupMember(member.id);
    set((state) => ({
      groupMembers: state.groupMembers.filter((m) => m.id !== member.id),
    }));
  },

  getGroupMembers: (groupId: string) => {
    const memberIds = get()
      .groupMembers.filter((m) => m.group_id === groupId)
      .map((m) => m.user_id);
    return get().users.filter((u) => memberIds.includes(u.id));
  },

  // Transaction actions
  addTransaction: async (data: TransactionFormData) => {
    const now = new Date().toISOString();
    const transaction: Transaction = {
      id: uuidv4(),
      description: data.description,
      amount: data.amount,
      paid_by: data.paidBy,
      group_id: data.groupId,
      split_type: data.splitType,
      date: data.date,
      created_at: now,
      updated_at: now,
    };

    await db.dbAddTransaction(transaction);

    // Calculate splits based on split type
    const splits: TransactionSplit[] = [];
    const participantCount = data.participants.length;

    for (let i = 0; i < data.participants.length; i++) {
      const userId = data.participants[i];
      let amount = 0;
      let percentage: number | undefined;
      let shares: number | undefined;

      switch (data.splitType) {
        case 'equal':
          amount = data.amount / participantCount;
          break;
        case 'exact':
          amount = data.splits[i]?.amount || 0;
          break;
        case 'percentage':
          percentage = data.splits[i]?.percentage || 0;
          amount = (data.amount * percentage) / 100;
          break;
        case 'shares':
          const totalShares = data.splits.reduce((sum, s) => sum + (s.shares || 0), 0);
          shares = data.splits[i]?.shares || 0;
          amount = totalShares > 0 ? (data.amount * shares) / totalShares : 0;
          break;
      }

      const split: TransactionSplit = {
        id: uuidv4(),
        transaction_id: transaction.id,
        user_id: userId,
        amount: Math.round(amount * 100) / 100,
        percentage,
        shares,
        is_settled: userId === data.paidBy,
        settled_at: userId === data.paidBy ? now : undefined,
      };

      await db.dbAddTransactionSplit(split);
      splits.push(split);
    }

    set((state) => ({
      transactions: [...state.transactions, transaction],
      transactionSplits: [...state.transactionSplits, ...splits],
    }));

    return transaction;
  },

  deleteTransaction: async (id: string) => {
    const splits = get().transactionSplits.filter((s) => s.transaction_id === id);
    for (const split of splits) {
      await db.dbDeleteTransactionSplit(split.id);
    }
    await db.dbDeleteTransaction(id);

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
      transactionSplits: state.transactionSplits.filter((s) => s.transaction_id !== id),
    }));
  },

  getTransaction: (id: string) => {
    return get().transactions.find((t) => t.id === id);
  },

  getTransactionSplits: (transactionId: string) => {
    return get().transactionSplits.filter((s) => s.transaction_id === transactionId);
  },

  // Settlement actions
  settleUp: async (fromUserId: string, toUserId: string, amount: number, groupId?: string, note?: string) => {
    const now = new Date().toISOString();
    const settlement: Settlement = {
      id: uuidv4(),
      from_user_id: fromUserId,
      to_user_id: toUserId,
      amount,
      group_id: groupId,
      note,
      date: now,
      created_at: now,
    };

    await db.dbAddSettlement(settlement);

    // Mark relevant splits as settled
    const unsettledSplits = get().transactionSplits.filter((split) => {
      if (split.is_settled) return false;
      if (split.user_id !== fromUserId) return false;

      const transaction = get().transactions.find((t) => t.id === split.transaction_id);
      if (!transaction) return false;
      if (transaction.paid_by !== toUserId) return false;
      if (groupId && transaction.group_id !== groupId) return false;

      return true;
    });

    let remainingAmount = amount;
    const updatedSplits: TransactionSplit[] = [];

    for (const split of unsettledSplits) {
      if (remainingAmount <= 0) break;

      if (split.amount <= remainingAmount) {
        const updatedSplit = { ...split, is_settled: true, settled_at: now };
        await db.dbUpdateTransactionSplit(updatedSplit);
        updatedSplits.push(updatedSplit);
        remainingAmount -= split.amount;
      }
    }

    set((state) => ({
      settlements: [...state.settlements, settlement],
      transactionSplits: state.transactionSplits.map((s) => {
        const updated = updatedSplits.find((u) => u.id === s.id);
        return updated || s;
      }),
    }));
  },

  // Balance calculations
  getUserBalance: (userId: string) => {
    const user = get().getUser(userId);
    const splits = get().transactionSplits;
    const transactions = get().transactions;

    let totalOwed = 0; // Amount others owe this user
    let totalOwing = 0; // Amount this user owes others

    // Calculate from transactions where this user paid
    const paidTransactions = transactions.filter((t) => t.paid_by === userId);
    for (const transaction of paidTransactions) {
      const txSplits = splits.filter(
        (s) => s.transaction_id === transaction.id && s.user_id !== userId && !s.is_settled
      );
      totalOwed += txSplits.reduce((sum, s) => sum + s.amount, 0);
    }

    // Calculate from transactions where this user owes
    const owingSplits = splits.filter(
      (s) => s.user_id === userId && !s.is_settled
    );
    for (const split of owingSplits) {
      const transaction = transactions.find((t) => t.id === split.transaction_id);
      if (transaction && transaction.paid_by !== userId) {
        totalOwing += split.amount;
      }
    }

    return {
      userId,
      userName: user?.name || 'Unknown',
      totalOwed: Math.round(totalOwed * 100) / 100,
      totalOwing: Math.round(totalOwing * 100) / 100,
      netBalance: Math.round((totalOwed - totalOwing) * 100) / 100,
    };
  },

  getGroupBalance: (groupId: string) => {
    const group = get().getGroup(groupId);
    const groupTransactions = get().transactions.filter((t) => t.group_id === groupId);
    const splits = get().transactionSplits;
    const users = get().users;

    const balanceMap = new Map<string, number>();

    for (const transaction of groupTransactions) {
      const txSplits = splits.filter((s) => s.transaction_id === transaction.id);

      for (const split of txSplits) {
        if (split.is_settled) continue;

        if (split.user_id === transaction.paid_by) continue;

        // The payer is owed money
        const payerBalance = balanceMap.get(transaction.paid_by) || 0;
        balanceMap.set(transaction.paid_by, payerBalance + split.amount);

        // The split user owes money
        const userBalance = balanceMap.get(split.user_id) || 0;
        balanceMap.set(split.user_id, userBalance - split.amount);
      }
    }

    const balances = Array.from(balanceMap.entries()).map(([userId, amount]) => ({
      userId,
      userName: users.find((u) => u.id === userId)?.name || 'Unknown',
      amount: Math.round(amount * 100) / 100,
    }));

    const totalOwed = balances.filter((b) => b.amount > 0).reduce((sum, b) => sum + b.amount, 0);
    const totalOwing = balances.filter((b) => b.amount < 0).reduce((sum, b) => sum + Math.abs(b.amount), 0);

    return {
      groupId,
      groupName: group?.name || 'Unknown',
      totalOwed: Math.round(totalOwed * 100) / 100,
      totalOwing: Math.round(totalOwing * 100) / 100,
      balances,
    };
  },

  getAllBalances: () => {
    return get().users.map((user) => get().getUserBalance(user.id));
  },

  getUnsettledAmountWithUser: (userId: string) => {
    const balance = get().getUserBalance(userId);
    return Math.abs(balance.netBalance);
  },

  getUnsettledAmountWithGroup: (groupId: string) => {
    const balance = get().getGroupBalance(groupId);
    return Math.max(balance.totalOwed, balance.totalOwing);
  },
}));
