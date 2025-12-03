// src/components/IncomingCallDialog.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Phone, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCall } from '@/context/CallContext';
import { endCall } from '@/lib/actions/callActions';

type Call = {
    id: string;
    callerId: string;
    callerInfo?: {
        fullName: string;
        photoURL: string;
    }
    isVideo: boolean;
};

export default function IncomingCallDialog({ call }: { call: Call }) {
    const router = useRouter();
    const { toast } = useToast();
    const { setIncomingCall } = useCall();

    const handleAccept = () => {
        setIncomingCall(null);
        router.push(`/call/${call.id}?action=accept&video=${call.isVideo}`);
    };

    const handleReject = async () => {
        try {
            await endCall(call.id);
            toast({ title: "Call Rejected" });
        } catch (error) {
            console.error("Failed to reject call", error);
        } finally {
            setIncomingCall(null);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center">
            <div className="bg-card text-card-foreground rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center gap-4 animate-in fade-in-50 zoom-in-90">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={call.callerInfo?.photoURL} data-ai-hint="person" />
                    <AvatarFallback>{call.callerInfo?.fullName.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-headline">{call.callerInfo?.fullName || 'Someone'}</h2>
                    <p className="text-muted-foreground">is calling you...</p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={handleReject} variant="destructive" size="lg" className="rounded-full w-28 h-16 flex flex-col gap-1">
                        <PhoneOff />
                        <span>Reject</span>
                    </Button>
                    <Button onClick={handleAccept} variant="default" size="lg" className="rounded-full w-28 h-16 flex flex-col gap-1 bg-green-500 hover:bg-green-600">
                        <Phone />
                        <span>Accept</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
