
'use server';

import { getSmartReplies, SmartReplyInput } from '@/ai/flows/smart-reply-flow';
import { getAiChatReply, AiChatInput } from '@/ai/flows/ai-chat-flow';

// All Firebase logic has been removed from this file.
// The functions now throw errors as they are no longer functional.

export async function getSmartRepliesAction(
  messages: any[],
  currentUserId: string
): Promise<string[]> {
  // AI functionality can remain, but it won't be called since sendMessage is disabled.
  return [];
}

export async function sendMessage({ chatId, text }: { chatId: string, text: string }): Promise<void> {
    throw new Error('Chat functionality is disabled because Firebase has been removed.');
}
