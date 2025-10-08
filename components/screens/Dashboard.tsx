import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import { PaperAirplaneIcon, QrCodeIcon, ArrowTrendingUpIcon, ShieldCheckIcon, CreditCardIcon, BriefcaseIcon, AcademicCapIcon, HeartIcon } from '../icons/Icons';
import { AppContextType } from '../../types';

const Dashboard = () => {
  const { user, setScreen, appContext, setAppContext } = useApp();

  if (!user) return null;

  const xpForNextLevel = 100;
  const xpProgress = (user.xp % xpForNextLevel) / xpForNextLevel * 100;


  const quickActions = {
    morning: [
      { label: 'Pay Bills', icon: <CreditCardIcon />, screen: 'BILLS' },
      { label: 'Top Up', icon: <PaperAirplaneIcon />, screen: 'BILLS' },
      { label: 'Savings', icon: <AcademicCapIcon />, screen: 'SAVINGS' },
      { label: 'Analytics', icon: <ArrowTrendingUpIcon />, screen: 'ANALYTICS' },
    ],
    work: [
      { label: 'Business', icon: <BriefcaseIcon />, screen: 'BUSINESS' },
      { label: 'Send', icon: <PaperAirplaneIcon />, screen: 'TRANSFER' },
      { label: 'Scan QR', icon: <QrCodeIcon />, screen: 'QR' },
      { label: 'Pay Bills', icon: <CreditCardIcon />, screen: 'BILLS' },
    ]
  }
  
  const getGreeting = () => {
    switch(appContext) {
      case 'morning': return `Good morning, ${user.name.split(' ')[0]}!`;
      case 'work': return `Welcome back, ${user.name}!`;
      default: return `Welcome back, ${user.name}!`;
    }
  }

  const currentActions = appContext === 'work' ? quickActions.work : quickActions.morning;


  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-2xl font-bold text-white">{getGreeting()}</h2>
        <p className="text-gray-400">Here's your financial overview.</p>
      </div>
      
       {/* Context Switcher Simulation */}
      <div className="flex space-x-2 p-1 bg-white/5 rounded-lg">
        <button onClick={() => setAppContext('morning')} className={`flex-1 p-2 text-xs rounded ${appContext === 'morning' ? 'bg-quantum-primary text-white' : 'text-gray-300'}`}>Morning</button>
        <button onClick={() => setAppContext('work')} className={`flex-1 p-2 text-xs rounded ${appContext === 'work' ? 'bg-quantum-primary text-white' : 'text-gray-300'}`}>Work</button>
      </div>

      <Card className="bg-gradient-to-br from-quantum-primary to-quantum-secondary text-white animate-pulse-glow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-white/80">Total Balance</p>
                <p className="text-4xl font-bold font-mono tracking-tighter">
                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(user.balance)}
                </p>
            </div>
        </div>
        <div className="mt-4 text-sm text-white/70">
            <p>Account: {user.accountNumber}</p>
        </div>
      </Card>
      
      <Card>
        <div className="grid grid-cols-4 gap-4 text-center">
          {currentActions.map(action => (
            <button key={action.label} onClick={() => setScreen(action.screen as any)} className="flex flex-col items-center space-y-2 text-gray-300 hover:text-neon-accent transition-colors duration-300">
              <div className="bg-white/10 p-4 rounded-full border border-white/10">
                {React.cloneElement(action.icon, { className: 'w-6 h-6 text-quantum-primary' })}
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Financial Wellness">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-white/10 border-2 border-quantum-primary">{user.level}</div>
            <div className="absolute -top-1 -right-1 text-xs bg-neon-accent text-black rounded-full px-1.5 py-0.5 font-bold">LVL</div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-white">XP Progress</span>
              <span className="text-gray-400">{user.xp % 100} / {xpForNextLevel}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-neon-accent to-quantum-primary h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Explore Services">
        <div className="space-y-2">
            <ServiceButton label="Insurance" screen="INSURANCE" icon={<ShieldCheckIcon />} setScreen={setScreen} />
            <ServiceButton label="History" screen="HISTORY" icon={<BriefcaseIcon />} setScreen={setScreen} />
            <ServiceButton label="Support" screen="SUPPORT" icon={<HeartIcon />} setScreen={setScreen} />
        </div>
      </Card>
    </div>
  );
};

const ServiceButton = ({label, screen, icon, setScreen}: any) => (
    <button onClick={() => setScreen(screen)} className="w-full flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors duration-200">
        <div className="bg-white/5 p-2 rounded-lg mr-4 border border-white/10">
            {React.cloneElement(icon, { className: 'w-5 h-5 text-gray-300' })}
        </div>
        <span className="font-semibold text-white">{label}</span>
    </button>
)

export default Dashboard;