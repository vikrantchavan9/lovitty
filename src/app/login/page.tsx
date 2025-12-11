
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle, Mail, Lock, Smartphone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.011 36.372 44 30.561 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, loading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    // Page loading simulation
    const timer = setTimeout(() => setPageLoading(false), 1800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleTyping = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let heart = document.createElement("span");
    heart.innerHTML = "💘";
    heart.style.position = "absolute";
    if (target.parentElement) {
      const parentRect = target.parentElement.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      heart.style.left = `${targetRect.right - parentRect.left - 20}px`;
      heart.style.top = `${targetRect.top - parentRect.top - 20}px`;
      heart.style.fontSize = "20px";
      heart.style.animation = "typeHeart 1s forwards ease-out";
      heart.style.pointerEvents = "none";
      target.parentElement.appendChild(heart);
    }
    setTimeout(() => heart.remove(), 900);
  };

  const toggleSound = () => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement;
    if (sound) {
      audio.pause();
    } else {
      audio.play().catch(error => console.log("Audio play failed:", error));
    }
    setSound(!sound);
  };

  const validateForm = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  }

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError(null);
    const result = await signInWithEmail(email, password);
    if (result) {
      setError(result);
    }
    // On success, the AuthContext listener will handle the redirect.
    setIsSubmitting(false);
  };

  if (pageLoading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-200 via-pink-300 to-purple-200">
        <img
          src="/3d-kitty.png"
          className="w-32 h-32 animate-[kittyBounce_1.4s_infinite]"
          alt="Loading kitty"
        />
        <p className="mt-5 text-xl font-semibold text-pink-700">Loading LoveKitty…</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-200 via-pink-300 to-purple-200 relative overflow-hidden">
      {/* FLOATING HEARTS */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="opacity-80"
            style={{
              position: "absolute",
              bottom: "-20px",
              left: `${Math.random() * 100}%`,
              animation: `floatUp ${4 + Math.random() * 4}s infinite`,
              fontSize: `${16 + Math.random() * 26}px`
            }}
          >
            💗
          </span>
        ))}
      </div>

      {/* PAW PRINTS */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="paw-print"
            style={{
              left: `${10 + i * 8}%`,
              bottom: `${i * -30}px`,
              animationDelay: `${i * 0.6}s`
            }}
          >
            🐾
          </div>
        ))}
      </div>

      {/* BACKGROUND MUSIC */}
      <button
        onClick={toggleSound}
        className="absolute top-5 right-5 bg-white/60 backdrop-blur-lg px-4 py-2 rounded-xl shadow-md z-20 hover:bg-white/80 active:scale-95 transition-all"
      >
        {sound ? "🔇 Stop Music" : "🎵 Play Music"}
      </button>
      <audio id="bg-audio" loop>
        <source src="/romantic.mp3" type="audio/mp3" />
      </audio>

      {/* LEFT — LOGIN */}
      <div className="w-full md:w-[40%] h-full flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="relative w-fit">
            <div className="absolute inset-0 rounded-full animate-[kittyPulseGlow_2.6s_infinite]"></div>
            <img
              src="/3d-kitty.png"
              alt="3D Kitty"
              className="
                              w-36 h-36 
                              kitty-3d 
                              animate-[kittyFloatPro_3s_infinite]
                            "
            />
          </div>
          <h1 className="text-5xl font-bold text-pink-700" style={{ fontFamily: "Pacifico" }}>
            LoveKitty
          </h1>
        </div>

        <div className="glow-box w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>

          {error && (
            <Alert variant="destructive" className="mb-4 rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="relative flex items-center border border-pink-200/60 rounded-full px-4 py-3 bg-white/50 transition-all duration-200 focus-within:border-pink-400 focus-within:shadow-sm focus-within:bg-white/70">
              <Mail className="w-5 h-5 text-pink-400 mr-3 flex-shrink-0" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            <div className="relative flex items-center border border-pink-200/60 rounded-full px-4 py-3 bg-white/50 transition-all duration-200 focus-within:border-pink-400 focus-within:shadow-sm focus-within:bg-white/70">
              <Lock className="w-5 h-5 text-pink-400 mr-3 flex-shrink-0" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onInput={handleTyping}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            <button onClick={handleSignIn} disabled={isSubmitting || authLoading} className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-semibold text-base rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting || authLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account? <Link href="/signup" className="text-pink-600 font-semibold hover:underline transition-all">Sign Up</Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-pink-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-pink-200"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              disabled={authLoading || isSubmitting}
              className="w-full border border-pink-200/60 px-4 py-3 rounded-full bg-white/60 flex items-center justify-center gap-3 hover:bg-pink-50 hover:border-pink-300 active:bg-pink-100 transition-all duration-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading && !isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <GoogleIcon className="w-5 h-5" />}
              <span className="text-sm">Sign in with Google</span>
            </button>

            <button className="w-full border border-pink-200/60 px-4 py-3 rounded-full bg-white/60 flex items-center justify-center gap-3 hover:bg-pink-50 hover:border-pink-300 active:bg-pink-100 transition-all duration-200 text-gray-700 font-medium opacity-50 cursor-not-allowed" disabled>
              <Smartphone className="w-5 h-5" />
              <span className="text-sm">Sign in with Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — VIDEO + TEXT */}
      <div className="hidden md:flex w-full md:w-[60%] h-full p-6 md:p-14 flex-col justify-center z-10">
        <div className="glow-box w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-10">
          <video
            src="/your-video.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-pink-800" style={{ fontFamily: "Poppins" }}>
          What is LoveKitty?
        </h1>
        <p className="text-lg text-gray-700 mb-4 leading-8">
          LoveKitty is a playful bonding platform built for real emotional connections
          with reactions, gifts, animations & real-time fun.
        </p>
        <ul className="text-gray-700 text-lg leading-10 list-none p-0">
          <li>💗 Unique romantic-matching engine</li>
          <li>💗 Cute animations & kitty mascots</li>
          <li>💗 Full privacy control</li>
          <li>💗 Floating hearts & soft UI effects</li>
        </ul>
      </div>
    </div>
  );
}
