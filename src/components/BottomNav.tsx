
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, MessageCircle, Phone, Tv } from 'lucide-react';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/chats", icon: MessageCircle, label: "Chats" },
    { href: "/explore", icon: Phone, label: "Call" },
    { href: "/live", icon: Tv, label: "Live" },
];

export function BottomNav() {
    const pathname = usePathname();

    const handleLiveClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert("Live Rooms are under construction. A demo preview is available on the desktop version.");
    };

    return (
        <section className="px-4">
            <div className="relative rounded-full bg-white/50 backdrop-blur-md shadow-card border border-pink-100 p-2">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none rounded-l-full" />
                <div className="flex gap-1 overflow-x-auto pb-0 -mx-4 px-4 scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isLiveButton = item.label === "Live";

                        return (
                            <Link 
                                href={item.href} 
                                key={item.label} 
                                className="shrink-0"
                                onClick={isLiveButton ? handleLiveClick : undefined}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "flex flex-row items-center justify-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-colors",
                                        "bg-pink-100",
                                        isActive ? "text-pink-700" : "text-gray-700",
                                        "hover:bg-pink-50 active:bg-pink-500 active:text-white active:[&>svg]:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4 text-pink-500", isActive && "text-pink-700")} />
                                    <span className={cn("text-sm font-medium")}>{item.label}</span>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
                 <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none rounded-r-full" />
            </div>
        </section>
    );
}
