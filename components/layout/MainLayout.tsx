import React, { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { HomeIcon, BriefcaseIcon, ChartBarIcon, UserCircleIcon, PaperAirplaneIcon } from '../icons/Icons';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { screen, setScreen } = useApp();

  return (
    <div className="flex flex-col h-screen justify-between bg-background">
      <header className="bg-surface shadow-sm sticky top-0 z-10 p-3 flex justify-between items-center text-text-primary">
        <h1 className="text-2xl font-bold text-primary">SMART PAY</h1>
        <div className="flex items-center space-x-2">
            <button onClick={() => setScreen('ASSISTANT')} className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                 <PaperAirplaneIcon className="w-5 h-5 text-text-primary" />
            </button>
            <button onClick={() => setScreen('PROFILE')} className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                 <UserCircleIcon className="w-6 h-6 text-text-primary"/>
            </button>
        </div>
      </header>

      <main className="flex-grow p-2 sm:p-4 overflow-y-auto pb-20">
        {children}
      </main>

      <footer className="bg-surface border-t border-gray-200 p-1 fixed bottom-0 w-full max-w-md mx-auto">
        <nav className="flex justify-around">
          <NavItem icon={<HomeIcon />} label="Home" active={screen === 'SOCIAL'} onClick={() => setScreen('SOCIAL')} />
          <NavItem icon={<BriefcaseIcon />} label="Wallet" active={screen === 'WALLET'} onClick={() => setScreen('WALLET')} />
          <NavItem icon={<ChartBarIcon />} label="History" active={screen === 'HISTORY'} onClick={() => setScreen('HISTORY')} />
          <NavItem icon={<UserCircleIcon />} label="Profile" active={screen === 'PROFILE'} onClick={() => setScreen('PROFILE')} />
        </nav>
      </footer>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactElement, label: string, active: boolean, onClick: () => void }) => {
    const activeClasses = 'text-primary';
    const inactiveClasses = 'text-text-secondary';

    return (
        <button onClick={onClick} className={`flex flex-col items-center space-y-1 p-2 flex-1 ${active ? activeClasses : inactiveClasses} transition-colors duration-200`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

export default MainLayout;