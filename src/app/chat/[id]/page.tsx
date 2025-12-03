
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is now a redirect to the main global chat page.
export default function ChatRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/chats');
    }, [router]);

    return null;
}
