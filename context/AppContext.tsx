import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Transaction, Loan, InsurancePolicy, MerchantData, Screen, Wallet, TransactionType } from '../types';
import * as api from '../services/mockApi';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  loans: Loan[];
  policies: InsurancePolicy[];
  merchantData: MerchantData | null;
  screen: Screen;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => void;
  createUser: (phone: string, pin: string, name: string, nationalId: string) => Promise<User | null>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => Promise<void>;
  applyForLoan: (amount: number, duration: number) => Promise<void>;
  purchaseInsurance: (policy: Omit<InsurancePolicy, 'id' | 'startDate' | 'endDate' | 'policyNumber'>) => Promise<void>;
  setScreen: (screen: Screen) => void;
  updateSecurity: (updates: Partial<Pick<User, 'isCardFrozen' | 'pin' | 'has2FA'>>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [screen, setScreen] = useState<Screen>('LOGIN');

  const loadData = useCallback(async (currentUser: User) => {
    setTransactions(await api.getTransactions(currentUser.id));
    setLoans(await api.getLoans(currentUser.id));
    setPolicies(await api.getInsurancePolicies(currentUser.id));
    setMerchantData(await api.getMerchantData(currentUser.id));
    // User object with wallets is already loaded at login
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedInUser = await api.getCurrentUser();
      if (loggedInUser) {
        setUser(loggedInUser);
        setScreen('SOCIAL');
        await loadData(loggedInUser);
      } else {
        const hasCreatedAccount = localStorage.getItem('hasAccount');
        setScreen(hasCreatedAccount ? 'LOGIN' : 'ONBOARDING');
      }
    };
    checkLoggedIn();
  }, [loadData]);

  const login = async (phone: string, pin: string): Promise<boolean> => {
    const loggedInUser = await api.login(phone, pin);
    if (loggedInUser) {
      setUser(loggedInUser);
      setScreen('SOCIAL');
      await loadData(loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setScreen('LOGIN');
  };

  const createUser = async (phone: string, pin: string, name: string, nationalId: string): Promise<User | null> => {
    const newUser = await api.createUser(phone, pin, name, nationalId);
    if(newUser) {
      setUser(newUser);
      setScreen('SOCIAL');
      await loadData(newUser);
    }
    return newUser;
  };

  // FIX: Reworked transaction logic to handle savings deposits correctly and be more robust.
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    if (!user) return;
    
    const primaryWallet = user.wallets.find(w => w.type === 'primary');
    if (!primaryWallet) throw new Error("Primary wallet not found");

    const isDebit = [
        TransactionType.SENT, 
        TransactionType.BILL_PAYMENT, 
        TransactionType.AIRTIME, 
        TransactionType.INSURANCE_PREMIUM, 
        TransactionType.SAVINGS_DEPOSIT, 
        TransactionType.MERCHANT_PAYMENT, 
        TransactionType.LOAN_REPAYMENT,
        TransactionType.EXPENSE,
    ].includes(tx.type);

    const newBalance = isDebit
      ? primaryWallet.balance - tx.amount
      : primaryWallet.balance + tx.amount;
    
    if (newBalance < 0) {
        throw new Error("Insufficient funds in primary wallet");
    }

    await api.addTransaction(user.id, tx);

    let updatedWallets = user.wallets.map(w => 
      w.type === 'primary' ? { ...w, balance: newBalance } : w
    );

    // If it's a savings deposit, also update the savings wallet
    if (tx.type === TransactionType.SAVINGS_DEPOSIT) {
        updatedWallets = updatedWallets.map(w => {
            if (w.type === 'savings') {
                const newSavingsBalance = w.balance + tx.amount;
                const newProgress = w.goal ? Math.min((newSavingsBalance / w.goal) * 100, 100) : w.progress;
                return { ...w, balance: newSavingsBalance, progress: newProgress };
            }
            return w;
        });
    }
    
    const updatedUser = { ...user, wallets: updatedWallets };
    
    await api.updateUser(updatedUser);
    setUser(updatedUser);
    setTransactions(await api.getTransactions(user.id));
  };
  
  const applyForLoan = async (amount: number, duration: number) => {
    if (!user) return;
    const primaryWallet = user.wallets.find(w => w.type === 'primary');
    if (!primaryWallet) throw new Error("Primary wallet not found");

    await api.createLoan(user.id, amount, duration);
    
    const updatedWallets = user.wallets.map(w => 
      w.type === 'primary' ? { ...w, balance: w.balance + amount } : w
    );
    const updatedUser = { ...user, wallets: updatedWallets };

    await api.updateUser(updatedUser);
    setUser(updatedUser);
    setLoans(await api.getLoans(user.id));
    setTransactions(await api.getTransactions(user.id));
  };

  const purchaseInsurance = async (policyData: Omit<InsurancePolicy, 'id' | 'startDate' | 'endDate' | 'policyNumber'>) => {
      if(!user) return;
      const primaryWallet = user.wallets.find(w => w.type === 'primary');
      if (!primaryWallet) throw new Error("Primary wallet not found");

      await api.addInsurancePolicy(user.id, policyData);

      const updatedWallets = user.wallets.map(w => 
        w.type === 'primary' ? { ...w, balance: w.balance - policyData.premium } : w
      );
      const updatedUser = { ...user, wallets: updatedWallets };

      await api.updateUser(updatedUser);
      setUser(updatedUser);
      setPolicies(await api.getInsurancePolicies(user.id));
      setTransactions(await api.getTransactions(user.id));
  }

  const updateSecurity = async (updates: Partial<Pick<User, 'isCardFrozen' | 'pin' | 'has2FA'>>) => {
      if(!user) return;
      const updatedUser = { ...user, ...updates };
      await api.updateUser(updatedUser);
      setUser(updatedUser);
  }

  const refreshUser = async () => {
    if (user) {
      const refreshedUser = await api.getUserById(user.id);
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        loans,
        policies,
        merchantData,
        screen,
        login,
        logout,
        createUser,
        addTransaction,
        applyForLoan,
        purchaseInsurance,
        setScreen,
        updateSecurity,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};