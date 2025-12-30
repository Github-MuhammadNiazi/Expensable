import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { User, Group, GroupMember, Transaction, TransactionSplit, Settlement } from '@/types';

interface ExpensableDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-name': string };
  };
  groups: {
    key: string;
    value: Group;
    indexes: { 'by-name': string };
  };
  group_members: {
    key: string;
    value: GroupMember;
    indexes: { 'by-group': string; 'by-user': string };
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-group': string; 'by-paid-by': string; 'by-date': string };
  };
  transaction_splits: {
    key: string;
    value: TransactionSplit;
    indexes: { 'by-transaction': string; 'by-user': string };
  };
  settlements: {
    key: string;
    value: Settlement;
    indexes: { 'by-from-user': string; 'by-to-user': string; 'by-group': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ExpensableDB>> | null = null;

export const getDB = async () => {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    dbPromise = openDB<ExpensableDB>('expensable-db', 1, {
      upgrade(db) {
        // Users store
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-name', 'name');

        // Groups store
        const groupStore = db.createObjectStore('groups', { keyPath: 'id' });
        groupStore.createIndex('by-name', 'name');

        // Group members store
        const groupMemberStore = db.createObjectStore('group_members', { keyPath: 'id' });
        groupMemberStore.createIndex('by-group', 'group_id');
        groupMemberStore.createIndex('by-user', 'user_id');

        // Transactions store
        const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
        transactionStore.createIndex('by-group', 'group_id');
        transactionStore.createIndex('by-paid-by', 'paid_by');
        transactionStore.createIndex('by-date', 'date');

        // Transaction splits store
        const splitStore = db.createObjectStore('transaction_splits', { keyPath: 'id' });
        splitStore.createIndex('by-transaction', 'transaction_id');
        splitStore.createIndex('by-user', 'user_id');

        // Settlements store
        const settlementStore = db.createObjectStore('settlements', { keyPath: 'id' });
        settlementStore.createIndex('by-from-user', 'from_user_id');
        settlementStore.createIndex('by-to-user', 'to_user_id');
        settlementStore.createIndex('by-group', 'group_id');
      },
    });
  }
  return dbPromise;
};

// User operations
export const dbGetAllUsers = async (): Promise<User[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('users');
};

export const dbGetUser = async (id: string): Promise<User | undefined> => {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('users', id);
};

export const dbAddUser = async (user: User): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('users', user);
};

export const dbDeleteUser = async (id: string): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.delete('users', id);
};

// Group operations
export const dbGetAllGroups = async (): Promise<Group[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('groups');
};

export const dbGetGroup = async (id: string): Promise<Group | undefined> => {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('groups', id);
};

export const dbAddGroup = async (group: Group): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('groups', group);
};

export const dbDeleteGroup = async (id: string): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.delete('groups', id);
};

// Group member operations
export const dbGetGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('group_members', 'by-group', groupId);
};

export const dbAddGroupMember = async (member: GroupMember): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('group_members', member);
};

export const dbRemoveGroupMember = async (id: string): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.delete('group_members', id);
};

export const dbGetUserGroups = async (userId: string): Promise<GroupMember[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('group_members', 'by-user', userId);
};

// Transaction operations
export const dbGetAllTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('transactions');
};

export const dbGetTransaction = async (id: string): Promise<Transaction | undefined> => {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('transactions', id);
};

export const dbAddTransaction = async (transaction: Transaction): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('transactions', transaction);
};

export const dbDeleteTransaction = async (id: string): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.delete('transactions', id);
};

export const dbGetGroupTransactions = async (groupId: string): Promise<Transaction[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('transactions', 'by-group', groupId);
};

// Transaction split operations
export const dbGetAllTransactionSplits = async (): Promise<TransactionSplit[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('transaction_splits');
};

export const dbGetTransactionSplits = async (transactionId: string): Promise<TransactionSplit[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('transaction_splits', 'by-transaction', transactionId);
};

export const dbAddTransactionSplit = async (split: TransactionSplit): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('transaction_splits', split);
};

export const dbDeleteTransactionSplit = async (id: string): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.delete('transaction_splits', id);
};

export const dbGetUserSplits = async (userId: string): Promise<TransactionSplit[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('transaction_splits', 'by-user', userId);
};

export const dbUpdateTransactionSplit = async (split: TransactionSplit): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('transaction_splits', split);
};

// Settlement operations
export const dbGetAllSettlements = async (): Promise<Settlement[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('settlements');
};

export const dbAddSettlement = async (settlement: Settlement): Promise<void> => {
  const db = await getDB();
  if (!db) return;
  await db.put('settlements', settlement);
};

export const dbGetUserSettlements = async (userId: string): Promise<Settlement[]> => {
  const db = await getDB();
  if (!db) return [];
  const fromUser = await db.getAllFromIndex('settlements', 'by-from-user', userId);
  const toUser = await db.getAllFromIndex('settlements', 'by-to-user', userId);
  return [...fromUser, ...toUser];
};

export const dbGetGroupSettlements = async (groupId: string): Promise<Settlement[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('settlements', 'by-group', groupId);
};
