import { User, Transaction, Loan, SavingsGoal, InsurancePolicy, MerchantData, TransactionType, InsuranceType } from '../types';

// Helper to get/set data from localStorage
const getFromStorage = <T,>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const setToStorage = <T,>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- USER MANAGEMENT ---
export const createUser = async (phone: string, pin: string, name: string, nationalId: string): Promise<User> => {
  const userId = `user_${phone}`;
  const newUser: User = {
    id: userId,
    phone,
    pin,
    name,
    nationalId,
    balance: 25000,
    accountNumber: `2500${phone.substring(1)}`,
    securityScore: 85,
    activePolicies: 0,
    isCardFrozen: false,
    loginHistory: [new Date()],
    has2FA: false,
    spendingLimits: { daily: 500000, monthly: 2000000 },
    level: 1,
    xp: 0,
    achievements: [],
  };
  setToStorage(userId, newUser);
  setToStorage('currentUser', newUser);
  localStorage.setItem('hasAccount', 'true');
  
  // Initialize other data
  setToStorage(`transactions_${userId}`, []);
  setToStorage(`loans_${userId}`, []);
  const initialSavings: SavingsGoal = { id: `savings_${userId}`, name: "Rainy Day Fund", goalAmount: 100000, currentAmount: 15000, interestEarned: 150 };
  setToStorage(`savings_${userId}`, initialSavings);
  setToStorage(`policies_${userId}`, []);
  const initialMerchantData: MerchantData = { todaysSales: 45000, transactionCount: 12, pendingPayout: 40000, customerCount: 8 };
  setToStorage(`merchant_${userId}`, initialMerchantData);

  return newUser;
};

export const login = async (phone: string, pin: string): Promise<User | null> => {
  const user = getFromStorage<User>(`user_${phone}`);
  if (user && user.pin === pin) {
    user.loginHistory.push(new Date());
    setToStorage(`user_${phone}`, user);
    setToStorage('currentUser', user);
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = async (): Promise<User | null> => {
  return getFromStorage<User>('currentUser');
};

export const getUserById = async (userId: string): Promise<User | null> => {
  return getFromStorage<User>(userId);
}

export const updateUser = async (user: User): Promise<void> => {
    setToStorage(user.id, user);
    const currentUser = await getCurrentUser();
    if(currentUser && currentUser.id === user.id) {
        setToStorage('currentUser', user);
    }
}

// --- TRANSACTIONS ---
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const txs = getFromStorage<Transaction[]>(`transactions_${userId}`) || [];
  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addTransaction = async (userId: string, txData: Omit<Transaction, 'id' | 'date' | 'status'>): Promise<void> => {
  const transactions = await getTransactions(userId);
  const newTransaction: Transaction = {
    ...txData,
    id: `tx_${new Date().getTime()}`,
    date: new Date(),
    status: 'Successful',
  };
  transactions.push(newTransaction);
  setToStorage(`transactions_${userId}`, transactions);
};

// --- LOANS ---
export const getLoans = async (userId: string): Promise<Loan[]> => {
  return getFromStorage<Loan[]>(`loans_${userId}`) || [];
};

export const createLoan = async (userId: string, amount: number, duration: number): Promise<void> => {
  const loans = await getLoans(userId);
  const interest = amount * 0.03;
  const newLoan: Loan = {
    id: `loan_${new Date().getTime()}`,
    amount,
    interest,
    duration,
    totalRepayment: amount + interest,
    startDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + duration)),
    isRepaid: false,
  };
  loans.push(newLoan);
  setToStorage(`loans_${userId}`, loans);
  await addTransaction(userId, { amount, type: TransactionType.LOAN_DISBURSEMENT, description: "Loan Disbursement" });
};

// --- SAVINGS ---
export const getSavingsGoal = async (userId: string): Promise<SavingsGoal | null> => {
  return getFromStorage<SavingsGoal>(`savings_${userId}`);
};

export const updateSavings = async (userId: string, amount: number): Promise<void> => {
  const savings = await getSavingsGoal(userId);
  if (savings) {
    savings.currentAmount += amount;
    savings.interestEarned = savings.currentAmount * 0.01; // Recalculate interest
    setToStorage(`savings_${userId}`, savings);
    await addTransaction(userId, { amount, type: TransactionType.SAVINGS_DEPOSIT, description: "Deposit to Savings" });
  }
};

// --- INSURANCE ---
export const getInsurancePolicies = async (userId: string): Promise<InsurancePolicy[]> => {
  return getFromStorage<InsurancePolicy[]>(`policies_${userId}`) || [];
};

export const addInsurancePolicy = async (userId: string, policyData: Omit<InsurancePolicy, 'id' | 'startDate' | 'endDate' | 'policyNumber'>): Promise<void> => {
  const policies = await getInsurancePolicies(userId);
  const newPolicy: InsurancePolicy = {
    ...policyData,
    id: `policy_${new Date().getTime()}`,
    policyNumber: `SPRP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  };
  policies.push(newPolicy);
  setToStorage(`policies_${userId}`, policies);
  await addTransaction(userId, { amount: policyData.premium, type: TransactionType.INSURANCE_PREMIUM, description: `${policyData.type} Premium` });
};

// --- MERCHANT ---
export const getMerchantData = async (userId: string): Promise<MerchantData | null> => {
    return getFromStorage<MerchantData>(`merchant_${userId}`);
}