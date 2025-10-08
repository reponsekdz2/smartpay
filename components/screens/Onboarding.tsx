import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Input from '../common/Input';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('07');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { createUser, setScreen } = useApp();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10 && phone.startsWith('07')) {
      setError('');
      setStep(2);
    } else {
      setError('Please enter a valid 10-digit Rwandan phone number.');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '458392') {
      setError('');
      setStep(3);
    } else {
      setError('Invalid verification code.');
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be 6 digits.');
    } else if (pin !== confirmPin) {
      setError('PINs do not match.');
    } else {
      setError('');
      setStep(4);
    }
  };
  
  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.length !== 16) {
      setError('National ID must be 16 digits.');
      return
    }
    if(name.trim().length < 3){
        setError('Please enter your full name.');
        return;
    }
    setError('');
    await createUser(phone, pin, name, nationalId);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className='text-center'>
              <h2 className="text-2xl font-bold text-white">Welcome!</h2>
              <p className="text-gray-400">Enter your phone number to get started.</p>
            </div>
            <Input label="Phone Number" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" />
            <Button type="submit">Continue</Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className='text-center'>
              <h2 className="text-2xl font-bold text-white">Verify Your Number</h2>
              <p className="text-gray-400">We've sent a code to {phone}. (Hint: 458392)</p>
            </div>
            <Input label="Verification Code" id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXXXX" />
            <Button type="submit">Verify</Button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className='text-center'>
              <h2 className="text-2xl font-bold text-white">Create a PIN</h2>
              <p className="text-gray-400">Create a secure 6-digit PIN for your account.</p>
            </div>
            <Input label="6-Digit PIN" id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} />
            <Input label="Confirm PIN" id="confirmPin" type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength={6} />
            <Button type="submit">Set PIN</Button>
          </form>
        );
       case 4:
        return (
          <form onSubmit={handleKycSubmit} className="space-y-6">
            <div className='text-center'>
              <h2 className="text-2xl font-bold text-white">Final Step: KYC</h2>
              <p className="text-gray-400">Please provide your National ID and full name.</p>
            </div>
            <Input label="Full Name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Kagame" />
            <Input label="National ID" id="nationalId" type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} placeholder="1234567890123456" maxLength={16} />
            <Button type="submit">Create Account</Button>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
       <div className="w-full max-w-sm mx-auto">
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-quantum-primary to-quantum-secondary tracking-wider">SMART PAY</h1>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && <p className="text-status-error text-center mb-4">{error}</p>}
          {renderStep()}
        </div>
        <p className="text-center mt-6 text-gray-400">Already have an account? <button onClick={() => setScreen('LOGIN')} className="font-semibold text-quantum-primary hover:underline">Log In</button></p>
      </div>
    </div>
  );
};

export default Onboarding;