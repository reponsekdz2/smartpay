import { User, Transaction, Loan, InsurancePolicy, MerchantData, TransactionType, Wallet } from '../types';

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

  const initialWallets: Wallet[] = [
    { id: 'wallet_main', name: "Main Account", balance: 85430, type: 'primary', accountNumber: `2500${phone.substring(1)}` },
    { id: 'wallet_savings', name: "Savings", balance: 25000, type: 'savings', goal: 100000, progress: 25 },
    { id: 'wallet_investment', name: "Investment", balance: 15000, type: 'investment', returnValue: 1200 },
    { id: 'wallet_emergency', name: "Emergency Fund", balance: 10000, type: 'emergency' }
  ];

  const newUser: User = {
    id: userId,
    phone,
    pin,
    name,
    nationalId,
    securityScore: 85,
    isCardFrozen: false,
    loginHistory: [new Date()],
    has2FA: false,
    spendingLimits: { daily: 500000, monthly: 2000000 },
    
    // Profile
    avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`,
    coverPhoto: `https://picsum.photos/seed/${userId}/400/200`,
    verified: true,
    status: 'online',
    bio: 'Digital finance enthusiast | Exploring the future of money in Rwanda.',
    friendsCount: 124,
    transactionCount: 47,
    trustScore: 92,
    email: `${name.split(' ').join('.').toLowerCase()}@example.com`,
    address: 'Kigali, Rwanda',
    creditScore: 720,
    verifications: [
        { name: 'National ID', verified: true },
        { name: 'Phone Number', verified: true },
        { name: 'Email Address', verified: false },
    ],
    riskLevel: 'low',

    // Preferences
    notifications: true,
    biometricLogin: true,
    darkMode: false,
    language: 'English',

    // Wallets
    wallets: initialWallets,
  };
  setToStorage(userId, newUser);
  setToStorage('currentUser', newUser);
  localStorage.setItem('hasAccount', 'true');
  
  // Initialize other data
  const initialTransactions: Transaction[] = [
    { id: 'tx_init_1', date: new Date(Date.now() - 86400000), amount: 300000, type: TransactionType.INCOME, description: 'Salary from Company XYZ', status: 'Successful', category: 'Salary', recurring: true },
    { id: 'tx_init_2', date: new Date(Date.now() - 3600000), amount: 15000, type: TransactionType.EXPENSE, description: 'Simba Supermarket', status: 'Successful', category: 'Shopping', receiptAvailable: true },
  ];
  setToStorage(`transactions_${userId}`, initialTransactions);
  setToStorage(`loans_${userId}`, []);
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