import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Sparkles, X, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EasterEggsOverlay: React.FC = () => {
  const [showConstellation, setShowConstellation] = useState(false);
  const [shootingStarPos, setShootingStarPos] = useState({ top: '15%', left: '80%' });
  const [secretMsgIndex, setSecretMsgIndex] = useState(0);

  const secretQuotes = [
    "“The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.” — Helen Keller",
    "“You are a song that I want to listen to over and over again.”",
    "“In the middle of the night, when the rest of the world is quiet, you are my peaceful thought.”",
    "“We were born from stardust, destined to find each other in the dark.”"
  ];

  // Double Click / Double Tap Trigger for Star Light Burst
  useEffect(() => {
    let lastTap = 0;
    const handleTouchOrClick = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        // Double tap detected!
        try {
          confetti({
            particleCount: 35,
            angle: 90,
            spread: 60,
            origin: {
              x: (e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX || window.innerWidth / 2) / window.innerWidth,
              y: (e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY || window.innerHeight / 2) / window.innerHeight,
            },
            colors: ['#f472b6', '#a855f7', '#38bdf8', '#fbbf24'],
          });
        } catch (err) {}
      }
      lastTap = now;
    };

    window.addEventListener('click', handleTouchOrClick);
    return () => window.removeEventListener('click', handleTouchOrClick);
  }, []);

  const triggerShootingStar = () => {
    setSecretMsgIndex((prev) => (prev + 1) % secretQuotes.length);
    setShowConstellation(true);
    try {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.3 },
      });
    } catch (e) {}
  };

  return (
    <>
      {/* Hidden Clickable Shooting Star */}
      <button
        onClick={triggerShootingStar}
        className="fixed top-8 right-12 z-30 opacity-40 hover:opacity-100 transition-opacity p-2 cursor-pointer group"
        title="Secret Shooting Star"
      >
        <Star className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '12s' }} />
        <span className="sr-only font-sans-luxury">Secret Star</span>
      </button>

      {/* Secret Stargazing Modal */}
      <AnimatePresence>
        {showConstellation && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-lg w-full glass-card p-8 rounded-3xl border border-amber-500/30 glow-box-amber text-center flex flex-col items-center"
            >
              <button
                onClick={() => setShowConstellation(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-6">
                <Moon className="w-7 h-7" />
              </div>

              <span className="text-xs font-sans-luxury uppercase tracking-widest text-amber-300/80 mb-2">
                Easter Egg • Secret Constellation
              </span>

              <p className="text-xl font-serif-cormorant italic text-amber-100 leading-relaxed mb-8">
                {secretQuotes[secretMsgIndex]}
              </p>

              <button
                onClick={() => setShowConstellation(false)}
                className="px-8 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-sans-luxury text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Secret
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
