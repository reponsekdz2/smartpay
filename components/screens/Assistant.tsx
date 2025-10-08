import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const Assistant = () => {
    return (
        <Card title="Financial Assistant" className="h-full flex flex-col">
            <div className="flex items-center space-x-3 p-3 border-b border-background">
                <img src="https://api.dicebear.com/8.x/bottts/svg?seed=AI" alt="Assistant" className="w-12 h-12 rounded-full bg-primary-light p-1" />
                <div>
                    <h3 className="font-bold text-text-primary">Your Financial Assistant</h3>
                    <p className="text-sm text-success flex items-center">
                        <span className="w-2 h-2 bg-success rounded-full mr-1.5"></span>
                        Online • AI Powered
                    </p>
                </div>
            </div>
            <div className="flex-grow p-4 space-y-4">
                <Message sender="assistant" text="I noticed you have some extra funds in your main account after your salary. Would you like to explore options to optimize your savings?" />
                
                <div className="flex flex-wrap gap-2">
                    <Reply text="Show me options" />
                    <Reply text="Not now" />
                    <Reply text="Schedule for later" />
                </div>
            </div>
             <div className="p-4 border-t border-background">
                <Button onClick={() => alert("Opening Budget Planner...")}>Budget Planning</Button>
            </div>
        </Card>
    );
};

const Message = ({ sender, text }: { sender: 'assistant' | 'user', text: string }) => (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs px-4 py-2 rounded-2xl ${sender === 'assistant' ? 'bg-background text-text-primary' : 'bg-primary text-white'}`}>
            {text}
        </div>
    </div>
)

const Reply = ({ text }: { text: string }) => (
    <button className="px-4 py-2 rounded-full bg-primary-light text-primary font-semibold text-sm hover:bg-blue-200 transition-colors">
        {text}
    </button>
)

export default Assistant;