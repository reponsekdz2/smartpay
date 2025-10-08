import React from 'react';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';

const Social = () => {
    const { user } = useApp();
    if(!user) return null;

    return (
        <div className="space-y-4">
            {/* Create Post simulation */}
            <Card padding="sm">
                <div className="flex items-center space-x-3">
                    <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full"/>
                    <div className="flex-1 p-2 text-left bg-background rounded-full text-text-secondary">
                        What's on your financial mind?
                    </div>
                </div>
            </Card>

            {/* Social Payment Card */}
            <Card>
                <h3 className="font-bold text-text-primary mb-2">Weekend Trip</h3>
                <div className="flex justify-between items-center">
                    <p className="text-text-secondary">Group Payment</p>
                    <p className="font-bold text-lg text-text-primary">150,000 RWF</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                    <p className="text-text-secondary">3 of 4 paid</p>
                    <p className="font-semibold text-primary">Your share: 37,500 RWF</p>
                </div>
            </Card>

            {/* Feed Post */}
            <Post
                avatar="https://api.dicebear.com/8.x/initials/svg?seed=Marie"
                name="Marie Claire"
                timestamp="2 hours ago"
                content="Just reached my savings goal of 500,000 RWF! 🎉 So excited for my new laptop!"
                type="achievement"
                likes={24}
                comments={8}
            />

             <Post
                avatar="https://api.dicebear.com/8.x/initials/svg?seed=Expert"
                name="Financial Expert"
                timestamp="1 day ago"
                content="Pro tip: Automate your savings right after you get paid. Even a small amount grows over time. #SmartSavings"
                type="tip"
                likes={156}
                comments={32}
            />
        </div>
    );
};


const Post = ({ avatar, name, timestamp, content, type, likes, comments }: any) => (
    <Card padding="md">
        <div className="flex items-center space-x-3 mb-3">
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full"/>
            <div>
                <p className="font-bold text-text-primary">{name}</p>
                <p className="text-xs text-text-secondary">{timestamp}</p>
            </div>
        </div>
        <p className="text-text-primary mb-3">{content}</p>
        <div className="flex justify-between items-center text-text-secondary text-sm pt-2 border-t border-background">
            <span>{likes} Likes</span>
            <span>{comments} Comments</span>
        </div>
    </Card>
)

export default Social;