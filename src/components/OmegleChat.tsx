
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
    id: string;
    message: string;
    user_id: string;
    created_at: string;
}

interface OmegleChatProps {
  chatId: string; // Used as the channel name
  onDisconnect: () => void;
  onNextChat: () => void;
}

export default function OmegleChat({ chatId, onDisconnect, onNextChat }: OmegleChatProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const [strangerLeft, setStrangerLeft] = useState(false);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // This is a simplified listener. A real implementation would need a more robust system
        // to handle user presence and distinguish between different Omegle rooms.
        const channel = supabase
            .channel(chatId)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new as Message;
                    // For Omegle, we don't need to filter by chat ID if the channel is unique
                    setMessages((prev) => [...prev, newMessage]);
                    scrollToBottom();
                }
            )
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                 setStrangerLeft(true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

     const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (text.trim() === '' || !user) return;
        
        const { error } = await supabase
            .from("messages")
            .insert([{ user_id: user.id, message: text }]); // We don't need a specific chat_id for this simplified version
        
        if (error) {
            console.error("Failed to send message", error);
        } else {
            setText('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-card border rounded-2xl shadow-lg">
            <div className="flex items-center justify-between p-3 border-b">
                 <div className="flex items-center gap-2">
                    <User className="h-6 w-6 text-primary"/>
                    <div>
                        <p className="font-bold">You're chatting with a stranger</p>
                        {strangerLeft && <p className="text-xs text-destructive">Stranger has disconnected.</p>}
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <Button onClick={onDisconnect} variant="destructive" size="sm">
                        <X className="mr-2 h-4 w-4"/> Disconnect
                    </Button>
                    <Button onClick={onNextChat} variant="secondary" size="sm" disabled={strangerLeft}>
                        Next
                    </Button>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                <Alert>
                    <AlertDescription>
                        You are now connected. Be respectful and have a great chat!
                    </AlertDescription>
                </Alert>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`py-2 px-4 rounded-2xl max-w-[70%] text-white ${
                            msg.user_id === user?.id
                            ? 'self-end bg-primary rounded-br-none'
                            : 'self-start bg-muted-foreground rounded-bl-none'
                        }`}
                    >
                        <p className="text-xs pb-1 opacity-70">{msg.user_id === user?.id ? 'You' : 'Stranger'}</p>
                        {msg.message}
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>
            <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex w-full items-center space-x-2">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={strangerLeft ? "Stranger has left." : "Type a message..."}
                        className="flex-1"
                        disabled={!user || strangerLeft}
                    />
                    <Button type="submit" size="icon" disabled={!text.trim() || !user || strangerLeft}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
