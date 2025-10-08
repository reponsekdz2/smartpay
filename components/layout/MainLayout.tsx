import React, { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { HomeIcon, PaperAirplaneIcon, ChartBarIcon, ShieldCheckIcon, UserCircleIcon } from '../icons/Icons';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, screen, setScreen, logout } = useApp();

  return (
    <div className="flex flex-col h-screen justify-between">
      <header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center text-white">
        <h1 className="text-xl font-bold tracking-wider">SMART PAY</h1>
        <button onClick={logout} className="flex items-center space-x-2 p-2 rounded-full bg-white/10">
          <UserCircleIcon className="w-6 h-6"/>
        </button>
      </header>

      <main className="flex-grow pt-20 p-4 overflow-y-auto">
        {children}
      </main>

      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-2 sticky bottom-0">
        <nav className="flex justify-around">
          <NavItem icon={<HomeIcon />} label="Home" active={screen === 'DASHBOARD'} onClick={() => setScreen('DASHBOARD')} />
          <NavItem icon={<PaperAirplaneIcon />} label="Actions" active={['TRANSFER', 'BILLS', 'QR'].includes(screen)} onClick={() => setScreen('TRANSFER')} />
          <NavItem icon={<ChartBarIcon />} label="Analytics" active={screen === 'ANALYTICS'} onClick={() => setScreen('ANALYTICS')} />
          <NavItem icon={<ShieldCheckIcon />} label="Security" active={screen === 'SECURITY'} onClick={() => setScreen('SECURITY')} />
        </nav>
      </footer>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactElement, label: string, active: boolean, onClick: () => void }) => {
    const activeClasses = 'text-neon-accent drop-shadow-[0_0_5px_rgba(0,245,255,0.7)]';
    const inactiveClasses = 'text-gray-400';

    return (
        <button onClick={onClick} className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${active ? activeClasses : inactiveClasses} hover:bg-white/10 transition-all duration-300`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
            <span className="text-xs font-medium tracking-wider">{label}</span>
        </button>
    );
}


export default MainLayout;