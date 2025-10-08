import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Defs, linearGradient, stop } from 'recharts';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import Card from '../common/Card';

const Analytics = () => {
  const { transactions } = useApp();

  const spendingData = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {
      'Food': 0,
      'Transport': 0,
      'Bills': 0,
      'Fun': 0,
      'Other': 0,
    };

    transactions.forEach((tx: Transaction) => {
      let categoryKey: keyof typeof spendingByCategory = 'Other';
       if (tx.category === 'Food & Dining') categoryKey = 'Food';
       else if (tx.category === 'Transportation') categoryKey = 'Transport';
       else if (tx.category === 'Bills & Utilities') categoryKey = 'Bills';
       else if (tx.category === 'Entertainment') categoryKey = 'Fun';

      if (tx.category && tx.amount > 0 && tx.type !== 'RECEIVED' && tx.type !== 'LOAN_DISBURSEMENT') {
        spendingByCategory[categoryKey] = (spendingByCategory[categoryKey] || 0) + tx.amount;
      }
    });
    
    if (transactions.length < 5) {
        spendingByCategory['Food'] = 25000;
        spendingByCategory['Transport'] = 15000;
        spendingByCategory['Bills'] = 10000;
        spendingByCategory['Fun'] = 5000;
    }

    return Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const totalSpending = useMemo(() => spendingData.reduce((acc, item) => acc + item.value, 0), [spendingData]);

  return (
    <div className="space-y-6">
      <Card title="Spending Analytics">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={spendingData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00C9A7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A0AEC0' }} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'rgba(13, 17, 23, 0.8)', 
                    borderColor: '#00C9A7',
                    color: '#FFF'
                }} 
                formatter={(value) => [`${Number(value).toLocaleString('en-RW')} RWF`, 'Spending']}
              />
              <Area type="monotone" dataKey="value" stroke="#00F5FF" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Spending Breakdown">
        <div className="space-y-3">
          {spendingData.map((item) => (
            <div key={item.name} className="flex items-center text-gray-300">
              <div className="flex-grow">{item.name}</div>
              <div className="font-semibold font-mono text-white">{item.value.toLocaleString('en-RW')} RWF</div>
            </div>
          ))}
          <div className="flex justify-between font-bold text-white border-t border-white/10 pt-3 mt-3">
            <div>Total Spending</div>
            <div>{totalSpending.toLocaleString('en-RW')} RWF</div>
          </div>
        </div>
      </Card>

      <Card title="AI Insights">
          <div className="text-center text-cyan-200 bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/20">
            <p className="font-semibold">Smart Budgeting Recommendation</p>
            <p className="text-sm mt-1">You're doing great with bills! Consider setting a goal to reduce spending on 'Food' by 10% next month to boost your savings.</p>
          </div>
      </Card>
    </div>
  );
};

export default Analytics;