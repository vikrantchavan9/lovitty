
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const fixedAmounts = [100, 200, 500, 1000];

export default function ChatsPage() {
    const { user, loading: userLoading } = useAuth();
    const { toast } = useToast();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching wallet balance
        setLoading(true);
        setTimeout(() => {
            setBalance(120); // Mock balance
            setLoading(false);
        }, 800);
    }, []);

    const refreshBalance = () => {
        setLoading(true);
        setTimeout(() => {
            setBalance(prev => prev + Math.floor(Math.random() * 50)); // Simulate refresh
            setLoading(false);
            toast({ title: "Balance refreshed!"});
        }, 500);
    };

    const handleTopup = (amount: number) => {
        toast({
            title: `Top-up ₹${amount}`,
            description: "Payment gateway integration is coming soon!",
        });
    }

    if (userLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto max-w-4xl py-8">
             <Tabs defaultValue="friends" className="w-full">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-headline text-primary">Inbox & Wallet</h1>
                    <TabsList>
                        <TabsTrigger value="friends">Friends</TabsTrigger>
                        <TabsTrigger value="paid">Paid</TabsTrigger>
                    </TabsList>
                </header>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="text-primary"/>
                            My Wallet
                        </CardTitle>
                        <CardDescription>Your current balance and top-up options.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-muted-foreground">Current Balance</p>
                            {loading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-primary mt-1" />
                            ) : (
                                <p className="text-4xl font-bold">₹{balance.toFixed(2)}</p>
                            )}
                        </div>
                        <Button onClick={refreshBalance} variant="ghost" size="icon" disabled={loading}>
                            <RefreshCw className={loading ? 'animate-spin' : ''}/>
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <TabsContent value="friends">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Friends Inbox</CardTitle>
                                    <CardDescription>Your conversations with friends.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                                    <p>Friends chat UI coming soon.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="paid">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Paid Inbox</CardTitle>
                                    <CardDescription>Your conversations with creators.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                                    <p>Paid chat UI coming soon.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                    <aside>
                        <Card>
                            <CardHeader>
                                <CardTitle>Top-up Wallet</CardTitle>
                                <CardDescription>Select an amount to add funds.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                {fixedAmounts.map(amount => (
                                    <Button key={amount} variant="outline" onClick={() => handleTopup(amount)}>
                                        ₹{amount}
                                    </Button>
                                ))}
                                <Button className="col-span-2" onClick={() => handleTopup(2000)}>
                                    Stripe ₹2000
                                </Button>
                                <Button className="col-span-2" variant="secondary" onClick={() => handleTopup(2000)}>
                                    Razorpay ₹2000
                                </Button>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </Tabs>
        </div>
    );
}
