"use client";

import { useState } from 'react';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Search, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { nishitaAiProfile } from '@/lib/data';
import { Card } from '@/components/ui/card';

export default function ChatList() {
  const [loading, setLoading] = useState(false); // Was true, now false
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const ChatSkeleton = () => (
    <div className="flex items-center p-4 bg-background/50 rounded-xl shadow-sm">
      <Skeleton className="h-14 w-14 mr-4 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
           <Inbox />
           Inbox
        </h1>
      </div>

      <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      <div className="space-y-4">
        {loading && (
          <>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </>
        )}
        {!loading && !showArchived && (
            // The AI chat is local and doesn't require Firebase, so it can stay.
            <Link href={`/start-chat/${nishitaAiProfile.id}`} key={nishitaAiProfile.id}>
                 <Card className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-primary/20">
                     <div className="flex items-center gap-4">
                         <Avatar className="h-14 w-14">
                             <AvatarImage src={nishitaAiProfile.image} data-ai-hint={nishitaAiProfile.aiHint} />
                             <AvatarFallback>{nishitaAiProfile.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex-1">
                             <div className="flex items-center gap-2">
                                 <p className="font-bold text-lg font-headline">{nishitaAiProfile.name}</p>
                                 <Bot className="h-4 w-4 text-primary" />
                             </div>
                             <p className="text-sm text-muted-foreground">Your friendly AI companion.</p>
                         </div>
                     </div>
                     <Button variant="ghost" size="sm">Chat Now</Button>
                 </Card>
            </Link>
        )}
        {!loading && (
            <div className="text-center py-16 bg-background/50 rounded-2xl">
                <p className="text-xl font-semibold text-muted-foreground">
                  Chat is Disabled
                </p>
                <p className="text-muted-foreground mt-2">
                  This feature is unavailable as Firebase has been removed.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
