import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Quote } from 'lucide-react';
import { translations, Language } from '../data/translations';

interface IntroSceneProps {
  sentence: string;
  paragraphs: string[];
  recipientName: string;
  lang: Language;
  onNext: () => void;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  sentence,
  paragraphs,
  recipientName,
  lang,
  onNext,
}) => {
  const t = translations[lang].intro;
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setTypedText('');
    setIsTypingDone(false);

    const timer = setInterval(() => {
      if (index < sentence.length) {
        setTypedText(sentence.slice(0, index + 1));
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [sentence]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 1 }}
        className="max-w-2xl w-full mx-auto p-8 sm:p-12 rounded-3xl glass-card border border-white/10 shadow-2xl relative"
      >
        <Quote className="w-10 h-10 text-purple-400/30 mb-6 mx-auto" />

        {/* Dedicated Recipient Header */}
        <p className="text-center text-xs uppercase tracking-[0.3em] font-sans-luxury text-purple-300/70 mb-4">
          {lang === 'en' ? `Dedicated Specially For ${recipientName}` : `Dipersembahkan Khusus Untuk ${recipientName}`}
        </p>

        {/* Typing Animation Sentence */}
        <h2 className="text-2xl sm:text-4xl font-serif-display font-light text-center leading-relaxed text-white/95 min-h-[120px] sm:min-h-[140px] flex items-center justify-center">
          <span>{typedText}</span>
          {!isTypingDone && (
            <span className="inline-block w-0.5 h-7 ml-1 bg-purple-400 animate-pulse" />
          )}
        </h2>

        {/* Fade in secondary emotional paragraphs once typing completes */}
        {isTypingDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 space-y-4 text-center"
          >
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-base sm:text-lg font-serif-cormorant italic text-white/70 leading-relaxed"
              >
                {p}
              </p>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-8 flex justify-center"
            >
              <button
                onClick={onNext}
                className="group relative px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans-luxury text-sm tracking-wider flex items-center gap-3 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/20"
              >
                <span>{t.next}</span>
                <ArrowRight className="w-4 h-4 text-purple-300 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
