// src/ai/flows/voice-intro-evaluation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for evaluating voice intro profiles.
 *
 * - evaluateVoiceIntro - A function that evaluates voice intro profiles for sentiment and guideline adherence.
 * - EvaluateVoiceIntroInput - The input type for the evaluateVoiceIntro function.
 * - EvaluateVoiceIntroOutput - The return type for the evaluateVoiceIntro function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateVoiceIntroInputSchema = z.object({
  voiceIntroDataUri: z
    .string()
    .describe(
      "A voice intro profile, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EvaluateVoiceIntroInput = z.infer<typeof EvaluateVoiceIntroInputSchema>;

const EvaluateVoiceIntroOutputSchema = z.object({
  sentiment: z
    .string() // Could be 'positive', 'negative', or 'neutral'
    .describe('The overall sentiment of the voice intro.'),
  guidelineAdherence: z
    .boolean()
    .describe(
      'Whether the voice intro adheres to community guidelines (e.g., no offensive content).'
    ),
  reason: z
    .string()
    .optional()
    .describe(
      'The reason for guideline non-adherence, if applicable. If the intro adheres to guidelines, this field is omitted.'
    ),
});
export type EvaluateVoiceIntroOutput = z.infer<typeof EvaluateVoiceIntroOutputSchema>;

export async function evaluateVoiceIntro(
  input: EvaluateVoiceIntroInput
): Promise<EvaluateVoiceIntroOutput> {
  return evaluateVoiceIntroFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateVoiceIntroPrompt',
  input: {schema: EvaluateVoiceIntroInputSchema},
  output: {schema: EvaluateVoiceIntroOutputSchema},
  prompt: `You are an AI moderator tasked with evaluating voice intro profiles for a social app.

  Analyze the provided voice intro and determine its sentiment (positive, negative, or neutral).
  Also, assess whether the intro adheres to community guidelines. The guidelines prohibit offensive language, hate speech, and any form of harassment.

  Voice Intro: {{media url=voiceIntroDataUri}}

  Output should be in JSON format. If the voice intro does not adhere to community guidelines, provide a brief reason.
  `,
});

const evaluateVoiceIntroFlow = ai.defineFlow(
  {
    name: 'evaluateVoiceIntroFlow',
    inputSchema: EvaluateVoiceIntroInputSchema,
    outputSchema: EvaluateVoiceIntroOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
