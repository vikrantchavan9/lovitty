
"use client"

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DocumentData } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search } from 'lucide-react';
import { searchUsers } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function SearchPage() {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState<DocumentData[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);


  const searchNow = async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        setResults([]);
        setHasSearched(false);
        return;
    };
    setError(null);
    setHasSearched(true);
    startTransition(async () => {
        try {
            // Pass the lowercase query to the server action
            const users = await searchUsers(trimmedQuery.toLowerCase());
            setResults(users);
        } catch (err: any) {
            console.error("Error searching users:", err);
            setError(err.message);
            setResults([]);
        }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQueryText(value);
    searchNow(value);
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-headline text-primary">Find Connections</h1>
            <p className="text-muted-foreground">Search for other users by their unique username.</p>
        </div>
      
        <div className="flex w-full items-center space-x-2 mb-8">
            <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Input
                    value={queryText}
                    onChange={handleInputChange}
                    placeholder="Enter username..."
                    className="pl-10 h-12"
                />
            </div>
             {isPending && <Loader2 className="h-6 w-6 animate-spin" />}
        </div>
        
        {error && (
             <Alert variant="destructive">
                <AlertTitle>Search Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="space-y-4">
            {!isPending && hasSearched && results.length === 0 && !error && (
                 <div className="text-center py-16 bg-card rounded-2xl">
                    <p className="text-xl font-semibold text-muted-foreground">No users found for "{queryText}"</p>
                    <p className="text-muted-foreground mt-2">Try checking the spelling or searching for another user.</p>
                </div>
            )}
             {!isPending && results.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-xl font-semibold">Search Results</h2>
                     {results.map(user => {
                        if (user.id === currentUser?.uid) return null; // Don't show current user in results
                        return (
                            <Card key={user.id}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.photoURL} data-ai-hint="person" />
                                            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-lg">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                                        </div>
                                    </div>
                                    <Button asChild variant="secondary" size="sm">
                                    <Link href={`/profile/${user.id}`}>
                                        View Profile
                                    </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                     })}
                </div>
            )}
            {!isPending && !hasSearched && !error && (
                <div className="text-center py-16 bg-card rounded-2xl">
                    <p className="text-xl font-semibold text-muted-foreground">Search for someone to connect with</p>
                    <p className="text-muted-foreground mt-2">Your search results will appear here as you type.</p>
                </div>
            )}
        </div>
    </div>
  );
}
