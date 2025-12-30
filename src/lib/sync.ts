'use client';

import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import * as db from './db';
import { User, Group, GroupMember, Transaction, TransactionSplit, Settlement } from '@/types';

// Offline queue types
interface QueuedOperation {
  id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  recordId: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'expensable_sync_queue';
const LAST_SYNC_KEY = 'expensable_last_sync';

// Queue management
function getQueue(): QueuedOperation[] {
  if (typeof window === 'undefined') return [];
  const queue = localStorage.getItem(SYNC_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

function saveQueue(queue: QueuedOperation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

function addToQueue(operation: Omit<QueuedOperation, 'id' | 'timestamp'>): void {
  const queue = getQueue();
  queue.push({
    ...operation,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  saveQueue(queue);
}

function removeFromQueue(id: string): void {
  const queue = getQueue().filter(op => op.id !== id);
  saveQueue(queue);
}

function getLastSync(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_SYNC_KEY);
}

function setLastSync(timestamp: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_SYNC_KEY, timestamp);
}

// Check if online
export function isOnline(): boolean {
  if (typeof window === 'undefined') return false;
  return navigator.onLine;
}

// Sync status
export interface SyncStatus {
  isOnline: boolean;
  isConfigured: boolean;
  pendingOperations: number;
  lastSync: string | null;
  isSyncing: boolean;
}

let isSyncing = false;

export function getSyncStatus(): SyncStatus {
  return {
    isOnline: isOnline(),
    isConfigured: isSupabaseConfigured(),
    pendingOperations: getQueue().length,
    lastSync: getLastSync(),
    isSyncing,
  };
}

// Table-specific sync functions
async function syncUsers(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;

  if (data) {
    for (const user of data) {
      await db.dbAddUser({
        id: user.id,
        name: user.name,
        email: user.email || undefined,
        avatar: user.avatar || undefined,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    }
  }
}

async function syncGroups(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase.from('groups').select('*');
  if (error) throw error;

  if (data) {
    for (const group of data) {
      await db.dbAddGroup({
        id: group.id,
        name: group.name,
        description: group.description || undefined,
        created_at: group.created_at,
        updated_at: group.updated_at,
      });
    }
  }
}

async function syncGroupMembers(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase.from('group_members').select('*');
  if (error) throw error;

  if (data) {
    for (const member of data) {
      await db.dbAddGroupMember({
        id: member.id,
        group_id: member.group_id,
        user_id: member.user_id,
        created_at: member.created_at,
      });
    }
  }
}

async function syncTransactions(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase.from('transactions').select('*');
  if (error) throw error;

  if (data) {
    for (const tx of data) {
      await db.dbAddTransaction({
        id: tx.id,
        description: tx.description,
        amount: parseFloat(tx.amount),
        paid_by: tx.paid_by,
        group_id: tx.group_id || undefined,
        split_type: tx.split_type,
        date: tx.date,
        created_at: tx.created_at,
        updated_at: tx.updated_at,
      });
    }
  }
}

async function syncTransactionSplits(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase.from('transaction_splits').select('*');
  if (error) throw error;

  if (data) {
    for (const split of data) {
      await db.dbAddTransactionSplit({
        id: split.id,
        transaction_id: split.transaction_id,
        user_id: split.user_id,
        amount: parseFloat(split.amount),
        percentage: split.percentage ? parseFloat(split.percentage) : undefined,
        shares: split.shares || undefined,
        is_settled: split.is_settled,
        settled_at: split.settled_at || undefined,
      });
    }
  }
}

async function syncSettlements(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data, error } = await supabase.from('settlements').select('*');
  if (error) throw error;

  if (data) {
    for (const settlement of data) {
      await db.dbAddSettlement({
        id: settlement.id,
        from_user_id: settlement.from_user_id,
        to_user_id: settlement.to_user_id,
        amount: parseFloat(settlement.amount),
        group_id: settlement.group_id || undefined,
        note: settlement.note || undefined,
        date: settlement.date,
        created_at: settlement.created_at,
      });
    }
  }
}

// Process queued operations
async function processQueue(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const queue = getQueue();

  for (const op of queue) {
    try {
      switch (op.operation) {
        case 'INSERT':
        case 'UPDATE':
          if (op.data) {
            const { error } = await supabase.from(op.table).upsert(op.data);
            if (error) throw error;
          }
          break;
        case 'DELETE':
          const { error } = await supabase.from(op.table).delete().eq('id', op.recordId);
          if (error) throw error;
          break;
      }
      removeFromQueue(op.id);
    } catch (error) {
      console.error(`Failed to process queue item ${op.id}:`, error);
      // Keep in queue for retry
    }
  }
}

// Full sync from Supabase to local
export async function pullFromCloud(): Promise<void> {
  if (!isSupabaseConfigured() || !isOnline()) return;

  isSyncing = true;
  try {
    await syncUsers();
    await syncGroups();
    await syncGroupMembers();
    await syncTransactions();
    await syncTransactionSplits();
    await syncSettlements();
    setLastSync(new Date().toISOString());
  } finally {
    isSyncing = false;
  }
}

// Push local changes to Supabase
export async function pushToCloud(): Promise<void> {
  if (!isSupabaseConfigured() || !isOnline()) return;

  isSyncing = true;
  try {
    await processQueue();
    setLastSync(new Date().toISOString());
  } finally {
    isSyncing = false;
  }
}

// Full sync (push then pull)
export async function syncAll(): Promise<void> {
  if (!isSupabaseConfigured() || !isOnline()) return;

  isSyncing = true;
  try {
    await processQueue();
    await pullFromCloud();
  } finally {
    isSyncing = false;
  }
}

// Queue operations for each entity type
export function queueUserOperation(operation: 'INSERT' | 'UPDATE' | 'DELETE', user: User): void {
  addToQueue({
    operation,
    table: 'users',
    recordId: user.id,
    data: operation !== 'DELETE' ? {
      id: user.id,
      name: user.name,
      email: user.email || null,
      avatar: user.avatar || null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } : undefined,
  });
}

export function queueGroupOperation(operation: 'INSERT' | 'UPDATE' | 'DELETE', group: Group): void {
  addToQueue({
    operation,
    table: 'groups',
    recordId: group.id,
    data: operation !== 'DELETE' ? {
      id: group.id,
      name: group.name,
      description: group.description || null,
      created_at: group.created_at,
      updated_at: group.updated_at,
    } : undefined,
  });
}

export function queueGroupMemberOperation(operation: 'INSERT' | 'DELETE', member: GroupMember): void {
  addToQueue({
    operation,
    table: 'group_members',
    recordId: member.id,
    data: operation !== 'DELETE' ? {
      id: member.id,
      group_id: member.group_id,
      user_id: member.user_id,
      created_at: member.created_at,
    } : undefined,
  });
}

export function queueTransactionOperation(operation: 'INSERT' | 'UPDATE' | 'DELETE', transaction: Transaction): void {
  addToQueue({
    operation,
    table: 'transactions',
    recordId: transaction.id,
    data: operation !== 'DELETE' ? {
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      paid_by: transaction.paid_by,
      group_id: transaction.group_id || null,
      split_type: transaction.split_type,
      date: transaction.date,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    } : undefined,
  });
}

export function queueTransactionSplitOperation(operation: 'INSERT' | 'UPDATE' | 'DELETE', split: TransactionSplit): void {
  addToQueue({
    operation,
    table: 'transaction_splits',
    recordId: split.id,
    data: operation !== 'DELETE' ? {
      id: split.id,
      transaction_id: split.transaction_id,
      user_id: split.user_id,
      amount: split.amount,
      percentage: split.percentage || null,
      shares: split.shares || null,
      is_settled: split.is_settled,
      settled_at: split.settled_at || null,
    } : undefined,
  });
}

export function queueSettlementOperation(operation: 'INSERT', settlement: Settlement): void {
  addToQueue({
    operation,
    table: 'settlements',
    recordId: settlement.id,
    data: {
      id: settlement.id,
      from_user_id: settlement.from_user_id,
      to_user_id: settlement.to_user_id,
      amount: settlement.amount,
      group_id: settlement.group_id || null,
      note: settlement.note || null,
      date: settlement.date,
      created_at: settlement.created_at,
    },
  });
}

// Immediate sync (for when online)
export async function syncUserImmediate(operation: 'INSERT' | 'UPDATE' | 'DELETE', user: User): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !isOnline()) {
    queueUserOperation(operation, user);
    return false;
  }

  try {
    if (operation === 'DELETE') {
      const { error } = await supabase.from('users').delete().eq('id', user.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        name: user.name,
        email: user.email || null,
        avatar: user.avatar || null,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Failed to sync user:', error);
    queueUserOperation(operation, user);
    return false;
  }
}

export async function syncGroupImmediate(operation: 'INSERT' | 'UPDATE' | 'DELETE', group: Group): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !isOnline()) {
    queueGroupOperation(operation, group);
    return false;
  }

  try {
    if (operation === 'DELETE') {
      const { error } = await supabase.from('groups').delete().eq('id', group.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('groups').upsert({
        id: group.id,
        name: group.name,
        description: group.description || null,
        created_at: group.created_at,
        updated_at: group.updated_at,
      });
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Failed to sync group:', error);
    queueGroupOperation(operation, group);
    return false;
  }
}

export async function syncGroupMemberImmediate(operation: 'INSERT' | 'DELETE', member: GroupMember): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !isOnline()) {
    queueGroupMemberOperation(operation, member);
    return false;
  }

  try {
    if (operation === 'DELETE') {
      const { error } = await supabase.from('group_members').delete().eq('id', member.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('group_members').upsert({
        id: member.id,
        group_id: member.group_id,
        user_id: member.user_id,
        created_at: member.created_at,
      });
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Failed to sync group member:', error);
    queueGroupMemberOperation(operation, member);
    return false;
  }
}

export async function syncTransactionImmediate(operation: 'INSERT' | 'UPDATE' | 'DELETE', transaction: Transaction): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !isOnline()) {
    queueTransactionOperation(operation, transaction);
    return false;
  }

  try {
    if (operation === 'DELETE') {
      const { error } = await supabase.from('transactions').delete().eq('id', transaction.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('transactions').upsert({
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        paid_by: transaction.paid_by,
        group_id: transaction.group_id || null,
        split_type: transaction.split_type,
        date: transaction.date,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
      });
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Failed to sync transaction:', error);
    queueTransactionOperation(operation, transaction);
    return false;
  }
}

export async function syncTransactionSplitImmediate(operation: 'INSERT' | 'UPDATE' | 'DELETE', split: TransactionSplit): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !isOnline()) {
    queueTransactionSplitOperation(operation, split);
    return false;
  }

  try {
    if (operation === 'DELETE') {
      const { error } = await supabase.from('transaction_splits').delete().eq('id', split.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('transaction_splits').upsert({
        id: split.id,
        transaction_id: split.transaction_id,
        user_id: split.user_id,
        amount: split.amount,
        percentage: split.percentage || null,
        shares: split.shares || null,
        is_settled: split.is_settled,
        settled_at: split.settled_at || null,
      });
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Failed to sync transaction split:', error);
    queueTransactionSplitOperation(operation, split);
    return false;
  }
}

export async function syncSettlementImmediate(settlement: Settlement): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !isOnline()) {
    queueSettlementOperation('INSERT', settlement);
    return false;
  }

  try {
    const { error } = await supabase.from('settlements').upsert({
      id: settlement.id,
      from_user_id: settlement.from_user_id,
      to_user_id: settlement.to_user_id,
      amount: settlement.amount,
      group_id: settlement.group_id || null,
      note: settlement.note || null,
      date: settlement.date,
      created_at: settlement.created_at,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to sync settlement:', error);
    queueSettlementOperation('INSERT', settlement);
    return false;
  }
}
