import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType } from '../../types';
import Card from '../common/Card';
import Input from '../common/Input';

const TransactionIcon = ({ type }: { type: TransactionType }) => {
    const sentStyle = "bg-status-error/20 text-status-error";
    const receivedStyle = "bg-status-success/20 text-status-success";
    const otherStyle = "bg-status-info/20 text-status-info";
    
    let style;
    let icon;

    switch (type) {
        case TransactionType.SENT:
        case TransactionType.MERCHANT_PAYMENT:
        case TransactionType.LOAN_REPAYMENT:
        case TransactionType.BILL_PAYMENT:
        case TransactionType.AIRTIME:
        case TransactionType.SAVINGS_DEPOSIT:
        case TransactionType.INSURANCE_PREMIUM:
            style = sentStyle;
            icon = '↑';
            break;
        case TransactionType.RECEIVED:
        case TransactionType.LOAN_DISBURSEMENT:
            style = receivedStyle;
            icon = '↓';
            break;
        default:
            style = otherStyle;
            icon = '•';
    }

    return <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${style}`}>{icon}</div>;
};


const History = () => {
    const { transactions } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || tx.amount.toString().includes(searchTerm);
            const matchesType = filterType === 'ALL' || tx.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [transactions, searchTerm, filterType]);

    return (
        <Card title="Transaction History">
            <div className="space-y-4">
                <Input placeholder="Search by description or amount..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-neon-accent focus:border-neon-accent/50 focus:outline-none">
                    <option value="ALL" style={{backgroundColor: '#161B22'}}>All Types</option>
                    {Object.values(TransactionType).map(type => (
                        <option key={type} value={type} style={{backgroundColor: '#161B22'}}>{type.replace(/_/g, ' ')}</option>
                    ))}
                </select>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredTransactions.length > 0 ? filteredTransactions.map((tx: Transaction) => (
                        <div key={tx.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/5">
                            <TransactionIcon type={tx.type} />
                            <div className="flex-grow">
                                <p className="font-semibold text-white">{tx.description}</p>
                                <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleString()}</p>
                            </div>
                            <div className={`font-bold font-mono ${[TransactionType.SENT, TransactionType.BILL_PAYMENT, TransactionType.AIRTIME, TransactionType.INSURANCE_PREMIUM, TransactionType.SAVINGS_DEPOSIT].includes(tx.type) ? 'text-status-error' : 'text-status-success'}`}>
                                {`${[TransactionType.SENT, TransactionType.BILL_PAYMENT, TransactionType.AIRTIME, TransactionType.INSURANCE_PREMIUM, TransactionType.SAVINGS_DEPOSIT].includes(tx.type) ? '-' : '+'} ${tx.amount.toLocaleString('en-RW')} RWF`}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 py-4">No transactions found.</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default History;