export enum TransactionType {
  DEBT = 'DEBT',
  REPAYMENT = 'REPAYMENT'
}

export enum Payer {
  ME = 'ME', // 筠
  FRIEND = 'FRIEND' // 古
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  item: string;
  amount: number;
  payer: Payer;
  type: TransactionType;
  createdAt: number;
  isSettled: boolean;
  settledAt?: string; // Format: YYYY-MM-DD HH:mm
}

export interface BalanceState {
  netAmount: number; // Positive = 古 owes 筠, Negative = 筠 owes 古
  status: 'OWED' | 'OWING' | 'SETTLED';
}

export interface SmartParseResult {
  item: string;
  amount: number;
  date: string;
  payer: Payer;
  type: TransactionType;
}