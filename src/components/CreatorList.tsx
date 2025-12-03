
// src/components/CreatorList.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from './ui/skeleton';
import { MessageSquare, Star, Search, Filter } from 'lucide-react';
import { ALL_VIBES, MAIN_VIBES, type User } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input';
import { getAllCreators, type CreatorProfile } from '@/app/(app)/home/actions';

const UserCardSkeleton = () => (
    <Card className="p-4 flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-28 mt-2" />
        </div>
    </Card>
);

export default function CreatorList() {
    const [users, setUsers] = useState<CreatorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('All Creators');
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const creators = await getAllCreators();
            setUsers(creators);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setIsFilterModalOpen(false); // Close modal on selection
    }

    const filteredUsers = useMemo(() => {
        let sortedUsers: User[] = [...users];

        // Apply sorting based on filter
        switch(selectedFilter) {
            case 'Trending Now':
            case 'Top Picks':
            case 'Recommended':
            case 'Rising Stars':
                // complex sorting would be done on the backend
                sortedUsers.sort((a, b) => b.rating - a.rating); 
                break;
            case 'New Profiles':
                sortedUsers = sortedUsers.filter(u => u.isNew);
                break;
            case 'Verified':
                sortedUsers = sortedUsers.filter(u => u.verified);
                break;
            case 'Online':
                sortedUsers = sortedUsers.filter(u => u.online);
                break;
            case 'Available Now':
                sortedUsers = sortedUsers.filter(u => u.availability === 'Available Now');
                break;
            // Vibe-based filtering
            case 'Cute Vibes':
            case 'Aesthetic':
            case 'Serious Dating':
            case 'Finding Peace':
            case 'Breakup/Sad Support':
            case 'Just Friends':
                sortedUsers = sortedUsers.filter(u => u.vibes && u.vibes.includes(selectedFilter));
                break;
        }

        // Apply search query on top of sorted/filtered users
        if (searchQuery) {
            return sortedUsers.filter(user => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return sortedUsers;

    }, [users, selectedFilter, searchQuery]);

    return (
        <div className="container mx-auto max-w-3xl py-6">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold font-headline text-primary mb-2">Find Your Vibe</h1>
                <p className="text-muted-foreground max-w-md mx-auto">Select a vibe or search to find the perfect person to talk to.</p>
            </div>
            
            <div className="mb-8 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by name..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <h3 className="font-semibold text-lg text-primary/90">Quick Filters</h3>
                 <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {MAIN_VIBES.map((vibe) => (
                        <Button
                            key={vibe.label}
                            variant={selectedFilter === vibe.label ? 'default' : 'outline'}
                            className="rounded-full shrink-0 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                            onClick={() => handleFilterSelect(vibe.label)}
                            size="sm"
                        >
                            <span className="mr-1.5">{vibe.emoji}</span>
                            {vibe.label}
                        </Button>
                    ))}
                    <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                        <DialogTrigger asChild>
                             <Button
                                variant="outline"
                                className="rounded-full shrink-0 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                                size="sm"
                            >
                                <Filter className="mr-1.5 h-4 w-4" />
                                More Filters
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>🎯 Choose Your Filter</DialogTitle>
                            </DialogHeader>
                             <div className="grid grid-cols-2 gap-3 py-4 max-h-[60vh] overflow-y-auto">
                                {ALL_VIBES.map((vibe) => (
                                <Button
                                    key={vibe.label}
                                    variant="outline"
                                    className="h-auto justify-start"
                                    onClick={() => handleFilterSelect(vibe.label)}
                                >
                                    <span className="mr-2 text-base">{vibe.emoji}</span>
                                    {vibe.label}
                                </Button>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <UserCardSkeleton key={i} />)}
                </div>
            ) : filteredUsers.length > 0 ? (
                <div className="space-y-4">
                    {filteredUsers.map(user => (
                        <Card key={user.id} className="p-4 flex items-start gap-4 hover:shadow-lg transition-shadow bg-white rounded-xl shadow-sm">
                             <Avatar className="w-16 h-16">
                                <AvatarImage src={user.photoURL} data-ai-hint="person" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800 font-headline">{user.name}</h3>
                                     <div className="flex items-center text-xs text-muted-foreground">
                                        <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400"/>
                                        <span>{user.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm mt-1">{user.bio}</p>
                                <Button asChild className="mt-2" size="sm">
                                    <Link href={`/profile/${user.id}`}>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        View Profile
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-2xl">
                    <p className="text-xl font-semibold text-muted-foreground">
                       No one matches that filter right now.
                    </p>
                    <p className="text-muted-foreground mt-2">
                       Try selecting 'All Creators' or a different category!
                    </p>
                </div>
            )}
        </div>
    );
}
