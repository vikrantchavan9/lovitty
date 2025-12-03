import { EvaluationForm } from "@/components/EvaluationForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function EvaluatePage() {
    return (
        <div className="container mx-auto max-w-2xl py-8">
            <Card className="shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                        <Mic className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Voice Intro Evaluation</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Upload your voice intro to see if it meets our community guidelines.
                        Our AI will check it for sentiment and safety.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EvaluationForm />
                </CardContent>
            </Card>
        </div>
    );
}
