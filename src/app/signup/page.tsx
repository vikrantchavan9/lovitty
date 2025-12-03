
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle, Mail, Lock, User, VenetianMask } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SignUpPage() {
    const { signUpWithEmailAndPassword, loading: authLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const validateForm = () => {
      if (!name || !email || !password || !confirmPassword || !gender) {
        setError("Please fill in all fields.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return false;
      }
      setError(null);
      return true;
    }

    const handleSignUp = async () => {
      if (!validateForm()) return;
      setIsSubmitting(true);
      setError(null);
      const result = await signUpWithEmailAndPassword(email, password, name, gender!);
      if (result) {
        setError(result);
      }
      // On success, the AuthContext listener will handle the redirect.
      setIsSubmitting(false);
    };
  
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-200 via-pink-300 to-purple-200 relative overflow-hidden py-12">
            {/* LEFT — SIGNUP FORM */}
            <div className="w-full md:w-[40%] flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-fit">
                        <img src="/3d-kitty.png" alt="3D Kitty" className="w-24 h-24" />
                    </div>
                    <h1 className="text-5xl font-bold text-pink-700" style={{ fontFamily: "Pacifico" }}>
                        LoveKitty
                    </h1>
                </div>

                <div className="glow-box w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Create Account</h2>
                    
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="relative flex items-center border border-pink-200 rounded-full p-3 bg-white/50">
                            <User className="w-5 h-5 text-pink-400 mr-3" />
                            <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" />
                        </div>
                        <div className="relative flex items-center border border-pink-200 rounded-full p-3 bg-white/50">
                            <Mail className="w-5 h-5 text-pink-400 mr-3" />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" />
                        </div>
                        <div className="relative flex items-center border border-pink-200 rounded-full p-3 bg-white/50">
                            <Lock className="w-5 h-5 text-pink-400 mr-3" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" />
                        </div>
                         <div className="relative flex items-center border border-pink-200 rounded-full p-3 bg-white/50">
                            <Lock className="w-5 h-5 text-pink-400 mr-3" />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" />
                        </div>

                         <div className="relative flex items-center border border-pink-200 rounded-full p-3 bg-white/50">
                             <VenetianMask className="w-5 h-5 text-pink-400 mr-3" />
                             <RadioGroup onValueChange={(value) => setGender(value as 'male' | 'female')} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                </div>
                            </RadioGroup>
                         </div>
                        
                        <button onClick={handleSignUp} disabled={isSubmitting || authLoading} className="w-full py-3 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-bold text-lg rounded-full shadow-lg transition-all transform hover:scale-105 flex justify-center items-center">
                          {isSubmitting || authLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                        </button>
                    </div>

                    <p className="text-sm text-center mt-6 text-gray-600">
                        Already have an account? <Link href="/login" className="text-pink-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
