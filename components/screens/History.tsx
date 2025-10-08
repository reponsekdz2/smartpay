import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType } from '../../types';
import Card from '../common/Card';
import Input from '../common/Input';

const TransactionIcon = ({ type }: { type: TransactionType }) => {
    const sentStyle = "bg-red-100 text-red-600";
    const receivedStyle = "bg-green-100 text-green-600";
    const otherStyle = "bg-blue-100 text-blue-600";
    
    let style, icon;

    switch (type) {
        case TransactionType.EXPENSE:
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
        case TransactionType.INCOME:
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

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${active ? 'bg-primary-light text-primary' : 'bg-background hover:bg-gray-200 text-text-secondary'}`}>
        {label}
    </button>
)

const History = () => {
    const { transactions } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || tx.amount.toString().includes(searchTerm);
            
            if (filterType === 'ALL') return matchesSearch;
            if (filterType === 'INCOME') return matchesSearch && [TransactionType.INCOME, TransactionType.RECEIVED, TransactionType.LOAN_DISBURSEMENT].includes(tx.type);
            if (filterType === 'EXPENSES') return matchesSearch && ![TransactionType.INCOME, TransactionType.RECEIVED, TransactionType.LOAN_DISBURSEMENT].includes(tx.type);
            
            return matchesSearch && tx.type === filterType;
        });
    }, [transactions, searchTerm, filterType]);

    return (
        <Card title="Transaction History" padding="sm" className="h-full">
            <div className="p-2 space-y-4">
                <Input placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    <FilterChip label="All" active={filterType === 'ALL'} onClick={() => setFilterType('ALL')} />
                    <FilterChip label="Income" active={filterType === 'INCOME'} onClick={() => setFilterType('INCOME')} />
                    <FilterChip label="Expenses" active={filterType === 'EXPENSES'} onClick={() => setFilterType('EXPENSES')} />
                </div>

                <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                    {filteredTransactions.length > 0 ? filteredTransactions.map((tx: Transaction) => (
                        <div key={tx.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                            <TransactionIcon type={tx.type} />
                            <div className="flex-grow">
                                <p className="font-bold text-text-primary">{tx.description}</p>
                                <p className="text-sm text-text-secondary">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <div className={`font-bold text-right ${[TransactionType.INCOME, TransactionType.RECEIVED].includes(tx.type) ? 'text-success' : 'text-text-primary'}`}>
                                {`${[TransactionType.INCOME, TransactionType.RECEIVED].includes(tx.type) ? '+' : '-'} ${tx.amount.toLocaleString('en-RW')} RWF`}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-text-secondary py-8">No transactions found.</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default History;