import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Heart, Share2, Check } from 'lucide-react';
import { globalAudio } from '../audio/AudioEngine';
import { generateShareableLink } from '../utils/storage';
import { StoryData, ThemeId, SoundTrack } from '../types';
import { translations, Language } from '../data/translations';

interface EndingSceneProps {
  endingMessage: string;
  recipientName: string;
  storyData: StoryData;
  currentTheme: ThemeId;
  customTrack?: SoundTrack;
  lang: Language;
  onReturn: () => void;
}

export const EndingScene: React.FC<EndingSceneProps> = ({
  endingMessage,
  recipientName,
  storyData,
  currentTheme,
  customTrack,
  lang,
  onReturn,
}) => {
  const t = translations[lang].ending;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fade out audio slightly for cinematic ending feel
    globalAudio.fadeOutAndStop(8000);

    // Trigger soft confetti burst
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c084fc', '#818cf8', '#38bdf8', '#f472b6'],
      });
    } catch (e) {
      console.warn('Confetti fail:', e);
    }
  }, []);

  const handleShare = () => {
    const shareableUrl = generateShareableLink(storyData, currentTheme, customTrack);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } else if (navigator.share) {
      navigator.share({
        title: 'BANI — Beyond Words',
        text: `Special story for ${recipientName}`,
        url: shareableUrl,
      }).catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-20 z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
      {/* Soft Aurora Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card p-10 sm:p-16 rounded-3xl border border-white/15 shadow-2xl relative flex flex-col items-center w-full"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-8"
        >
          <Heart className="w-8 h-8 fill-rose-300/40 text-rose-300" />
        </motion.div>

        {/* LOGO: BANI */}
        <h1 className="text-4xl sm:text-6xl font-serif-display font-light text-white tracking-[0.2em] uppercase glow-text mb-4">
          BANI
        </h1>

        {/* Ending Message */}
        <p className="text-2xl sm:text-3xl font-serif-cormorant italic text-purple-100/90 leading-relaxed mb-10">
          &ldquo;{endingMessage}&rdquo;
        </p>

        <p className="text-xs font-sans-luxury text-white/50 tracking-widest uppercase mb-10">
          {lang === 'en' ? `For ${recipientName} • Forever and Always` : `Untuk ${recipientName} • Selamanya Dan Abadi`}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onReturn}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans-luxury text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-300" />
            <span>{t.replay}</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-sans-luxury text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/30 border border-white/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200">{t.copied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-white" />
                <span>{t.share}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
