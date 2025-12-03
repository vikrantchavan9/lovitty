
'use client';

import { useNotification } from '@/context/NotificationContext';
import React from 'react';

const notificationCatGifs = [
  'https://media.giphy.com/media/FXAzCdJm8QHukxtsTE/giphy.gif', // Original dancing cat
  'https://media.giphy.com/media/dbDbUCnK9QBDg3Yor3/giphy.gif', // Cat waving
  'https://media.giphy.com/media/FRPRLVXkKp5Xuqs2eK/giphy.gif', // Cat peeking
  'https://media.giphy.com/media/I6xXD7U8azbKuLFPgM/giphy.gif', // Cat with hearts
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Njk2cGI1a3JlZTQyM3lydWU4dGpwMnJ4c2w5OW5keTF4Z2s3YTM0cCZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/1ZtjLFk5EPocuRIYrB/giphy.gif', // Cat typing
];

const emojis = ['💖', '😻', '💫', '🐾', '🎀'];

const CatNotification = () => {
  const { notifications } = useNotification();

  return (
    <>
      {/* Notification stack */}
      <div className="fixed bottom-5 right-5 flex flex-col items-end gap-3 z-50">
        {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-pink-500 text-white rounded-2xl p-4 shadow-lg flex items-center relative overflow-hidden w-full max-w-sm transition-all duration-500 ease-in-out transform-gpu animate-in fade-in-0 slide-in-from-bottom-10"
              style={{ animationFillMode: 'forwards' }}
            >
              <div className="flex-shrink-0 mr-3 relative">
                <img src={n.gif} alt="Cat" className="w-16 h-16" />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {n.emojis.map((emoji: string, i: number) => (
                    <div
                      key={i}
                      className="absolute text-xl animate-pulse"
                      style={{ 
                        left: `${Math.random() * 60}%`,
                        animation: `floatUp 2s ease-out ${i * 0.2}s infinite`
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-sm font-semibold">{n.text}</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CatNotification;
