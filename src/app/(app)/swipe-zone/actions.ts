// src/app/(app)/swipe-zone/actions.ts
'use server';

// This file's content has been removed as it depends on Firebase Firestore.
// All swipe/rating logic is disabled.

export async function getSwipeProfiles(currentUserId: string) {
    console.warn("getSwipeProfiles is disabled; Firebase has been removed.");
    return [];
}

export const rateUser = async (raterId: string, targetId: string, rating: number) => {
  console.warn("rateUser is disabled; Firebase has been removed.");
  return;
};
