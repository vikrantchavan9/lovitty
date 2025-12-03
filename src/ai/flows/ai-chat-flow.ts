
'use server';
/**
 * @fileOverview A flow for generating conversational AI replies.
 *
 * - getAiChatReply - A function that generates a reply from the AI character.
 * - AiChatInput - The input type for the getAiChatReply function.
 * - AiChatOutput - The return type for the getAiChatReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const MessageSchema = z.object({
  sender: z.enum(['user', 'other']).describe('Who sent the message.'),
  text: z.string().describe('The content of the message.'),
});

export const AiChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  newMessage: z.string().describe("The user's new message to respond to.")
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

export const AiChatOutputSchema = z.object({
    reply: z.string().describe('The AI character\'s reply.'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;


export async function getAiChatReply(input: AiChatInput): Promise<AiChatOutput> {
  return getAiChatReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatReplyPrompt',
  input: {schema: AiChatInputSchema},
  output: {schema: AiChatOutputSchema},
  prompt: `You are Nishita AI, a friendly, empathetic, and slightly witty AI companion in a chat app called Lovekitty. Your goal is to engage the user in a natural and interesting conversation.

  Here is the conversation history so far:
  {{#each history}}
  - {{sender}}: {{text}}
  {{/each}}

  The user has just sent a new message.
  - user: {{newMessage}}

  Based on this, generate a suitable and engaging reply as Nishita AI. Keep your replies relatively short and conversational.
  `,
});

const getAiChatReplyFlow = ai.defineFlow(
  {
    name: 'getAiChatReplyFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { reply: "Sorry, I'm not sure how to respond to that." };
  }
);
