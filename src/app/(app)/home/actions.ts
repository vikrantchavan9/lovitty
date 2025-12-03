
// src/app/(app)/home/actions.ts
'use server';

import { availableUsers, nishitaAiProfile, User } from '@/lib/data';

// Combine nishita and other users, ensuring no duplicates if IDs match
const allUsers = [nishitaAiProfile, ...availableUsers].map(u => ({...u, name: u.name, photoURL: u.image}));
const uniqueUsers = Array.from(new Map(allUsers.map(user => [user.id, user])).values());


export type CreatorProfile = User & { name: string, photoURL: string};

export async function getTopCreators(): Promise<CreatorProfile[]> {
    // Return a slice of the local data as top creators
    // Here we sort by rating and take the top 4
    return [...uniqueUsers].sort((a, b) => b.rating - a.rating).slice(0, 4);
}

export async function getAllCreators(): Promise<CreatorProfile[]> {
    // Return all users from the local data file
    return uniqueUsers;
}

export async function getCreatorById(id: string): Promise<CreatorProfile | undefined> {
    return uniqueUsers.find(user => user.id === id);
}
