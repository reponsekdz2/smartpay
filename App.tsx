import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './components/screens/Onboarding';
import Login from './components/screens/Login';
import Dashboard from './components/screens/Dashboard';
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
      case 'DASHBOARD':
        return <Dashboard />;
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
        return <Dashboard />;
    }
  };

  return <MainLayout>{renderScreen()}</MainLayout>;
};

const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-dark-bg font-sans bg-cover bg-center" style={{backgroundImage: 'linear-gradient(rgba(13, 17, 23, 0.8), rgba(13, 17, 23, 1)), url(https://www.transparenttextures.com/patterns/cubes.png)'}}>
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl shadow-2xl min-h-screen border-l border-r border-white/10">
          <AppContent />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;