

// src/app/profile/[userId]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCreatorById, type CreatorProfile } from '@/app/(app)/home/actions';
import { Loader2, Star,Languages, Award, Phone, MessageSquare, Heart, PlayCircle, Clock, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const userId = params.userId as string;

    const [user, setUser] = useState<CreatorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            // If the user is viewing their own profile, redirect to the editable profile page
            if(currentUser && currentUser.id === userId) {
                router.replace('/profile');
                return;
            }

            const fetchUser = async () => {
                const fetchedUser = await getCreatorById(userId);
                setUser(fetchedUser || null);
                setLoading(false);
            };
            fetchUser();
        }
    }, [userId, currentUser, router]);

    const startVideoCall = () => {
        if (!currentUser) return;
        const callId = [currentUser.id, userId].sort().join('_');
        router.push(`/call/${callId}?video=true`);
    };

    const startAudioCall = () => {
        if (!currentUser) return;
        const callId = [currentUser.id, userId].sort().join('_');
        router.push(`/call/${callId}?video=false`);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background p-4">
                <h2 className="text-2xl font-bold">User Not Found</h2>
                <p className="mt-2 text-muted-foreground">This user does not exist or could not be loaded.</p>
                <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-8 space-y-6">
            {/* --- Profile Header --- */}
            <Card className="overflow-hidden rounded-2xl shadow-lg">
                <CardHeader className="p-0">
                     <div className="relative h-48 w-full">
                        <Image src={user.gallery[0]?.url ?? 'https://picsum.photos/seed/profilebg/800/200'} alt="Profile banner" layout="fill" objectFit="cover" data-ai-hint="background pattern" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-end gap-4">
                            <Avatar className="w-24 h-24 border-4 border-background">
                                <AvatarImage src={user.image} alt={user.name} data-ai-hint={user.aiHint} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <div>
                                <h1 className="text-2xl font-bold text-white font-headline">{user.name}, {user.age}</h1>
                                <p className="text-sm text-gray-200">{user.city}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-2 gap-4">
                     <Button onClick={startVideoCall}><Phone className="mr-2"/> Video Call</Button>
                     <Button onClick={startAudioCall} variant="secondary"><MessageSquare className="mr-2"/> Audio Call</Button>
                </CardContent>
            </Card>

             {/* --- About Section --- */}
            <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                    <h2 className="text-xl font-bold font-headline text-primary">About Me</h2>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{user.bio}</p>
                </CardContent>
            </Card>

            {/* --- Details Grid --- */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader><h3 className="font-semibold flex items-center gap-2"><Star className="text-yellow-400"/> Stats</h3></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Rating:</strong> {user.rating.toFixed(1)} / 5.0</p>
                        <p><strong>Cost:</strong> {user.cost} <Heart className="inline h-4 w-4 fill-primary text-primary" /> / min</p>
                    </CardContent>
                </Card>
                 <Card className="rounded-2xl shadow-lg">
                    <CardHeader><h3 className="font-semibold flex items-center gap-2"><Languages className="text-blue-500" /> Languages</h3></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {user.languages.map(lang => <Badge key={lang} variant="secondary">{lang}</Badge>)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* --- Voice Notes --- */}
            {user.voiceNotes.length > 0 && (
                 <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <h2 className="text-xl font-bold font-headline text-primary">Voice Notes</h2>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {user.voiceNotes.map(note => (
                             <div key={note.title} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-pink-50 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <PlayCircle className="text-primary"/>
                                    <p className="font-semibold">{note.title}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{note.duration}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* --- Gallery --- */}
             <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                    <h2 className="text-xl font-bold font-headline text-primary">Gallery</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {user.gallery.map((img, index) => (
                         <div key={index} className="relative aspect-square w-full h-auto rounded-lg overflow-hidden">
                           <Image src={img.url} alt={img.alt} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform" data-ai-hint={img.aiHint} />
                         </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
