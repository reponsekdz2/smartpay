import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Input from '../common/Input';

const Login = () => {
  const [phone, setPhone] = useState('07');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, setScreen } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(phone, pin);
    if (!success) {
      setError('Invalid phone number or PIN.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-quantum-primary to-quantum-secondary tracking-wider">SMART PAY</h1>
            <p className="text-gray-400 mt-2">Welcome back!</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
                <Input label="Phone Number" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" />
                <Input label="PIN" id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} />
                {error && <p className="text-status-error text-center">{error}</p>}
                <Button type="submit">Log In</Button>
            </form>
        </div>
        <p className="text-center mt-6 text-gray-400">Don't have an account? <button onClick={() => setScreen('ONBOARDING')} className="font-semibold text-quantum-primary hover:underline">Sign Up</button></p>
      </div>
    </div>
  );
};

export default Login;