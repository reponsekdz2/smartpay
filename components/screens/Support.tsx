import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

const Support = () => {
    const { user } = useApp();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'agent', text: `Hello ${user?.name}! How can I help you today?` }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        setTimeout(() => {
            const agentResponse: Message = { text: "Thank you for your message. This is a simulated chat. For real issues, please contact our support line. Your ticket number is #SP-12345.", sender: 'agent' };
            setMessages(prev => [...prev, agentResponse]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full">
            <Card title="Live Support Chat" className="flex-grow flex flex-col">
                <div className="flex-grow bg-black/20 p-4 rounded-lg overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-r from-quantum-primary to-quantum-secondary text-white' : 'bg-white/10 text-gray-200'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSend} className="mt-4 flex space-x-2">
                    <Input placeholder="Type your message..." value={input} onChange={e => setInput(e.target.value)} className="flex-grow" />
                    <Button type="submit" className="w-auto px-6">Send</Button>
                </form>
            </Card>
        </div>
    );
};

export default Support;