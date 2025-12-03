
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import OmegleChat from '@/components/OmegleChat';
import { Button } from '@/components/ui/button';
import { Loader2, User, Users, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type ChatState =
  | { status: 'idle' }
  | { status: 'waiting' }
  | { status: 'active'; chatId: string }
  | { status: 'error'; message: string };

export default function OmeglePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [chatState, setChatState] = useState<ChatState>({ status: 'idle' });
  const [isFinding, setIsFinding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!authLoading && !user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to use this feature.",
        });
      router.push('/login');
    }
  }, [user, authLoading, router, toast]);
  
  const handleFindChat = useCallback(async () => {
    if (!user) return;
    setIsFinding(true);
    setChatState({ status: 'waiting' });

    // Simulate finding a chat
    setTimeout(() => {
        // For demonstration, we'll go straight to an active chat
        // In a real app, this would involve backend logic to match users
        const mockChatId = `omegle_${Date.now()}`;
        setChatState({ status: 'active', chatId: mockChatId });
        setIsFinding(false);
    }, 2000);

  }, [user, toast]);
  
  const handleLeave = useCallback(async () => {
    setChatState({ status: 'idle' });
    setIsFinding(false);
  }, []);
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isMounted) {
        handleLeave();
      }
    };
  }, [isMounted, handleLeave]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your Omegle experience...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 h-[calc(100vh-8rem)] flex flex-col">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold font-headline text-primary">Omegle Chat</h1>
            <p className="text-muted-foreground">Chat with random strangers, 1-on-1.</p>
        </div>

        {chatState.status === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                 <div className="p-6 bg-primary/10 rounded-full">
                    <Users className="h-16 w-16 text-primary"/>
                 </div>
                <h2 className="text-2xl font-bold">You are disconnected.</h2>
                <Button onClick={handleFindChat} disabled={isFinding} size="lg">
                    {isFinding ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {isFinding ? 'Searching...' : 'Find a Stranger'}
                </Button>
            </div>
        )}

        {chatState.status === 'waiting' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                 <div className="p-6 bg-secondary rounded-full animate-pulse">
                    <User className="h-16 w-16 text-secondary-foreground"/>
                 </div>
                <h2 className="text-2xl font-bold">Waiting for a stranger...</h2>
                <p className="text-muted-foreground">Please wait, we are connecting you.</p>
                <Button onClick={handleLeave} variant="destructive">
                    Cancel Search
                </Button>
            </div>
        )}
        
        {chatState.status === 'error' && (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-4 bg-destructive/10 rounded-lg">
                <XCircle className="h-16 w-16 text-destructive"/>
                <h2 className="text-2xl font-bold text-destructive">An Error Occurred</h2>
                <p className="text-destructive/80">{chatState.message}</p>
                <Button onClick={() => setChatState({ status: 'idle' })}>
                    Try Again
                </Button>
            </div>
        )}

        {chatState.status === 'active' && (
            <OmegleChat
                chatId={chatState.chatId}
                onDisconnect={() => setChatState({ status: 'idle' })}
                onNextChat={handleFindChat}
            />
        )}
    </div>
  );
}
