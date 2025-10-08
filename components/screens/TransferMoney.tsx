import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

const TransferMoney = () => {
  const { user, addTransaction } = useApp();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const primaryBalance = user?.wallets.find(w => w.type === 'primary')?.balance || 0;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (recipient.length < 12) {
      setError('Invalid recipient phone number.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Invalid amount.');
      return;
    }
    if (numericAmount > primaryBalance) {
      setError('Insufficient funds.');
      return;
    }
    setStep(2);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (pin !== user?.pin) {
      setError('Incorrect PIN.');
      return;
    }
    try {
      await addTransaction({
        amount: parseFloat(amount),
        type: TransactionType.SENT,
        description: `Sent to ${recipient}`,
        recipient,
        category: 'Other'
      });
      setSuccess(`Successfully sent ${amount} RWF to ${recipient}.`);
      setRecipient('');
      setAmount('');
      setPin('');
      setStep(1);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (step === 1) {
    return (
      <Card title="Send Money">
        <form onSubmit={handleContinue} className="space-y-6">
          {error && <p className="text-error text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}
          <Input label="Recipient's Phone Number" id="recipient" type="tel" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="+250 7XX XXX XXX" />
          <Input label="Amount (RWF)" id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
          <Button type="submit">Continue</Button>
        </form>
      </Card>
    );
  }

  return (
    <Card title="Confirm Transfer">
      <div className="space-y-4 mb-6 p-4 rounded-lg bg-background">
        <div className="flex justify-between">
          <span className="text-text-secondary">To:</span>
          <span className="font-semibold text-text-primary">{recipient}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Amount:</span>
          <span className="font-semibold text-text-primary">{parseFloat(amount).toLocaleString('en-RW')} RWF</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-text-primary pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span>{parseFloat(amount).toLocaleString('en-RW')} RWF</span>
        </div>
      </div>
      <form onSubmit={handleConfirm} className="space-y-4">
        {error && <p className="text-error text-center">{error}</p>}
        <Input label="Enter your PIN to confirm" id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} />
        <Button type="submit">Confirm & Send</Button>
        <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
      </form>
    </Card>
  );
};

export default TransferMoney;