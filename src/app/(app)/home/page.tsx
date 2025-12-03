

'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, DollarSign, Users, Crown, Gift, Heart, MessageCircle, Star, Home, Compass, Search, User, Flame, Users as UsersIcon, MicV2, Settings, Wallet } from 'lucide-react';
import SpinWheel from "@/components/SpinWheel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { QuickNav } from "@/components/QuickNav";

// LOVekitty Gen-Z Dashboard
// - React + Tailwind CSS + Framer Motion
// - Drop this single-file component into a page (e.g. pages/index.tsx or app/page.tsx)
// - Make sure Tailwind and Framer Motion are installed
//    npm i framer-motion
// - Add Tailwind config if not present
// - Optional: add lottie-react for micro-animations
//    npm i lottie-react

// Notes for integration:
// - Replace placeholder data / handlers with real API calls (Supabase, REST, etc.)
// - Avatar images can be remote or local assets
// - This file focuses on UI + animations + ready-to-wire handlers

const creatorsSeed = [
  { id: 1, name: "Nishita AI", tag: "Deep Convos", rating: 5.0, bio: "I'm your friendly AI companion, ready to explore any topic with you." },
  { id: 2, name: "Aisha", tag: "Deep Convos", rating: 4.9, bio: "Here for meaningful conversations and genuine connections." },
  { id: 3, name: "Priya", tag: "Flirt & Fun", rating: 4.8, bio: "Let's laugh, share stories, and have a great time together!" },
  { id: 4, name: "Sneha", tag: "Relationship Talk", rating: 4.6, bio: "Navigating the ups and downs of relationships? Let's talk it through." },
];

const vibeChips = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "work", label: "Work-Life Balance", emoji: "🔔" },
  { id: "serious", label: "Serious Dating", emoji: "💍" },
  { id: "deep", label: "Deep Convos", emoji: "🧠" },
  { id: "peace", label: "Finding Peace", emoji: "🕊️" },
];



function NeonButton({ children, onClick, className = "" }: {children: React.ReactNode, onClick?: () => void, className?: string}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
      onClick={onClick}
      className={
        "relative inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold shadow-neon transition-all " +
        className
      }
    >
      <span className="z-10">{children}</span>
      <span className="absolute inset-0 rounded-full blur-md opacity-30 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400" />
    </motion.button>
  );
}

