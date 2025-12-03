"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const rewards = [
  "50 Kitty Coins",
  "1 Heartbeat",
  "Sticker Pack",
  "Creator Paid Sticker",
  "Profile Boost",
  "200 Kitty Coins",
  "Mystery Box",
];

export default function SpinWheel({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState("");

   const spin = () => {
     if (spinning) return;

     setSpinning(true);
     setReward(""); // Reset previous reward
     const result = rewards[Math.floor(Math.random() * rewards.length)];

     // Simulate landing on a random degree
     const randomDegree = Math.floor(Math.random() * 360) + 1440; // Spin at least 4 times

     setTimeout(() => {
       setReward(result);
       setSpinning(false);
     }, 3500);
   };

   return (
     <AnimatePresence>
       {open && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
         >
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="bg-white p-6 rounded-3xl w-[350px] shadow-xl relative"
           >
             <button
               onClick={onClose}
               className="absolute right-4 top-4 text-pink-500 font-bold"
             >
               ✕
             </button>

              <h1 className="text-2xl font-bold text-center text-pink-600">
               Spin the Kitty Wheel 🎀
             </h1>

             {/* Arrow */}
             <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-pink-500 mx-auto mt-4 z-10 relative"></div>

              {/* IMAGE-BASED WHEEL */}
            <motion.div
              animate={spinning ? { rotate: 1440 } : {}}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="relative -mt-2 w-64 h-64 mx-auto"
            >
                <img 
                    src="/kitty-wheel.png"
                    alt="Spinning Wheel"
                    className="w-full h-full"
                />
            </motion.div>


              {/* Spin Button */}
             <button
               onClick={spin}
               disabled={spinning}
               className={`mt-6 w-full py-3 rounded-full text-white font-semibold transition ${
                 spinning
                   ? "bg-pink-300"
                   : "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
               }`}
             >
               {spinning ? "Spinning..." : "Spin Now 🎉"}
             </button>

              {/* Reward Popup */}
             <AnimatePresence>
               {reward && !spinning && (
                 <motion.div
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.6, opacity: 0 }}
                   className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-2xl text-center shadow"
                 >
                   <h2 className="text-xl font-bold text-pink-600">
                     You won: {reward}! 🎁
                   </h2>
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 }
