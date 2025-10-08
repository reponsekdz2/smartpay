import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { TransactionType } from '../../types';

const Savings = () => {
    // FIX: 'savingsGoal' and 'updateSavings' do not exist on AppContext. Refactored to use available context.
    const { user, addTransaction } = useApp();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const savingsWallet = user?.wallets.find(w => w.type === 'savings');

    if (!savingsWallet) return <p>Loading savings...</p>;
    if (!user) return null;

    const progress = savingsWallet.goal ? Math.min((savingsWallet.balance / savingsWallet.goal) * 100, 100) : 0;
    
    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const depositAmount = parseFloat(amount);
        if(isNaN(depositAmount) || depositAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        
        // FIX: Property 'balance' does not exist on type 'User'. Check primary wallet instead.
        const primaryWallet = user.wallets.find(w => w.type === 'primary');
        if (!primaryWallet || depositAmount > primaryWallet.balance) {
            setError("Insufficient funds in main account.");
            return;
        }

        try {
            // FIX: Call addTransaction instead of the non-existent updateSavings.
            await addTransaction({
                amount: depositAmount,
                type: TransactionType.SAVINGS_DEPOSIT,
                description: 'Deposit to Savings'
            });
            setSuccess(`Successfully deposited ${depositAmount.toLocaleString('en-RW')} RWF.`);
            setAmount('');
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    return (
        <div className="space-y-6">
            <Card title={savingsWallet.name}>
                <div className="text-center mb-4">
                    <p className="text-4xl font-bold font-mono text-white">{savingsWallet.balance.toLocaleString('en-RW')} RWF</p>
                    <p className="text-gray-400">out of {savingsWallet.goal?.toLocaleString('en-RW')} RWF goal</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4">
                    <div className="bg-gradient-to-r from-neon-accent to-quantum-primary h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-center mt-2 font-semibold text-white">{progress.toFixed(1)}% Complete</p>
                {/* Removed interest earned section as data is not available */}
            </Card>

            <Card title="Add to Savings">
                <form onSubmit={handleDeposit} className="space-y-4">
                    {error && <p className="text-status-error text-center">{error}</p>}
                    {success && <p className="text-status-success text-center">{success}</p>}
                    <Input label="Amount to Deposit" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
                    <Button type="submit">Deposit</Button>
                </form>
            </Card>

            <Card title="Auto-Save Rules">
                <p className="text-gray-400 text-center">Auto-save is a powerful tool to reach your goals faster. (This is a simulation).</p>
                <div className="mt-4 flex justify-center">
                    <Button variant="secondary" onClick={() => alert("Auto-save rules would be configured here.")}>Configure Auto-Save</Button>
                </div>
            </Card>
        </div>
    );
};

export default Savings;