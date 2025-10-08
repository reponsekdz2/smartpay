export interface User {
  id: string;
  phone: string;
  pin: string;
  name: string;
  nationalId: string;
  balance: number;
  accountNumber: string;
  securityScore: number;
  activePolicies: number;
  isCardFrozen: boolean;
  loginHistory: Date[];
  has2FA: boolean;
  spendingLimits: {
    daily: number;
    monthly: number;
  };
  level: number;
  xp: number;
  achievements: string[];
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
  category?: 'Food & Dining' | 'Transportation' | 'Bills & Utilities' | 'Entertainment' | 'Other';
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

export interface SavingsGoal {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  interestEarned: number;
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
  | 'DASHBOARD'
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