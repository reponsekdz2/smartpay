import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheckIcon, UserCircleIcon, QrCodeIcon } from '../icons/Icons';

const Profile = () => {
    const { user, setScreen, logout } = useApp();

    if (!user) return null;

    return (
        <div className="bg-background min-h-full">
            {/* Cover Photo & Avatar */}
            <div className="relative">
                <img src={user.coverPhoto} alt="Cover" className="w-full h-36 object-cover" />
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-background object-cover" />
                        {user.verified && (
                             <div className="absolute bottom-2 right-2 bg-primary rounded-full p-1 border-2 border-background">
                                <ShieldCheckIcon className="w-4 h-4 text-white" />
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Info & Stats */}
            <div className="pt-20 text-center px-4">
                <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
                <p className="text-text-secondary mt-1">{user.bio}</p>
                <div className="mt-4 flex justify-around p-2 bg-surface rounded-lg shadow-sm">
                    <Stat value={user.friendsCount} label="Connections" />
                    <Stat value={user.transactionCount} label="Transactions" />
                    <Stat value={user.trustScore} label="Trust Score" />
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="p-4 grid grid-cols-3 gap-2">
                <ActionButton icon={<UserCircleIcon />} label="Edit" onClick={() => alert('Edit Profile clicked!')} />
                <ActionButton icon={<QrCodeIcon />} label="My QR" onClick={() => setScreen('QR')} />
                <ActionButton icon={<ShieldCheckIcon />} label="Security" onClick={() => setScreen('SECURITY')} />
            </div>

            {/* Profile Sections */}
            <div className="p-2 space-y-2">
                 <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-bold text-text-primary mb-2">Personal Information</h3>
                    <InfoRow label="National ID" value={user.nationalId} />
                    <InfoRow label="Phone" value={user.phone} />
                    <InfoRow label="Email" value={user.email} />
                 </div>
                 <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-bold text-text-primary mb-2">Financial Identity</h3>
                    <InfoRow label="Credit Score" value={user.creditScore.toString()} />
                    <InfoRow label="Risk Profile" value={user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} />
                 </div>
                 <div className="bg-surface rounded-lg p-4">
                    <button onClick={logout} className="w-full text-left text-error font-semibold">Log Out</button>
                 </div>
            </div>
        </div>
    );
};

const Stat = ({ value, label }: { value: number | string, label: string }) => (
    <div className="text-center">
        <p className="font-bold text-lg text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
    </div>
);

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactElement, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary-light hover:bg-blue-200 transition-colors">
        {/* FIX: Cast icon to allow passing className prop. */}
        {React.cloneElement(icon as React.ReactElement<any>, {className: "w-6 h-6 text-primary"})}
        <span className="text-sm font-semibold text-primary mt-1">{label}</span>
    </button>
);

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between py-2 border-b border-background last:border-b-0">
        <span className="text-text-secondary">{label}</span>
        <span className="font-semibold text-text-primary">{value}</span>
    </div>
)

export default Profile;