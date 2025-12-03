
'use server';

import { availableUsers, nishitaAiProfile } from '@/lib/data';
import type { User } from '@/lib/data';

const allUsers: User[] = [nishitaAiProfile, ...availableUsers];

// --- User Search Action ---
export async function searchUsers(queryText: string): Promise<User[]> {
    if (!queryText.trim()) {
        return [];
    }
    const sanitizedQuery = queryText.toLowerCase();

    try {
        const results = allUsers.filter(user => 
            (user.name.toLowerCase().includes(sanitizedQuery)) ||
            (user.username && user.username.toLowerCase().includes(sanitizedQuery))
        );
        return results;
    } catch (error) {
        console.error("Unexpected error in searchUsers:", error);
        return []; // Return an empty array on any unexpected error.
    }
}
