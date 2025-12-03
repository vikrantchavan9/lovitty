
"use client";

import {
  Compass, Flame, Heart, Home, LogOut, MessageSquare, Mic, Search, Settings, Shield, User, Wallet, Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/home", icon: <Home /> },
    { name: "Search", href: "/search", icon: <Search /> },
    { name: "Profile", href: "/profile", icon: <User /> },
    { name: "Explore", href: "/explore", icon: <Compass /> },
    { name: "Swipe Zone", href: "/swipe-zone", icon: <Flame /> },
    { name: "Omegle Chat", href: "/omegle", icon: <Users /> },
    { name: "Chats", href: "/chats", icon: <MessageSquare /> },
    { name: "Evaluate Intro", href: "/evaluate", icon: <Mic /> },
    { name: "Settings", href: "/settings", icon: <Settings /> },
    { name: "Wallet", href: "/wallet", icon: <Wallet /> },
];


export function SiteSidebar() {
  const pathname = usePathname();
  const { userRole, logout } = useAuth();

  return (
    <div className="w-60 h-screen bg-white/50 backdrop-blur-xl border-r border-pink-100 shadow-[0_0_40px_rgba(255,100,150,0.15)] px-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 pt-6 mb-6 px-2">
        <div className="text-pink-500 text-3xl animate-pulse">
            <Heart className="h-8 w-8" />
        </div>
        <span className="text-xl font-bold text-gray-700 glow-text">Lovekitty</span>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
            <Link
            key={item.name}
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 font-medium transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 hover:shadow-[0_4px_20px_rgba(255,100,150,0.25)] hover:translate-x-1 active:scale-[0.98]",
                (pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href))) && "bg-pink-100 text-pink-700 shadow-[0_4px_20px_rgba(255,100,150,0.25)]"
            )}
            >
            <span className="text-xl">{item.icon}</span>
            {item.name}
            </Link>
        ))}
         {userRole === 'admin' && (
             <Link
                href="/admin"
                className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 font-medium transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 hover:shadow-[0_4px_20px_rgba(255,100,150,0.25)] hover:translate-x-1 active:scale-[0.98]",
                    pathname.startsWith('/admin') && "bg-pink-100 text-pink-700 shadow-[0_4px_20px_rgba(255,100,150,0.25)]"
                )}
                >
                <span className="text-xl"><Shield /></span>
                Admin
            </Link>
         )}
      </div>


      {/* Logout Button */}
       <button
            onClick={logout}
            className="
                flex items-center gap-3 px-4 py-3 rounded-xl 
                text-gray-600 font-medium
                transition-all duration-300
                hover:bg-pink-50 hover:text-pink-600
                hover:shadow-[0_4px_20px_rgba(255,100,150,0.25)]
                hover:translate-x-1
                active:scale-[0.98] mt-auto mb-6
            "
        >
            <span className="text-xl"><LogOut /></span>
            Log Out
        </button>
    </div>
  );
}
