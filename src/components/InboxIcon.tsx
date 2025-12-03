
"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface InboxIconProps {
  unreadCount?: number;
  className?: string;
}

export function InboxIcon({ unreadCount = 0, className }: InboxIconProps) {
  return (
    <Link
      href="/chats" // This still points to /chats which is now the inbox page
      className={cn(
        'relative inline-flex items-center justify-center rounded-full p-3 text-primary transition-colors hover:bg-primary/10',
        className
      )}
      aria-label="View inbox"
    >
      <Inbox className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-background">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
