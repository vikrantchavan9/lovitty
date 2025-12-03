// src/app/(app)/swipe-zone/page.tsx
"use client";

import { Flame } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SwipeZonePage() {
  
  return (
      <div className="text-center p-10 bg-card rounded-2xl shadow-lg">
        <div className="relative inline-block">
            <Flame className="h-16 w-16 mx-auto text-primary mb-4" />
            <div className="absolute top-0 left-0 w-full h-full bg-primary/20 animate-ping rounded-full -z-10"></div>
        </div>
        <h2 className="text-2xl font-bold font-headline">Find Your Match!</h2>
        <p className="text-muted-foreground mt-2 mb-6">Swipe right on profiles you like, and left on those you don't.</p>
        <Card className="w-full max-w-sm mx-auto h-64 flex items-center justify-center bg-muted/50">
            <CardContent className="text-center">
                <p className="text-muted-foreground">Swipe feature coming soon!</p>
            </CardContent>
        </Card>
         <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" size="lg" className="rounded-full h-16 w-16 shadow-lg">❌</Button>
            <Button variant="default" size="lg" className="rounded-full h-20 w-20 shadow-lg text-2xl">💖</Button>
            <Button variant="outline" size="lg" className="rounded-full h-16 w-16 shadow-lg">⭐</Button>
        </div>
      </div>
  );
}
