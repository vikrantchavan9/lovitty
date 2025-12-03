// src/app/start-chat/[otherUserId]/actions.ts
'use server';

// This file's content has been removed as it depends on Firebase Firestore.
// The logic has been disabled to prevent errors.

export async function getOrCreateChatRoom(currentUserId: string, otherUserId: string): Promise<string> {
  console.warn("getOrCreateChatRoom is disabled; Firebase has been removed.");
  // Throw an error or return a specific indicator that the feature is disabled.
  throw new Error('Chat functionality is currently disabled.');
}
