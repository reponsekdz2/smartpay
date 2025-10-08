import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const Security = () => {
    const { user, updateSecurity, logout } = useApp();
    const [showChangePin, setShowChangePin] = useState(false);
    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    if (!user) return null;
    
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (user.securityScore / 100) * circumference;

    const handleFreezeCard = async () => {
        await updateSecurity({ isCardFrozen: !user.isCardFrozen });
        // alert(`Card has been ${!user.isCardFrozen ? 'frozen' : 'unfrozen'}.`);
    };

    const handle2FA = async () => {
        await updateSecurity({ has2FA: !user.has2FA });
        // alert(`2FA has been ${!user.has2FA ? 'enabled' : 'disabled'}.`);
    }

    const handleChangePin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (oldPin !== user.pin) {
            setError("Old PIN is incorrect.");
            return;
        }
        if (newPin.length !== 6) {
            setError("New PIN must be 6 digits.");
            return;
        }
        if (newPin !== confirmNewPin) {
            setError("New PINs do not match.");
            return;
        }
        await updateSecurity({ pin: newPin });
        setSuccess("PIN changed successfully. You will be logged out.");
        setTimeout(logout, 2000);
    }

    return (
        <div className="space-y-6">
            <Card title="Security Center">
                <div className="flex items-center justify-center mb-6">
                    <svg className="transform -rotate-90 w-36 h-36">
                        <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
                        <circle
                            cx="72"
                            cy="72"
                            r="54"
                            stroke="url(#securityGradient)"
                            strokeWidth="12"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-in-out"
                        />
                         <defs>
                            <linearGradient id="securityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00F5FF" />
                            <stop offset="100%" stopColor="#00C9A7" />
                            </linearGradient>
                        </defs>
                        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-4xl font-bold fill-current text-white">{user.securityScore}%</text>
                    </svg>
                </div>
                <div className="space-y-4">
                    <SecurityAction label="Freeze Card" action={handleFreezeCard} active={user.isCardFrozen} />
                    <SecurityAction label="Enable 2FA" action={handle2FA} active={user.has2FA} />
                    <button onClick={() => setShowChangePin(!showChangePin)} className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-white">Change PIN</button>
                    {showChangePin && (
                        <form onSubmit={handleChangePin} className="p-4 bg-black/20 rounded-lg space-y-3">
                             {error && <p className="text-status-error text-center text-sm">{error}</p>}
                             {success && <p className="text-status-success text-center text-sm">{success}</p>}
                            <Input placeholder="Old PIN" type="password" value={oldPin} onChange={e => setOldPin(e.target.value)} maxLength={6} />
                            <Input placeholder="New PIN" type="password" value={newPin} onChange={e => setNewPin(e.target.value)} maxLength={6} />
                            <Input placeholder="Confirm New PIN" type="password" value={confirmNewPin} onChange={e => setConfirmNewPin(e.target.value)} maxLength={6} />
                            <Button type="submit">Update PIN</Button>
                        </form>
                    )}
                </div>
            </Card>

            <Card title="Login History">
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {user.loginHistory.slice().reverse().map((date, index) => (
                        <li key={index} className="text-sm text-gray-300 p-2 bg-white/5 rounded">
                            Logged in on {new Date(date).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </Card>
            
            <Card title="Device Management">
                <p className="text-gray-400 text-center">You are currently logged in on this device.</p>
                <div className="mt-4">
                    <Button variant="danger" onClick={logout}>Log Out of All Devices</Button>
                </div>
            </Card>
        </div>
    );
};

const SecurityAction = ({ label, action, active }: { label: string; action: () => void; active: boolean }) => (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white/10">
        <span className="font-medium text-white">{label}</span>
        <button onClick={action} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${active ? 'bg-quantum-primary' : 'bg-white/20'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export default Security;