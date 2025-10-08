export interface Wallet {
  id: string;
  name: string;
  balance: number;
  type: 'primary' | 'savings' | 'investment' | 'emergency';
  accountNumber?: string;
  goal?: number;
  progress?: number;
  returnValue?: number;
  gradient?: string;
}

export interface User {
  id: string;
  phone: string;
  pin: string;
  name: string;
  nationalId: string;
  securityScore: number;
  isCardFrozen: boolean;
  loginHistory: Date[];
  has2FA: boolean;
  spendingLimits: {
    daily: number;
    monthly: number;
  };
  
  // Profile Fields
  avatar: string;
  coverPhoto: string;
  verified: boolean;
  status: 'online' | 'offline';
  bio: string;
  friendsCount: number;
  transactionCount: number;
  trustScore: number;
  email: string;
  address: string;
  creditScore: number;
  verifications: { name: string, verified: boolean }[];
  riskLevel: 'low' | 'medium' | 'high';
  
  // Preferences
  notifications: boolean;
  biometricLogin: boolean;
  darkMode: boolean;
  language: 'English' | 'Kinyarwanda';
  
  // Wallets - Balance is now managed here
  wallets: Wallet[];
}

export enum TransactionType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  BILL_PAYMENT = 'BILL_PAYMENT',
  AIRTIME = 'AIRTIME',
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  INSURANCE_PREMIUM = 'INSURANCE_PREMIUM',
  SAVINGS_DEPOSIT = 'SAVINGS_DEPOSIT',
  MERCHANT_PAYMENT = 'MERCHANT_PAYMENT',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  description: string;
  status: 'Successful' | 'Pending' | 'Failed';
  recipient?: string;
  sender?: string;
  // FIX: This comparison appears to be unintentional because the types '"Shopping" | "Salary" | "Transportation" | "Bills & Utilities" | "Entertainment" | "Other"' and '"Food & Dining"' have no overlap.
  category?: 'Shopping' | 'Salary' | 'Transportation' | 'Bills & Utilities' | 'Entertainment' | 'Other' | 'Food & Dining';
  receiptAvailable?: boolean;
  recurring?: boolean;
}

export interface Loan {
  id: string;
  amount: number;
  interest: number;
  duration: number; // in days
  totalRepayment: number;
  startDate: Date;
  dueDate: Date;
  isRepaid: boolean;
}

export enum InsuranceType {
    VEHICLE = 'Vehicle Insurance',
    PROPERTY = 'Property Insurance',
    ACCOUNT = 'Account Protection',
    HEALTH = 'Health Insurance'
}

export interface InsurancePolicy {
  id: string;
  type: InsuranceType;
  premium: number;
  coverage: string;
  startDate: Date;
  endDate: Date;
  policyNumber: string;
  details: Record<string, string>;
}

export interface MerchantData {
    todaysSales: number;
    transactionCount: number;
    pendingPayout: number;
    customerCount: number;
}

export type Screen =
  | 'ONBOARDING'
  | 'LOGIN'
  | 'WALLET'
  | 'PROFILE'
  | 'SOCIAL'
  | 'ASSISTANT'
  | 'TRANSFER'
  | 'BILLS'
  | 'QR'
  | 'BORROW'
  | 'SAVINGS'
  | 'INSURANCE'
  | 'SECURITY'
  | 'BUSINESS'
  | 'HISTORY'
  | 'ANALYTICS'
  | 'SUPPORT';
  
export type AppContextType = 'morning' | 'work' | 'evening' | 'weekend';