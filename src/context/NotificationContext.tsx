
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

const notificationCatGifs = [
  'https://media.giphy.com/media/FXAzCdJm8QHukxtsTE/giphy.gif', // Original dancing cat
  'https://media.giphy.com/media/dbDbUCnK9QBDg3Yor3/giphy.gif', // Cat waving
  'https://media.giphy.com/media/FRPRLVXkKp5Xuqs2eK/giphy.gif', // Cat peeking
  'https://media.giphy.com/media/I6xXD7U8azbKuLFPgM/giphy.gif', // Cat with hearts
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Njk2cGI1a3JlZTQyM3lydWU4dGpwMnJ4c2w5OW5keTF4Z2s3YTM0cCZlcD12MV9zdGlja2Vyc19yZWxhdGVkJmN0PXM/1ZtjLFk5EPocuRIYrB/giphy.gif' // Cat typing
];

const emojis = ['💖', '😻', '💫', '🐾', '🎀'];

let id = 0;

type Notification = {
  id: number;
  text: string;
  gif: string;
  emojis: string[];
};

type NotificationContextType = {
  notifications: Notification[];
  pushNotification: (text: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const pushNotification = (text: string) => {
    const newId = ++id;
    const randomGif = notificationCatGifs[Math.floor(Math.random() * notificationCatGifs.length)];
    
    const newNotification: Notification = {
      id: newId,
      text,
      gif: randomGif,
      emojis: emojis,
    };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newId));
    }, 6000);

    const audio = new Audio('/meow.mp3.wav');
    audio.play().catch(error => console.log("Audio play failed:", error));
  };

  return (
    <NotificationContext.Provider value={{ notifications, pushNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
