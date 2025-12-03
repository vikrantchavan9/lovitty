// src/app/(app)/call/[callId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  AgoraRTCProvider,
  useRTCClient,
  useRemoteUsers,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  RemoteUser,
  LocalUser,
} from 'agora-rtc-react';
import { createClient, type IAgoraRTCClient } from 'agora-rtc-react';
import { Loader2, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

// This is a mock function since Firebase Functions are removed.
// In a real app, this should call your backend to get a token.
async function generateAgoraToken(channelName: string, uid: string | number): Promise<string> {
    console.warn("Using a mock token generator. This is not secure for production.");
    // This is a placeholder. You need a backend service to generate a real token.
    // For now, we will return an empty string and rely on temp tokens if the project supports them.
    // Or, if you have a test token, you could hardcode it here, but that is NOT recommended.
    return ""; // Replace with a call to your backend if you have one.
}


// Use a stable client instance
const agoraClient: IAgoraRTCClient = createClient({ mode: 'rtc', codec: 'vp8' });
const appId = 'c79ca8c31cb14e058dfddb807ac8c72e';

function VideoCallManager() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const callId = params.callId as string;
  const isVideoEnabled = searchParams.get('video') === 'true';

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(isVideoEnabled);

  const { micTrack, isLoading: micLoading } = useLocalMicrophoneTrack(micOn);
  const { cameraTrack, isLoading: cameraLoading } = useLocalCameraTrack(cameraOn);
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    if (!user || !callId) return;

    const fetchToken = async () => {
      try {
        // Replace Firebase function with the mock or your actual backend function
        const generatedToken = await generateAgoraToken(callId, user.id);
        
        // Since the mock returns an empty string, we set token to null.
        // Agora can sometimes work without a token on trial accounts or with temp tokens.
        // For production, a valid token is required.
        if (generatedToken) {
           setToken(generatedToken);
        } else {
           console.warn("No token was generated. The call may fail if your Agora project requires tokens.");
           setToken(null); // Explicitly set to null
        }
      } catch (err: any) {
        console.error('Failed to fetch Agora token:', err);
        setError(`Failed to retrieve access token: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [user, callId]);

  const handleLeave = () => {
    router.back();
  };

  if (loading || !user) {
    return (
      <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg text-muted-foreground">Connecting to call...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <PhoneOff className="h-12 w-12 text-red-500" />
        <p className="text-lg text-red-400">Connection Error</p>
        <p className="text-sm text-muted-foreground max-w-md text-center">{error}</p>
        <Button onClick={handleLeave} variant="secondary">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white relative flex flex-col">
        {/* Main video area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {/* Remote Users */}
             {remoteUsers.map((remoteUser) => (
                <div key={remoteUser.uid} className="bg-black rounded-lg overflow-hidden">
                    <RemoteUser user={remoteUser} playVideo={cameraOn} playAudio={true} className="w-full h-full object-cover" />
                </div>
            ))}
            
            {/* Local User Preview */}
            <div className="bg-black rounded-lg overflow-hidden absolute bottom-24 right-4 h-48 w-36 border-2 border-primary">
                 <LocalUser
                    audioTrack={micTrack}
                    videoTrack={cameraTrack}
                    cameraOn={cameraOn}
                    micOn={micOn}
                    playVideo={cameraOn}
                    playAudio={false} // Muted locally to prevent echo
                    className="w-full h-full object-cover"
                />
            </div>
             {remoteUsers.length === 0 && (
                <div className="md:col-span-2 flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Waiting for others to join...</p>
                </div>
            )}
        </div>


        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/50 flex items-center justify-center gap-4">
            <Button onClick={() => setMicOn((m) => !m)} variant={micOn ? "secondary" : "destructive"} size="lg" className="rounded-full w-16 h-16">
                {micOn ? <Mic /> : <MicOff />}
            </Button>
            {isVideoEnabled && (
                 <Button onClick={() => setCameraOn((c) => !c)} variant={cameraOn ? "secondary" : "destructive"} size="lg" className="rounded-full w-16 h-16">
                    {cameraOn ? <Video /> : <VideoOff />}
                </Button>
            )}
            <Button onClick={handleLeave} variant="destructive" size="lg" className="rounded-full w-24 h-16">
                <PhoneOff />
            </Button>
        </div>
        
        {/* Join Component - This is what connects the user */}
         {user && (
            <LocalUser
                audioTrack={micTrack}
                videoTrack={cameraTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                playVideo={false}
                playAudio={false}
                client={agoraClient}
                joinOptions={{
                    appid: appId,
                    channel: callId,
                    token: token,
                    uid: user.uid
                }}
            />
        )}
    </div>
  );
}

export default function CallPage() {
    return (
        <AgoraRTCProvider client={agoraClient}>
            <VideoCallManager />
        </AgoraRTCProvider>
    );
}
