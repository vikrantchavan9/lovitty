
// src/context/CallContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import IncomingCallDialog from '@/components/IncomingCallDialog';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// A simplified call type
type Call = {
    id: string;
    callerId: string;
    callerInfo: {
        fullName: string;
        photoURL: string;
    };
    isVideo: boolean;
};

type CallContextType = {
    incomingCall: Call | null;
    setIncomingCall: React.Dispatch<React.SetStateAction<Call | null>>;
};

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    // Mock listener for incoming calls.
    // In a real app, this would use Supabase Realtime to listen for new rows in a 'calls' table
    // where the current user is the receiver.
    useEffect(() => {
        if (!user) return;

        // Example of how a listener might work
        const timer = setTimeout(() => {
            // Let's simulate a call from Priya after 15 seconds for demonstration
            // setIncomingCall({
            //     id: [user.id, 'user-priya'].sort().join('_'),
            //     callerId: 'user-priya',
            //     callerInfo: {
            //         fullName: 'Priya',
            //         photoURL: 'https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-priya.jpg'
            //     },
            //     isVideo: true,
            // });
        }, 15000);

        return () => clearTimeout(timer);

    }, [user, router]);


    return (
        <CallContext.Provider value={{ incomingCall, setIncomingCall }}>
            {children}
            {incomingCall && <IncomingCallDialog call={incomingCall} />}
        </CallContext.Provider>
    );
};

export const useCall = (): CallContextType => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
};
