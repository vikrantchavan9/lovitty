
'use server';

// This file is currently not in use as the features depend on a database schema not yet implemented.
// It can be used in the future to handle block, mute, and archive logic with Supabase.

export async function blockUser(currentUserId: string, targetId: string, chatId: string) {
    return { error: 'This feature is currently disabled.' };
}

export async function unblockUser(currentUserId: string, targetId: string, chatId: string) {
    return { error: 'This feature is currently disabled.' };
}

export async function muteUser(currentUserId: string, chatId: string) {
    return { error: 'This feature is currently disabled.' };
}

export async function unmuteUser(currentUserId: string, chatId: string) {
    return { error: 'This feature is currently disabled.' };
}

export async function archiveChat(currentUserId: string, chatId: string) {
    return { error: 'This feature is currently disabled.' };
}

export async function unarchiveChat(currentUserId: string, chatId: string) {
    return { error: 'This feature is currently disabled.' };
}
