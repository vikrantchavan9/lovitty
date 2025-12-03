
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, Receipt } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function WalletPage() {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        };

        // Since Supabase is removed, we'll just show a default balance.
        setBalance(0);
        setLoading(false);

    }, [user]);

    return (
        <Tabs defaultValue="recharge">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recharge">Recharge</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="recharge">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-2">
                            <Heart className="h-10 w-10 text-primary" />
                        </div>
                        <CardDescription className="text-lg">Your Balance</CardDescription>
                         <CardTitle className="text-5xl font-bold tracking-tighter">
                           {loading ? <Loader2 className="h-12 w-12 mx-auto animate-spin" /> : (
                             <>
                                {balance} <span className="text-2xl text-primary font-medium">Heartbeats</span>
                             </>
                           )}
                        </CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4 text-center">
                        <h3 className="text-lg font-semibold">Recharge Your Balance</h3>
                        <p className="text-muted-foreground">
                            Add more Heartbeats to continue your conversations.
                        </p>
                        <Button disabled>Recharge Now (Coming Soon)</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="history">
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>View your recent wallet activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
                            <p className="text-muted-foreground">No transaction history available.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
