import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import { PaperAirplaneIcon, QrCodeIcon, ArrowTrendingUpIcon, ShieldCheckIcon, CreditCardIcon, BriefcaseIcon, AcademicCapIcon, HeartIcon } from '../icons/Icons';

const Dashboard_DEPRECATED = () => {
  const { user, setScreen } = useApp();

  if (!user) return null;

  const totalBalance = user.wallets.reduce((acc, w) => acc + w.balance, 0);

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-2xl font-bold text-text-primary">Welcome, {user.name.split(' ')[0]}!</h2>
        <p className="text-text-secondary">Here's your financial overview.</p>
      </div>
      
      <Card className="bg-primary text-white">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-white/80">Total Balance</p>
                <p className="text-4xl font-bold">
                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(totalBalance)}
                </p>
            </div>
        </div>
      </Card>
      
      <Card>
        <div className="grid grid-cols-4 gap-4 text-center">
            <button onClick={() => setScreen('TRANSFER')} className="flex flex-col items-center space-y-2 text-text-secondary hover:text-primary transition-colors duration-300">
              <div className="bg-primary-light p-4 rounded-full">
                <PaperAirplaneIcon className='w-6 h-6 text-primary' />
              </div>
              <span className="text-xs font-medium">Send</span>
            </button>
        </div>
      </Card>
    </div>
  );
};


export default Dashboard_DEPRECATED;