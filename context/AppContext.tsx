import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Transaction, Loan, SavingsGoal, InsurancePolicy, MerchantData, Screen, AppContextType as AppContextState } from '../types';
import * as api from '../services/mockApi';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  loans: Loan[];
  savingsGoal: SavingsGoal | null;
  policies: InsurancePolicy[];
  merchantData: MerchantData | null;
  screen: Screen;
  appContext: AppContextState;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => void;
  createUser: (phone: string, pin: string, name: string, nationalId: string) => Promise<User | null>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>, xp?: number) => Promise<void>;
  applyForLoan: (amount: number, duration: number) => Promise<void>;
  updateSavings: (amount: number) => Promise<void>;
  purchaseInsurance: (policy: Omit<InsurancePolicy, 'id' | 'startDate' | 'endDate' | 'policyNumber'>) => Promise<void>;
  setScreen: (screen: Screen) => void;
  updateSecurity: (updates: Partial<Pick<User, 'isCardFrozen' | 'pin' | 'has2FA'>>) => Promise<void>;
  refreshUser: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  setAppContext: (context: AppContextState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [screen, setScreen] = useState<Screen>('LOGIN');
  const [appContext, setAppContext] = useState<AppContextState>('morning');

  const loadData = useCallback(async (currentUser: User) => {
    setTransactions(await api.getTransactions(currentUser.id));
    setLoans(await api.getLoans(currentUser.id));
    setSavingsGoal(await api.getSavingsGoal(currentUser.id));
    setPolicies(await api.getInsurancePolicies(currentUser.id));
    setMerchantData(await api.getMerchantData(currentUser.id));
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedInUser = await api.getCurrentUser();
      if (loggedInUser) {
        setUser(loggedInUser);
        setScreen('DASHBOARD');
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
      setScreen('DASHBOARD');
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
      setScreen('DASHBOARD');
      await loadData(newUser);
    }
    return newUser;
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const updatedUser = { ...user, xp: newXP, level: newLevel };
    await api.updateUser(updatedUser);
    setUser(updatedUser);
  }

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date' | 'status'>, xp: number = 5) => {
    if (!user) return;
    const newBalance = tx.type === 'SENT' || tx.type === 'BILL_PAYMENT' || tx.type === 'AIRTIME' || tx.type === 'INSURANCE_PREMIUM' || tx.type === 'SAVINGS_DEPOSIT' || tx.type === 'MERCHANT_PAYMENT' || tx.type === 'LOAN_REPAYMENT'
      ? user.balance - tx.amount
      : user.balance + tx.amount;
    
    if (newBalance < 0) {
        throw new Error("Insufficient funds");
    }

    await api.addTransaction(user.id, tx);
    const updatedUser = { ...user, balance: newBalance };
    await api.updateUser(updatedUser);
    setUser(updatedUser);
    setTransactions(await api.getTransactions(user.id));
    await addXP(xp);
  };
  
  const applyForLoan = async (amount: number, duration: number) => {
    if (!user) return;
    await api.createLoan(user.id, amount, duration);
    const updatedUser = { ...user, balance: user.balance + amount };
    await api.updateUser(updatedUser);
    setUser(updatedUser);
    setLoans(await api.getLoans(user.id));
    setTransactions(await api.getTransactions(user.id));
    await addXP(25);
  };

  const updateSavings = async (amount: number) => {
      if(!user) return;
      await api.updateSavings(user.id, amount);
      const updatedUser = {...user, balance: user.balance - amount};
      await api.updateUser(updatedUser);
      setUser(updatedUser);
      setSavingsGoal(await api.getSavingsGoal(user.id));
      setTransactions(await api.getTransactions(user.id));
      await addXP(15);
  }

  const purchaseInsurance = async (policyData: Omit<InsurancePolicy, 'id' | 'startDate' | 'endDate' | 'policyNumber'>) => {
      if(!user) return;
      await api.addInsurancePolicy(user.id, policyData);
      const updatedUser = {...user, balance: user.balance - policyData.premium, activePolicies: user.activePolicies + 1 };
      await api.updateUser(updatedUser);
      setUser(updatedUser);
      setPolicies(await api.getInsurancePolicies(user.id));
      setTransactions(await api.getTransactions(user.id));
      await addXP(20);
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
        savingsGoal,
        policies,
        merchantData,
        screen,
        appContext,
        login,
        logout,
        createUser,
        addTransaction,
        applyForLoan,
        updateSavings,
        purchaseInsurance,
        setScreen,
        updateSecurity,
        refreshUser,
        addXP,
        setAppContext,
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