import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InsuranceType, InsurancePolicy } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const insuranceOptions = {
    [InsuranceType.VEHICLE]: { premium: 15000, coverage: 'Comprehensive', details: { label: 'Plate Number', placeholder: 'RAA 123A' } },
    [InsuranceType.PROPERTY]: { premium: 25000, coverage: 'Fire & Theft', details: { label: 'Property UPI', placeholder: '1/02/03/04/1234' } },
    [InsuranceType.ACCOUNT]: { premium: 1000, coverage: 'Fraud Protection', details: { label: 'Account Number', placeholder: '' } },
    [InsuranceType.HEALTH]: { premium: 5000, coverage: 'Basic Health Plan', details: { label: 'Beneficiary Name', placeholder: 'Your Name' } },
};

const Insurance = () => {
    const { user, policies, purchaseInsurance } = useApp();
    const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
    const [details, setDetails] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // FIX: Get primary wallet to access account number
    const primaryWallet = user?.wallets.find(w => w.type === 'primary');

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if(!selectedType) return;
        if(user?.pin !== pin) {
            setError("Incorrect PIN");
            return;
        }

        const option = insuranceOptions[selectedType];
        
        try {
            await purchaseInsurance({
                type: selectedType,
                premium: option.premium,
                coverage: option.coverage,
                details: { [option.details.label]: details }
            });
            setSuccess(`Successfully purchased ${selectedType}. Your digital certificate is ready.`);
            setDetails('');
            setPin('');
            setSelectedType(null);
        } catch(err: any) {
            setError(err.message);
        }
    }

    if(selectedType) {
        const option = insuranceOptions[selectedType];
        return (
            <Card title={`Purchase ${selectedType}`}>
                <div className="p-4 bg-black/20 rounded-lg space-y-2 mb-6">
                    <div className="flex justify-between text-gray-300"><span>Coverage:</span> <span className="font-semibold text-white">{option.coverage}</span></div>
                    <div className="flex justify-between text-lg font-bold text-white"><span>Premium:</span> <span>{option.premium.toLocaleString('en-RW')} RWF/year</span></div>
                </div>
                <form onSubmit={handlePurchase} className="space-y-4">
                    {error && <p className="text-status-error text-center">{error}</p>}
                    {success && <p className="text-status-success text-center">{success}</p>}
                    <Input 
                        label={option.details.label} 
                        value={details}
                        onChange={e => setDetails(e.target.value)}
                        placeholder={option.details.placeholder}
                        // FIX: Property 'accountNumber' does not exist on type 'User'.
                        defaultValue={selectedType === InsuranceType.ACCOUNT ? primaryWallet?.accountNumber : ''}
                    />
                    <Input label="Confirm with PIN" type="password" value={pin} onChange={e => setPin(e.target.value)} maxLength={6} />
                    <Button type="submit">Pay & Activate Policy</Button>
                    <Button type="button" variant="secondary" onClick={() => setSelectedType(null)}>Back</Button>
                </form>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card title="Insurance Marketplace">
                 {success && <p className="text-status-success text-center mb-4">{success}</p>}
                <div className="space-y-3">
                    {Object.values(InsuranceType).map(type => (
                        <button key={type} onClick={() => setSelectedType(type)} className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-colors duration-300">
                            <p className="font-bold text-white">{type}</p>
                            <p className="text-sm text-gray-400">Starting from {insuranceOptions[type].premium.toLocaleString('en-RW')} RWF</p>
                        </button>
                    ))}
                </div>
            </Card>
            <Card title="My Policies">
                {policies.length > 0 ? (
                    <div className="space-y-2">
                        {policies.map((policy: InsurancePolicy) => (
                            <div key={policy.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="font-semibold text-white">{policy.type}</p>
                                <p className="text-sm text-gray-400">Policy #: {policy.policyNumber}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">You have no active policies.</p>
                )}
            </Card>
        </div>
    );
};

export default Insurance;