import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-primary tracking-wider">SMART PAY</h1>
            <p className="text-text-secondary mt-2 text-lg">Log in to your account.</p>
        </div>
        <Card>
            <form onSubmit={handleLogin} className="space-y-6">
                <Input label="Phone Number" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07X XXX XXXX" />
                <Input label="PIN" id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} />
                {error && <p className="text-error text-center">{error}</p>}
                <Button type="submit" size="lg">Log In</Button>
            </form>
        </Card>
        <p className="text-center mt-6 text-text-secondary">Don't have an account? <button onClick={() => setScreen('ONBOARDING')} className="font-bold text-primary hover:underline">Sign Up</button></p>
      </div>
    </div>
  );
};

export default Login;