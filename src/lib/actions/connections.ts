
// src/lib/actions/connections.ts
'use server';

import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ConnectionStatus = 'not_friends' | 'pending_sent' | 'pending_received' | 'friends' | 'loading' | 'disabled';

export async function checkConnectionStatus(currentUserId: string, otherUserId: string): Promise<ConnectionStatus> {
    if (!currentUserId || !otherUserId) return 'disabled';

    // Check for an existing connection (friends)
    const connectionId = [currentUserId, otherUserId].sort().join('_');
    const { data: connection, error: connError } = await supabase
        .from('connections')
        .select('status')
        .eq('id', connectionId)
        .single();
        
    if (connError && connError.code !== 'PGRST116') { // Ignore 'no rows found'
        console.error("Error checking connection:", connError);
        return 'disabled';
    }

    if (connection?.status === 'accepted') {
        return 'friends';
    }

    // Check for a pending friend request
    const { data: request, error: reqError } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .or(`(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
        .maybeSingle();

    if (reqError) {
        console.error("Error checking friend request:", reqError);
        return 'disabled';
    }

    if (request) {
        return request.sender_id === currentUserId ? 'pending_sent' : 'pending_received';
    }

    return 'not_friends';
}

export async function sendFriendRequest(senderId: string, receiverId: string) {
    if (!senderId || !receiverId) return { error: 'Invalid user IDs' };

    const { data, error } = await supabase
        .from('friend_requests')
        .insert({ sender_id: senderId, receiver_id: receiverId, status: 'pending' });

    if (error) {
        console.error("Error sending friend request:", error);
        return { error: error.message };
    }
    
    // Revalidate the profile page to show the updated status
    revalidatePath(`/profile/${receiverId}`);
    return { success: true };
}

export async function handleFriendRequest(
  requestId: string,
  currentUserId: string, // The user accepting/rejecting
  senderId: string,
  action: 'accept' | 'reject'
) {
    if (action === 'reject') {
        const { error } = await supabase.from('friend_requests').delete().eq('id', requestId);
        if (error) return { error: error.message };
        
        revalidatePath('/requests');
        return { success: true };
    }

    if (action === 'accept') {
        // In a transaction, create a connection and delete the request
        const connectionId = [currentUserId, senderId].sort().join('_');
        
        const { error: connError } = await supabase
            .from('connections')
            .insert({
                id: connectionId,
                participants: [currentUserId, senderId],
                status: 'accepted'
            });

        if (connError) {
             // If connection already exists, just delete request
            if (connError.code !== '23505') { // 23505 is unique violation
                 return { error: connError.message };
            }
        }

        // If connection is created (or already existed), delete the friend request
        const { error: delError } = await supabase.from('friend_requests').delete().eq('id', requestId);
        if (delError) {
            // Attempt to rollback or handle inconsistency
            console.error("Failed to delete friend request after accepting:", delError);
            return { error: 'Failed to finalize friend request. Please try again.' };
        }
        
        revalidatePath('/requests');
        revalidatePath(`/profile/${senderId}`);
        return { success: true };
    }

    return { error: 'Invalid action.' };
}
