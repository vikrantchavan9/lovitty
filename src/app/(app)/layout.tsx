
// This new layout file will apply to all pages inside the (app) route group.
// It provides a consistent structure with a header for authenticated users.

import { Header } from "@/components/Header";
import { QuickNav } from "@/components/QuickNav";
import { BottomNav } from "@/components/BottomNav";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen min-h-screen bg-gradient-to-b from-[#ffeef4] via-[#ffe4f1] to-[#ffd8ec] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="animate-floating-heart absolute top-10 left-1/4 text-pink-300 text-4xl opacity-40" style={{ animationDelay: '0s' }}>❤️</div>
        <div className="animate-floating-heart absolute top-1/3 left-3/4 text-pink-200 text-3xl opacity-30" style={{ animationDelay: '2s' }}>💕</div>
        <div className="animate-floating-heart absolute top-2/3 left-1/3 text-pink-300 text-5xl opacity-30" style={{ animationDelay: '4s' }}>💗</div>
        <div className="animate-floating-heart absolute top-1/2 left-1/2 text-pink-200 text-2xl opacity-20" style={{ animationDelay: '1s' }}>💖</div>
        <div className="animate-floating-heart absolute top-3/4 left-10 text-pink-300 text-6xl opacity-30" style={{ animationDelay: '5s' }}>❤️</div>
        <div className="animate-floating-heart absolute top-1/4 left-2/3 text-pink-200 text-4xl opacity-40" style={{ animationDelay: '3s' }}>💕</div>
        <div className="animate-floating-heart absolute top-full left-1/2 text-pink-300 text-5xl opacity-20" style={{ animationDelay: '6s' }}>💗</div>
        <div className="animate-floating-heart absolute top-0 left-1/3 text-pink-200 text-3xl opacity-30" style={{ animationDelay: '2.5s' }}>💖</div>
      </div>
      
      <div className="relative h-screen flex flex-col">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Header />
            <QuickNav />
        </div>
        <main className="flex-1 overflow-y-auto pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center">
            <BottomNav />
        </div>
      </div>
    </div>
  );
}
