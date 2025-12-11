
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Plus, UserPlus, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from './ui/skeleton';
import { InboxIcon } from './InboxIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  const { session, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50 transition-all duration-200">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/3d-kitty.png" alt="Lovekitty logo" width={28} height={28} />
            <span className="font-bold font-headline text-xl text-primary">Lovekitty</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : session ? (
            <TooltipProvider>
              <div className="flex items-center space-x-1">
                <Link href="/wallet" className="flex items-center space-x-2 rounded-md border border-input bg-transparent px-2 py-1 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
                  <span className="text-sm">💖</span>
                  <span>0</span>
                  <Plus className="h-4 w-4 ml-1 text-primary" />
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/requests"
                      className="relative inline-flex items-center justify-center rounded-full p-3 text-primary transition-colors hover:bg-primary/10"
                      aria-label="View friend requests"
                    >
                      <UserPlus className="h-6 w-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Friend Requests</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/search">
                        <Search className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
                <InboxIcon unreadCount={0} />
              </div>
            </TooltipProvider>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
