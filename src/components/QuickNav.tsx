
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Compass, Search, MessageCircle, User, Flame, Users as UsersIcon, Settings, Wallet, Menu, X, LogOut } from 'lucide-react';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "./ui/separator";

const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/chats", icon: MessageCircle, label: "Chats" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/swipe-zone", icon: Flame, label: "Swipe" },
    { href: "/omegle", icon: UsersIcon, label: "Omegle" },
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
];

export function QuickNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative px-4 py-2" ref={navRef}>
            <div className="flex items-center justify-between">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/50 hover:bg-pink-50"
                >
                    {isOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
                </Button>

                <div className="flex-1 flex justify-center">
                   <Image src="/3d-kitty.png" alt="Lovekitty Banner" width={32} height={32} className="h-8 w-auto" />
                </div>
            </div>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute left-4 top-14 w-64 bg-white/80 backdrop-blur-lg border border-pink-100 rounded-2xl shadow-card p-2 z-50"
                    >
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link href={item.href} key={item.label} className="shrink-0" onClick={() => setIsOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            className={cn(
                                                "flex flex-row items-center justify-start gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors",
                                                isActive ? "bg-pink-100" : "bg-transparent",
                                                "hover:bg-pink-50 active:bg-pink-500 active:text-white active:[&>svg]:text-white"
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5 text-pink-500", isActive && "text-pink-700")} />
                                            <span className={cn("text-sm font-medium text-gray-700", isActive && "text-pink-700")}>{item.label}</span>
                                        </motion.div>
                                    </Link>
                                )
                            })}
                             <Separator className="my-1" />
                             <motion.div
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { logout(); setIsOpen(false); }}
                                className="flex flex-row items-center justify-start gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors text-red-500 hover:bg-red-50"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="text-sm font-medium">Logout</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
