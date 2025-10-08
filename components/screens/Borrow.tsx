import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { Loan } from '../../types';

const Borrow = () => {
  const { user, loans, applyForLoan } = useApp();
  const [amount, setAmount] = useState(50000);
  const [duration, setDuration] = useState(30);
  const [interest, setInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const calculatedInterest = amount * 0.03;
    setInterest(calculatedInterest);
    setTotalRepayment(amount + calculatedInterest);
  }, [amount, duration]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (user?.pin !== pin) {
      setError("Incorrect PIN");
      return;
    }

    try {
      await applyForLoan(amount, duration);
      setSuccess(`Loan of ${amount} RWF successfully disbursed to your account.`);
      setPin('');
    } catch(err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Apply for a Loan">
        <form onSubmit={handleApply} className="space-y-6">
          <div>
            <label htmlFor="amount-range" className="block text-sm font-medium text-gray-300 mb-1">Amount: <span className="font-bold text-white">{amount.toLocaleString('en-RW')} RWF</span></label>
            <input id="amount-range" type="range" min="5000" max="500000" step="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-quantum-primary" />
          </div>
          <div>
            <label htmlFor="duration-range" className="block text-sm font-medium text-gray-300 mb-1">Duration: <span className="font-bold text-white">{duration} days</span></label>
            <input id="duration-range" type="range" min="7" max="90" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-quantum-primary" />
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg space-y-2">
            <div className="flex justify-between text-gray-300"><span>Interest:</span> <span className="font-semibold text-white">{interest.toLocaleString('en-RW')} RWF</span></div>
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10"><span>Total Repayment:</span> <span>{totalRepayment.toLocaleString('en-RW')} RWF</span></div>
          </div>
          
          <Input label="Confirm with PIN" id="pin" type="password" value={pin} onChange={e => setPin(e.target.value)} maxLength={6} />
          {error && <p className="text-status-error text-center">{error}</p>}
          {success && <p className="text-status-success text-center">{success}</p>}
          <Button type="submit">Apply & Get Instant Approval</Button>
        </form>
      </Card>
      
      <Card title="Loan History">
        {loans.length > 0 ? (
          <div className="space-y-3">
            {loans.map((loan: Loan) => (
              <div key={loan.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">{loan.amount.toLocaleString('en-RW')} RWF</span>
                  <span className={loan.isRepaid ? 'text-status-success' : 'text-status-warning'}>{loan.isRepaid ? 'Repaid' : 'Active'}</span>
                </div>
                <div className="text-sm text-gray-400">Due on: {new Date(loan.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No loan history.</p>
        )}
      </Card>
    </div>
  );
};

export default Borrow;