// src/app/start-chat/[otherUserId]/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is now a simple redirect to the global chat page.
// The logic for creating/finding a chat room has been disabled.
export default function StartChatPage() {
  const router = useRouter();

  useEffect(() => {
    // In a future version, this could find/create a chat room
    // and redirect to /chat/[chatId]
    router.replace('/chats');
  }, [router]);

  return null; // Render nothing, just redirect
}
