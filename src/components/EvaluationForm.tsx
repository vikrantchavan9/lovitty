"use client";

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef, useState } from 'react';
import { handleEvaluateVoiceIntro, FormState } from '@/app/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle2, FileAudio, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full text-base font-bold py-6">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {pending ? 'Evaluating...' : 'Evaluate My Intro'}
        </Button>
    );
}

export function EvaluationForm() {
    const initialState: FormState = { message: '' };
    const [state, formAction] = useActionState(handleEvaluateVoiceIntro, initialState);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message && state.message !== 'Evaluation successful!') {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: state.message,
            });
        }
    }, [state, toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                setAudioSrc(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="space-y-6">
            <form
                ref={formRef}
                action={formAction}
                className="space-y-4"
            >
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="voice-intro-file">Upload Audio File</Label>
                    <Input id="voice-intro-file" type="file" accept="audio/*" required onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
                    <input type="hidden" name="voiceIntroDataUri" value={audioSrc || ''} />
                </div>
                {fileName && (
                    <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <FileAudio className="h-5 w-5 text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">{fileName}</span>
                        </div>
                        {audioSrc && <audio controls src={audioSrc} className="h-8" />}
                    </div>
                )}
                <SubmitButton />
            </form>

            {state.evaluation && (
                <Card className={`rounded-xl ${state.evaluation.guidelineAdherence ? 'border-green-500' : 'border-red-500'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {state.evaluation.guidelineAdherence ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            )}
                            Evaluation Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Sentiment:</strong> <span className="capitalize font-semibold">{state.evaluation.sentiment}</span></p>
                        <p><strong>Guidelines Adherence:</strong> <span className={`font-semibold ${state.evaluation.guidelineAdherence ? 'text-green-600' : 'text-red-600'}`}>{state.evaluation.guidelineAdherence ? 'Passed' : 'Failed'}</span></p>
                        {!state.evaluation.guidelineAdherence && state.evaluation.reason && (
                             <p><strong>Reason:</strong> <span className="text-red-600">{state.evaluation.reason}</span></p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
