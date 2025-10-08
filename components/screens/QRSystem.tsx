import React, { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { TransactionType } from '../../types';

const QRSystem = () => {
  const { user, addTransaction } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const qrValue = JSON.stringify({
    name: user?.name,
    accountNumber: user?.accountNumber,
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSuccess('');

    if (user.pin !== pin) {
        setError("Incorrect PIN");
        return;
    }

    try {
        await addTransaction({
            amount: parseFloat(amount),
            type: TransactionType.MERCHANT_PAYMENT,
            description: `QR Payment to Merchant`,
            recipient: "Scanned Merchant",
            category: "Food & Dining"
        }, 5); // Award 5 XP
        setSuccess(`Successfully paid ${amount} RWF.`);
        setScannedData('');
        setAmount('');
        setPin('');
        setIsScanning(false);
    } catch(err: any) {
        setError(err.message);
    }
  };

  if (isScanning) {
    return (
      <Card title="Scan & Pay">
        <div className="bg-black/50 aspect-square w-full rounded-lg flex items-center justify-center mb-4 border border-white/20">
          <p className="text-white/70 text-center">Camera view simulated.<br/>Enter QR data below.</p>
        </div>
        <form onSubmit={handlePayment} className="space-y-4">
          {error && <p className="text-status-error">{error}</p>}
          {success && <p className="text-status-success">{success}</p>}
          <Input label="Scanned Data (Simulated)" value={scannedData} onChange={(e) => setScannedData(e.target.value)} placeholder='{"name":"Test Merchant", "account":"..."}' />
          <Input label="Amount (RWF)" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
          <Input label="Your PIN" value={pin} onChange={(e) => setPin(e.target.value)} type="password" maxLength={6} />
          <Button type="submit">Pay Now</Button>
          <Button type="button" variant="secondary" onClick={() => setIsScanning(false)}>Cancel</Button>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card title="My QR Code">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <QRCode value={qrValue} size={200} fgColor="#0D1117" bgColor="#FFFFFF" />
          </div>
          <p className="text-gray-400">Show this code to receive money.</p>
          <p className="font-semibold text-lg text-white">{user?.name}</p>
          <p className="text-gray-300 font-mono">{user?.accountNumber}</p>
        </div>
      </Card>
      <Button onClick={() => setIsScanning(true)}>Scan to Pay</Button>
    </div>
  );
};

export default QRSystem;