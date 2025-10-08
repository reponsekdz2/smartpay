import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import { Wallet as WalletType } from '../../types';
import { HomeIcon, PaperAirplaneIcon, QrCodeIcon, ArrowTrendingUpIcon } from '../icons/Icons';

const Wallet = () => {
    const { user, setScreen } = useApp();

    if (!user) return null;

    const totalBalance = user.wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

    const gradients = {
        primary: 'from-blue-500 to-blue-700',
        savings: 'from-green-500 to-green-700',
        investment: 'from-purple-500 to-purple-700',
        emergency: 'from-yellow-500 to-yellow-700',
    }

    return (
        <div className="space-y-4">
            <Card>
                <p className="text-text-secondary text-sm">Total Balance</p>
                <p className="text-4xl font-bold text-text-primary mt-1">
                    {totalBalance.toLocaleString('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 })}
                </p>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                    <WalletAction icon={<PaperAirplaneIcon />} label="Send" onClick={() => setScreen('TRANSFER')} />
                    <WalletAction icon={<QrCodeIcon />} label="Pay" onClick={() => setScreen('QR')} />
                    <WalletAction icon={<ArrowTrendingUpIcon />} label="Analytics" onClick={() => setScreen('ANALYTICS')} />
                    <WalletAction icon={<HomeIcon />} label="Bills" onClick={() => setScreen('BILLS')} />
                </div>
            </Card>

            <div className="px-2">
                <h2 className="text-lg font-bold text-text-primary">My Wallets</h2>
            </div>
            
            <div className="space-y-3">
                {user.wallets.map(wallet => (
                    <WalletCard key={wallet.id} wallet={wallet} gradients={gradients} />
                ))}
            </div>
        </div>
    );
};

const WalletAction = ({ icon, label, onClick }: { icon: React.ReactElement, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-background">
        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary">
            {/* FIX: Cast icon to allow passing className prop. */}
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
        </div>
        <span className="text-xs font-semibold text-text-secondary">{label}</span>
    </button>
);

const WalletCard = ({ wallet, gradients }: { wallet: WalletType, gradients: any }) => (
    <div className={`p-4 rounded-xl text-white bg-gradient-to-br ${gradients[wallet.type] || 'from-gray-500 to-gray-700'}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg">{wallet.name}</p>
                {wallet.accountNumber && <p className="text-xs opacity-80 font-mono">{wallet.accountNumber}</p>}
            </div>
            <p className="text-2xl font-bold">
                {wallet.balance.toLocaleString('en-RW')} RWF
            </p>
        </div>
        {wallet.type === 'savings' && wallet.goal && (
            <div className="mt-2">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: `${wallet.progress || 0}%` }}></div>
                </div>
                <p className="text-xs text-right mt-1 opacity-90">Goal: {wallet.goal.toLocaleString('en-RW')} RWF</p>
            </div>
        )}
    </div>
);


export default Wallet;