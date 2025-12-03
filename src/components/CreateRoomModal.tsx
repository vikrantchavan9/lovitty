
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_VIBES } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Globe, Lock } from "lucide-react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [isPrivate, setIsPrivate] = useState(false);
  const { toast } = useToast();

  const handleCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomDetails = Object.fromEntries(formData.entries());
    console.log("Creating Room:", roomDetails);
    toast({
      title: "Room Created! (Simulated)",
      description: `Your room "${roomDetails.roomName}" is ready.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Create a New Room</DialogTitle>
          <DialogDescription>
            Setup your own space to connect with others.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateRoom}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomName" className="text-right">
                Name
              </Label>
              <Input id="roomName" name="roomName" className="col-span-3" placeholder="My Awesome Vibe Session" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vibe" className="text-right">
                Vibe
              </Label>
              <Select name="vibe" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a vibe" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_VIBES.filter(v => v.category === 'vibe').map((vibe) => (
                    <SelectItem key={vibe.label} value={vibe.label}>
                      {vibe.emoji} {vibe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limit" className="text-right">
                Limit
              </Label>
              <Input id="limit" name="limit" type="number" defaultValue="10" min="2" max="40" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="privacy" className="text-right">
                Privacy
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                 <Globe className="h-5 w-5 text-muted-foreground" />
                 <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} name="isPrivate" />
                 <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            {isPrivate && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" name="password" type="password" className="col-span-3" placeholder="Enter a password" required={isPrivate} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