function HeroActions({ onOpenRooms, onSpin }: { onOpenRooms: () => void, onSpin: () => void }) {
  return (
    <section className="px-4 md:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-4 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1 w-full">
            <h1 className="glow-text text-3xl md:text-4xl font-extrabold text-pink-600">Welcome back, friend!</h1>
            <p className="text-gray-400 mt-2">What would you like to do today?</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl p-4 bg-white/50 backdrop-blur-md shadow-card flex items-center gap-4 cursor-pointer hover:bg-pink-50 active:bg-pink-100 transition-colors" onClick={onOpenRooms}>
                <div className="p-3 rounded-full bg-pink-50 text-pink-500 text-2xl">❤️</div>
                <div>
                  <div className="text-lg font-semibold">Start Vibe Session</div>
                  <div className="text-xs text-gray-400">Find instant connections</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl p-4 bg-white/50 backdrop-blur-md shadow-card flex items-center gap-4 cursor-pointer hover:bg-pink-50 active:bg-pink-100 transition-colors">
                <div className="p-3 rounded-full bg-purple-50 text-purple-500 text-2xl">💬</div>
                <div>
                  <div className="text-lg font-semibold">Instant Chat</div>
                  <div className="text-xs text-gray-400">Send a vibe request</div>
                </div>
              </motion.div>
               <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl p-4 bg-white/50 backdrop-blur-md shadow-card flex items-center gap-4 cursor-pointer hover:bg-pink-50 active:bg-pink-100 transition-colors">
                <div className="p-3 rounded-full bg-green-50 text-green-500"><DollarSign /></div>
                <div>
                  <div className="text-lg font-semibold">Start Paid Chat</div>
                  <div className="text-xs text-gray-400">Connect with top creators</div>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl p-4 bg-white/50 backdrop-blur-md shadow-card flex items-center gap-4 cursor-pointer hover:bg-pink-50 active:bg-pink-100 transition-colors">
                <div className="p-3 rounded-full bg-yellow-50 text-yellow-500 text-2xl">💫</div>
                <div>
                  <div className="text-lg font-semibold">Explore Creators</div>
                  <div className="text-xs text-gray-400">Pick a creator, view profile</div>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl p-4 bg-white/50 backdrop-blur-md shadow-card flex items-center gap-4 cursor-pointer hover:bg-pink-50 active:bg-pink-100 transition-colors" onClick={onOpenRooms}>
                <div className="p-3 rounded-full bg-blue-50 text-blue-500"><Users /></div>
                <div>
                  <div className="text-lg font-semibold">Join Live Groups</div>
                  <div className="text-xs text-gray-400">Chat with multiple people</div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="w-full md:w-64 flex-shrink-0 mt-6 md:mt-0">
            <div className="relative">
              <motion.div
                className="rounded-2xl bg-white/50 backdrop-blur-md p-4 shadow-xl"
              >
                <div className="text-sm font-semibold text-pink-500">Daily Boost</div>
                <div className="mt-3 text-2xl font-bold">Spin & Win</div>
                <NeonButton onClick={onSpin} className="mt-4 w-full">Spin Now</NeonButton>
              </motion.div>
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 opacity-60 filter blur-2xl" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FloatingAvatars({ creators }: {creators: typeof creatorsSeed}) {
  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-pink-600">Top Creators</h3>
        <a className="text-pink-400 font-semibold">View All →</a>
      </div>

       <div className="mt-6 overflow-x-auto flex gap-4 snap-x snap-mandatory scrollbar-hide py-2 -mx-4 px-4">
        {creators.map((c, i) => (
          <motion.div
            key={c.id}
            className="min-w-[60%] sm:min-w-[40%] md:min-w-[22%] snap-center bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-neon flex flex-col items-center gap-4"
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center text-xl font-bold text-pink-600">{c.name.charAt(0)}</div>
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-gray-400">{c.tag}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function VibeChips({ active, setActive }: {active: string, setActive: (id: string) => void}) {
  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {vibeChips.map((chip) => (
          <motion.button
            key={chip.id}
            onClick={() => setActive(chip.id)}
            whileTap={{ scale: 0.95 }}
            className={`whitespace-nowrap px-4 py-2 rounded-full border transition-colors ${
              active === chip.id ? "bg-pink-500 text-white" : "bg-white/50 backdrop-blur-md hover:bg-pink-50"
            }`}
          >
            <span className="mr-2">{chip.emoji}</span>
            {chip.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function CreatorList({ creators }: {creators: typeof creatorsSeed}) {
  return (
    <div className="px-4 md:px-8 pb-16">
      <div className="space-y-6">
        {creators.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-xl bg-white/50 backdrop-blur-md p-6 shadow-card flex items-start gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center font-bold text-pink-600">{c.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{c.name}</div>
                  <div className="text-sm text-gray-400">{c.tag}</div>
                </div>
                <div className="text-sm text-yellow-500 font-bold">⭐ {c.rating}</div>
              </div>

              <p className="mt-3 text-gray-500">{c.bio}</p>

              <div className="mt-4 flex gap-3">
                <NeonButton className="px-4">View Profile</NeonButton>
                <NeonButton className="px-4 bg-gradient-to-r from-purple-500 to-blue-400">Send Vibe</NeonButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SwipeDeck({ cards, onLike }: {cards: typeof creatorsSeed, onLike: (card: any) => void}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [cards]);

  const next = () => setIndex((s) => Math.min(s + 1, cards.length - 1));
  const prev = () => setIndex((s) => Math.max(s - 1, 0));

  if (!cards.length) return null;

  const card = cards[index];

  return (
    <div className="px-4 md:px-8 py-8">
       <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory scrollbar-hide py-2 -mx-4 px-4">
        {cards.map((card, i) => (
             <motion.div
                key={card.id}
                className="min-w-[90%] sm:min-w-[70%] md:min-w-[60%] snap-center"
              >
                <div
                  className="rounded-2xl bg-white/50 backdrop-blur-md p-6 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center font-bold text-pink-600">{card.name.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xl">{card.name}</div>
                          <div className="text-sm text-gray-400">{card.tag}</div>
                        </div>
                        <div className="text-sm text-yellow-500">⭐ {card.rating}</div>
                      </div>

                      <p className="mt-3 text-gray-500">{card.bio || "This creator loves deep convos and chill vibes."}</p>

                      <div className="mt-4 flex gap-3">
                        <NeonButton onClick={() => onLike(card)} className="px-5">Send Vibe</NeonButton>
                        <button onClick={next} className="px-4 py-2 rounded-full border hover:bg-gray-100 active:bg-gray-200 transition-colors">Skip</button>
                      </div>
                    </div>
                  </div>
                </div>
            </motion.div>
        ))}
       </div>
    </div>
  );
}

function LiveRoomModal({ open, onClose }: { open: boolean, onClose: () => void}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Join a Live Vibe Room</h3>
                <p className="text-sm text-gray-400">Rooms are live — connect with people instantly</p>
              </div>
              <button onClick={onClose} className="text-pink-500 font-bold hover:text-pink-700">Close</button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 bg-pink-50">
                <div className="font-semibold">Quick Match Room</div>
                <div className="text-sm text-gray-400 mt-2">Random 1-on-1 pairing — 2 minute timer</div>
                <NeonButton className="mt-4">Join</NeonButton>
              </div>
              <div className="rounded-xl p-4 bg-purple-50">
                <div className="font-semibold">Group Vibe</div>
                <div className="text-sm text-gray-400 mt-2">Join a group and share stories</div>
                <NeonButton className="mt-4">Join</NeonButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LovekittyDashboard() {
  const [activeVibe, setActiveVibe] = useState("all");
  const [creators, setCreators] = useState(creatorsSeed);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [spinOpen, setSpinOpen] = useState(false);

  useEffect(() => {
    // In real app: fetch creators from API here
  }, []);

  const handleLike = (card: any) => {
    // Hook to send vibe — integrate supabase or your API
    console.log("Send vibe to", card.name);
    // Show small toast or confetti effect
  };

  return (
    <div className="min-h-screen text-gray-800">
      <main>
          <HeroActions onOpenRooms={() => setRoomsOpen(true)} onSpin={() => setSpinOpen(true)} />
          <FloatingAvatars creators={creators} />
          <VibeChips active={activeVibe} setActive={setActiveVibe} />
          <SwipeDeck cards={creators} onLike={handleLike} />
          <CreatorList creators={creators} />
      </main>

      <LiveRoomModal open={roomsOpen} onClose={() => setRoomsOpen(false)} />
      <SpinWheel open={spinOpen} onClose={() => setSpinOpen(false)} />
    </div>
  );
}

    

    



