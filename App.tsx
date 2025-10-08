import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './components/screens/Onboarding';
import Login from './components/screens/Login';
import MainLayout from './components/layout/MainLayout';
import TransferMoney from './components/screens/TransferMoney';
import PayBills from './components/screens/PayBills';
import QRSystem from './components/screens/QRSystem';
import Borrow from './components/screens/Borrow';
import Savings from './components/screens/Savings';
import Insurance from './components/screens/Insurance';
import Security from './components/screens/Security';
import Business from './components/screens/Business';
import History from './components/screens/History';
import Analytics from './components/screens/Analytics';
import Support from './components/screens/Support';
import Wallet from './components/screens/Wallet';
import Profile from './components/screens/Profile';
import Social from './components/screens/Social';
import Assistant from './components/screens/Assistant';


const AppContent = () => {
  const { user, screen } = useApp();

  if (!user) {
    if (screen === 'ONBOARDING') {
      return <Onboarding />;
    }
    return <Login />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'WALLET':
        return <Wallet />;
      case 'PROFILE':
        return <Profile />;
      case 'SOCIAL':
        return <Social />;
      case 'ASSISTANT':
        return <Assistant />;
      case 'TRANSFER':
        return <TransferMoney />;
      case 'BILLS':
        return <PayBills />;
      case 'QR':
        return <QRSystem />;
      case 'BORROW':
        return <Borrow />;
      case 'SAVINGS':
        return <Savings />;
      case 'INSURANCE':
        return <Insurance />;
      case 'SECURITY':
        return <Security />;
      case 'BUSINESS':
        return <Business />;
      case 'HISTORY':
        return <History />;
      case 'ANALYTICS':
        return <Analytics />;
      case 'SUPPORT':
        return <Support />;
      default:
        return <Social />; // Default to the new Social Feed screen
    }
  };

  return <MainLayout>{renderScreen()}</MainLayout>;
};

const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-md mx-auto bg-background shadow-2xl min-h-screen">
          <AppContent />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;