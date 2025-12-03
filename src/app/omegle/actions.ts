
'use server';

// This file's content has been removed as it depends on Firebase Firestore.
// All Omegle chat matching logic is disabled.

export type MatchResult =
  | { status: 'error'; message: string };
  
export async function findOrCreateChat(userId: string): Promise<MatchResult> {
    return { status: 'error', message: 'This feature is disabled because Firebase has been removed.' };
}

export async function leaveWaitingPool(userId: string) {
    console.warn("leaveWaitingPool is disabled; Firebase has been removed.");
}

export async function endChat(chatId: string) {
    console.warn("endChat is disabled; Firebase has been removed.");
}
