
// src/app/(app)/requests/page.tsx
"use client";

import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { handleFriendRequest } from '@/lib/actions/connections';
import { useToast } from '@/hooks/use-toast';

interface FriendRequest {
    id: string;
    sender_id: string;
    users: { // This comes from the join
        name: string;
        photoURL: string;
    } | null
}

export default function RequestsPage() {
    const { user, loading: authLoading } = useAuth();
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRequests = async () => {
            if (!user) {
                setLoading(false);
                return;
            };
            setLoading(true);

            // Fetch requests where the current user is the receiver
            // and join with the users table to get the sender's info
            const { data, error } = await supabase
                .from('friend_requests')
                .select(`
                    id,
                    sender_id,
                    users ( name, photoURL )
                `)
                .eq('receiver_id', user.id);

            if (error) {
                console.error("Error fetching friend requests:", error);
                toast({ variant: 'destructive', title: "Error", description: "Could not fetch friend requests."});
            } else {
                setRequests(data as any);
            }
            setLoading(false);
        }
        fetchRequests();
    }, [user, toast]);

    const onAction = async (requestId: string, senderId: string, action: 'accept' | 'reject') => {
        if (!user) return;
        
        const result = await handleFriendRequest(requestId, user.id, senderId, action);
        
        if (result.error) {
            toast({ variant: 'destructive', title: "Error", description: result.error });
        } else {
            toast({ title: "Success", description: `Request ${action}ed.` });
            // Optimistically remove from UI
            setRequests(prev => prev.filter(r => r.id !== requestId));
        }
    }


    if (authLoading || loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline text-primary">Friend Requests</h1>
                <p className="text-muted-foreground">Accept or reject requests to connect.</p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl">
                    <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-xl font-semibold text-muted-foreground">No new requests</p>
                    <p className="text-muted-foreground mt-2">When someone sends you a friend request, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <Card key={req.id}>
                           <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-12 w-12">
                                        <AvatarImage src={req.users?.photoURL} data-ai-hint="person" />
                                        <AvatarFallback>{req.users?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-lg">{req.users?.name ?? 'Someone'}</p>
                                        <p className="text-sm text-muted-foreground">Wants to connect with you.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => onAction(req.id, req.sender_id, 'reject')}>Reject</Button>
                                    <Button size="sm" onClick={() => onAction(req.id, req.sender_id, 'accept')}>Accept</Button>
                                </div>
                           </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
