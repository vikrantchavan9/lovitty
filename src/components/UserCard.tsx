
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { User } from '@/lib/data';

export function UserCard({ user }: { user: User }) {
  return (
    <Card className="w-full p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage src={user.image} alt={user.name} data-ai-hint={user.aiHint} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold font-headline">{user.name}</h3>
                <div className="flex items-center gap-2">
                    {user.isNew && <Badge variant="outline" className="text-primary border-primary">NEW</Badge>}
                    {user.verified && <Badge className="bg-green-500 text-white hover:bg-green-600 border-transparent">Verified</Badge>}
                </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                    <span className="font-semibold text-foreground">{user.rating.toFixed(1)}</span>
                </div>
                <span>|</span>
                <span>Vibe: {user.vibe}</span>
            </div>

            <div className="text-sm text-muted-foreground space-y-1 mb-3">
              <p>Languages: {user.languages.join(', ')}</p>
              <p>Experience: {user.experience} years</p>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-primary flex items-center gap-1">
                    {user.cost} <Heart className="h-4 w-4 fill-primary" /> / min
                </p>
                <Button asChild>
                    <Link href={`/profile/${user.id}`}>
                        View Profile
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </Card>
  );
}
