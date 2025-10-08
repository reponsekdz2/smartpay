import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

const Business = () => {
    const { merchantData } = useApp();

    if (!merchantData) {
        return <p>Loading merchant data...</p>;
    }

    return (
        <div className="space-y-6">
            <Card title="Merchant Dashboard">
                <div className="grid grid-cols-2 gap-4">
                    <StatBox label="Today's Sales" value={`${merchantData.todaysSales.toLocaleString('en-RW')} RWF`} />
                    <StatBox label="Transactions" value={merchantData.transactionCount.toString()} />
                    <StatBox label="Pending Payout" value={`${merchantData.pendingPayout.toLocaleString('en-RW')} RWF`} />
                    <StatBox label="Customers" value={merchantData.customerCount.toString()} />
                </div>
            </Card>

            <Card title="Business Tools">
                <div className="space-y-3">
                    <Button onClick={() => alert("A payment link has been generated and copied to your clipboard!")}>Generate Payment Link</Button>
                    <Button variant="secondary" onClick={() => alert("Invoice creation module would open here.")}>Create Invoice</Button>
                </div>
            </Card>

            <Card title="Customer Analytics">
                <div className="text-center text-gray-400">
                    <p>Real-time customer analytics and charts would be displayed here.</p>
                </div>
            </Card>
        </div>
    );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold text-white font-mono">{value}</p>
    </div>
);

export default Business;