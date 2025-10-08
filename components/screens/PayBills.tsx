import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

type Biller = 'REG' | 'WASAC' | 'MTN' | 'STARTIMES';

const billerDetails = {
    REG: { name: 'Rwanda Energy Group', inputLabel: 'Meter Number' },
    WASAC: { name: 'WASAC', inputLabel: 'Customer Number' },
    MTN: { name: 'MTN Airtime', inputLabel: 'Phone Number' },
    STARTIMES: { name: 'StarTimes', inputLabel: 'Smartcard Number' },
}

const PayBills = () => {
    const { user, addTransaction } = useApp();
    const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if(!selectedBiller) return;
        if(pin !== user?.pin) {
            setError("Incorrect PIN");
            return;
        }

        try {
            await addTransaction({
                amount: parseFloat(amount),
                type: selectedBiller === 'MTN' ? TransactionType.AIRTIME : TransactionType.BILL_PAYMENT,
                description: `Payment for ${billerDetails[selectedBiller].name}`,
                recipient: billerDetails[selectedBiller].name,
                category: 'Bills & Utilities'
            });
            setSuccess(`Payment of ${amount} RWF to ${billerDetails[selectedBiller].name} was successful.`);
            setAccountNumber('');
            setAmount('');
            setPin('');
            setSelectedBiller(null);
        } catch (err: any) {
            setError(err.message);
        }
    }

    if (!selectedBiller) {
        return (
            <Card title="Pay Bills">
                {success && <p className="text-success text-center mb-4">{success}</p>}
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(billerDetails).map(([key, value]) => (
                        <button key={key} onClick={() => setSelectedBiller(key as Biller)} className="p-4 bg-background border border-gray-200 rounded-lg text-center hover:bg-gray-200 transition-colors duration-200">
                            <span className="font-semibold text-text-primary">{value.name}</span>
                        </button>
                    ))}
                </div>
            </Card>
        );
    }
    
    return (
        <Card title={`Pay ${billerDetails[selectedBiller].name}`}>
            <form onSubmit={handlePayment} className="space-y-4">
                {error && <p className="text-error text-center">{error}</p>}
                <Input 
                    label={billerDetails[selectedBiller].inputLabel} 
                    id="accountNumber" 
                    type="text" 
                    value={accountNumber} 
                    onChange={(e) => setAccountNumber(e.target.value)} />
                <Input 
                    label="Amount (RWF)" 
                    id="amount" 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} />
                <Input 
                    label="Confirm with PIN" 
                    id="pin" 
                    type="password" 
                    value={pin} 
                    onChange={(e) => setPin(e.target.value)} 
                    maxLength={6} />
                
                <div className="flex space-x-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setSelectedBiller(null)}>Back</Button>
                    <Button type="submit">Pay Now</Button>
                </div>
            </form>
        </Card>
    )
};

export default PayBills;