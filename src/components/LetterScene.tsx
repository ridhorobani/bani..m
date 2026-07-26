import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Feather, RefreshCw } from 'lucide-react';
import { translations, Language } from '../data/translations';

interface LetterSceneProps {
  letterContent: string;
  recipientName: string;
  lang: Language;
  onNext: () => void;
}

export const LetterScene: React.FC<LetterSceneProps> = ({
  letterContent,
  recipientName,
  lang,
  onNext,
}) => {
  const t = translations[lang].letter;
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState<number>(20); // ms per character
  const letterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    setIsDone(false);

    const interval = setInterval(() => {
      if (i < letterContent.length) {
        setDisplayedText(letterContent.slice(0, i + 1));
        i++;
        if (letterRef.current && i % 20 === 0) {
          letterRef.current.scrollTop = letterRef.current.scrollHeight;
        }
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [letterContent, speed]);

  const handleSkip = () => {
    setDisplayedText(letterContent);
    setIsDone(true);
  };

  return (
    <div className="relative min-h-screen px-4 py-16 z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
      {/* Scene Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-sans-luxury tracking-widest uppercase text-purple-200/90 mb-3 border border-purple-500/20">
          <Feather className="w-3.5 h-3.5 text-purple-300" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white">
          {t.title} {recipientName}
        </h2>
      </motion.div>

      {/* Parchment/Glass Letter Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full glass-card p-6 sm:p-12 rounded-3xl border border-white/15 shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Soft Background Watermark */}
        <div className="absolute right-6 bottom-6 opacity-5 pointer-events-none">
          <Feather className="w-64 h-64 text-white" />
        </div>

        {/* Speed Controls & Skip */}
        <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-white/10 text-xs font-sans-luxury text-white/60 gap-4">
          <div className="flex items-center gap-2">
            <span>{t.typingSpeed}</span>
            <button
              onClick={() => setSpeed(40)}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${speed === 40 ? 'bg-purple-600 text-white' : 'bg-white/10'}`}
            >
              {t.slow}
            </button>
            <button
              onClick={() => setSpeed(20)}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${speed === 20 ? 'bg-purple-600 text-white' : 'bg-white/10'}`}
            >
              {t.normal}
            </button>
            <button
              onClick={() => setSpeed(8)}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${speed === 8 ? 'bg-purple-600 text-white' : 'bg-white/10'}`}
            >
              {t.fast}
            </button>
          </div>

          {!isDone && (
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{t.skipText}</span>
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Letter Body Text */}
        <div
          ref={letterRef}
          className="max-h-[60vh] overflow-y-auto pr-4 scroll-smooth"
        >
          <div className="font-serif-cormorant italic text-2xl sm:text-4xl text-amber-100/95 leading-relaxed whitespace-pre-wrap tracking-wide glow-text">
            {displayedText}
            {!isDone && (
              <span className="inline-block w-0.5 h-8 ml-1 bg-amber-300 animate-pulse" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Next Scene Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <button
          onClick={onNext}
          className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-sans-luxury text-sm tracking-wider flex items-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/25 border border-white/20"
        >
          <span>{t.next}</span>
          <ArrowRight className="w-4 h-4 text-purple-200 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
};
