export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AppSettings {
  defaultCurrency: string;
  adminUserId: string | null;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  paid_by: string;
  group_id?: string;
  split_type: SplitType;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionSplit {
  id: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  percentage?: number;
  shares?: number;
  is_settled: boolean;
  settled_at?: string;
}

export interface Settlement {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  group_id?: string;
  note?: string;
  date: string;
  created_at: string;
}

export type SplitType = 'equal' | 'exact' | 'percentage' | 'shares';

export interface Balance {
  userId: string;
  userName: string;
  amount: number;
}

export interface GroupBalance {
  groupId: string;
  groupName: string;
  totalOwed: number;
  totalOwing: number;
  balances: Balance[];
}

export interface UserBalance {
  userId: string;
  userName: string;
  totalOwed: number;
  totalOwing: number;
  netBalance: number;
}

export interface SplitDetail {
  userId: string;
  amount?: number;
  percentage?: number;
  shares?: number;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  paidBy: string;
  groupId?: string;
  splitType: SplitType;
  participants: string[];
  splits: SplitDetail[];
  date: string;
}
