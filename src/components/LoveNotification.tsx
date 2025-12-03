"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';

const loveEmojis = ['💘', '💌', '💝', '💞', '🥰', '💕'];

interface LoveNotificationProps {
  message?: string;
}

const LoveNotification: FC<LoveNotificationProps> = ({ message = "You've got a new message!" }) => {
  const [show, setShow] = useState(true);
  const [emoji, setEmoji] = useState('💕'); // Start with a default

  useEffect(() => {
    // Pick a random emoji on the client side to avoid hydration mismatch
    setEmoji(loveEmojis[Math.floor(Math.random() * loveEmojis.length)]);

    // This component will unmount itself after the animation finishes.
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // If show is false, we render nothing, which unmounts the component.
  if (!show) return null;

  return (
    <div className="love-notification">
      {emoji} {message}
    </div>
  );
};

export default LoveNotification;
