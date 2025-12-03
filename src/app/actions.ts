
// src/app/actions.ts
'use server';

import { evaluateVoiceIntro, EvaluateVoiceIntroInput, EvaluateVoiceIntroOutput } from '@/ai/flows/voice-intro-evaluation';
import { z } from 'zod';

const formSchema = z.object({
  voiceIntroDataUri: z.string().min(1, 'Please upload an audio file.'),
});

export type FormState = {
  message: string;
  evaluation?: EvaluateVoiceIntroOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function handleEvaluateVoiceIntro(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    voiceIntroDataUri: formData.get('voiceIntroDataUri') as string,
  };

  const validatedFields = formSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    return {
      message: "There was an error with your submission.",
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const input: EvaluateVoiceIntroInput = {
      voiceIntroDataUri: validatedFields.data.voiceIntroDataUri,
    };
    const result = await evaluateVoiceIntro(input);

    return {
        message: 'Evaluation successful!',
        evaluation: result,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `Evaluation failed: ${errorMessage}`,
    };
  }
}
