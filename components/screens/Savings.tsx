import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const Savings = () => {
    const { user, savingsGoal, updateSavings } = useApp();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!savingsGoal) return <p>Loading savings...</p>;

    const progress = Math.min((savingsGoal.currentAmount / savingsGoal.goalAmount) * 100, 100);
    
    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const depositAmount = parseFloat(amount);
        if(isNaN(depositAmount) || depositAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (user && depositAmount > user.balance) {
            setError("Insufficient funds in main account.");
            return;
        }

        try {
            await updateSavings(depositAmount);
            setSuccess(`Successfully deposited ${depositAmount.toLocaleString('en-RW')} RWF.`);
            setAmount('');
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    return (
        <div className="space-y-6">
            <Card title={savingsGoal.name}>
                <div className="text-center mb-4">
                    <p className="text-4xl font-bold font-mono text-white">{savingsGoal.currentAmount.toLocaleString('en-RW')} RWF</p>
                    <p className="text-gray-400">out of {savingsGoal.goalAmount.toLocaleString('en-RW')} RWF goal</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4">
                    <div className="bg-gradient-to-r from-neon-accent to-quantum-primary h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-center mt-2 font-semibold text-white">{progress.toFixed(1)}% Complete</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <span className="text-gray-300">Interest Earned:</span>
                    <span className="font-bold text-status-success">+{savingsGoal.interestEarned.toLocaleString('en-RW')} RWF</span>
                </div>
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