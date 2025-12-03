
'use server';
/**
 * @fileOverview A flow for generating smart replies in a chat conversation.
 *
 * - getSmartReplies - A function that generates contextual smart replies.
 * - SmartReplyInput - The input type for the getSmartReplies function.
 * - SmartReplyOutput - The return type for the getSmartReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const MessageSchema = z.object({
  sender: z.enum(['user', 'other']).describe('Who sent the message.'),
  text: z.string().describe('The content of the message.'),
});

export const SmartReplyInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
});
export type SmartReplyInput = z.infer<typeof SmartReplyInputSchema>;

export const SmartReplyOutputSchema = z.object({
    replies: z.array(z.string()).describe('An array of 3 short, contextual smart replies.'),
});
export type SmartReplyOutput = z.infer<typeof SmartReplyOutputSchema>;

export async function getSmartReplies(input: SmartReplyInput): Promise<SmartReplyOutput> {
  // Don't generate replies for very short conversations
  if (input.history.length < 1) {
    return { replies: [] };
  }
  return getSmartRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartReplyPrompt',
  input: {schema: SmartReplyInputSchema},
  output: {schema: SmartReplyOutputSchema},
  prompt: `You are an AI assistant in a chat app called Lovekitty. Your goal is to help users by suggesting short, relevant, and engaging replies.

  Based on the following conversation history, generate 3 smart replies for the 'user'. The 'other' party is the person they are chatting with.
  The replies should be concise (2-4 words).
  The tone should be friendly, positive, and aligned with the ongoing conversation.
  The last message in the history is the one the user needs to reply to.

  Conversation History:
  {{#each history}}
  - {{sender}}: {{text}}
  {{/each}}

  Generate 3 appropriate smart replies for the 'user'. The last message was from 'other'.
  `,
});

const getSmartRepliesFlow = ai.defineFlow(
  {
    name: 'getSmartRepliesFlow',
    inputSchema: SmartReplyInputSchema,
    outputSchema: SmartReplyOutputSchema,
  },
  async input => {
    // Avoid suggesting replies if the user was the last one to speak.
    const lastMessage = input.history[input.history.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      return { replies: [] };
    }
    
    const {output} = await prompt(input);
    return output || { replies: [] };
  }
);
