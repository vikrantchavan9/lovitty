
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import CatNotification from '@/components/CatNotification';
import { NotificationProvider } from '@/context/NotificationContext';
import { CallProvider } from '@/context/CallContext';
import AuthGuard from '@/components/AuthGuard';
import { useEffect } from 'react';

// export const metadata: Metadata = {
//   title: 'Lovekitty',
//   description: 'Talk. Laugh. Connect. Repeat 🎧',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Heart cursor trail script
    const handleMouseMove = (e: MouseEvent) => {
        let heart = document.createElement("span");
        heart.innerHTML = "💗";
        heart.style.position = "fixed";
        heart.style.left = (e.clientX - 10) + "px";
        heart.style.top = (e.clientY - 10) + "px";
        heart.style.fontSize = "18px";
        heart.style.opacity = "0.8";
        heart.style.pointerEvents = "none";
        heart.style.animation = "cursorFloat 1s ease-out forwards";
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 900);
    };
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
        document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <html lang="en" className="light">
      <head>
        <title>Loekitty</title>
        <meta name="description" content="Talk. Laugh. Connect. Repeat 🎧" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <AuthProvider>
          <NotificationProvider>
            <CallProvider>
              <AuthGuard>{children}</AuthGuard>
              <Toaster />
              <CatNotification />
            </CallProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
