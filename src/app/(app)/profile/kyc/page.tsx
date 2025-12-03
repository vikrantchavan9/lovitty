
// src/app/(app)/profile/kyc/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function KycPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto max-w-xl py-8">
            <Card className="shadow-lg rounded-2xl border-destructive">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                        <ShieldAlert className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="text-3xl font-headline text-destructive">🔐 KYC Verification Disabled</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        This feature is not available because Firebase has been removed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button onClick={() => router.push('/profile')} className="mt-6">
                        Back to Profile
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
