import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play } from 'lucide-react';
import { translations, Language } from '../data/translations';

interface LandingSceneProps {
  onBegin: () => void;
  title: string;
  tagline: string;
  lang: Language;
}

export const LandingScene: React.FC<LandingSceneProps> = ({ onBegin, title, tagline, lang }) => {
  const t = translations[lang].landing;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden z-10 select-none">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-teal-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-xl w-full mx-auto px-6 py-12 sm:py-16 rounded-3xl glass-card border border-white/10 shadow-2xl flex flex-col items-center"
      >
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-sans-luxury tracking-widest uppercase text-purple-200/90 mb-8 border border-purple-500/30 glow-box-purple"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span>{lang === 'en' ? 'Interactive Digital Cinematic Experience' : 'Pengalaman Bioskop Digital Interaktif'}</span>
        </motion.div>

        {/* LOGO: BANI */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
          className="text-6xl sm:text-8xl md:text-9xl font-serif-display font-light text-white tracking-[0.2em] uppercase glow-text mb-4 pl-[0.2em]"
        >
          {title}
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xl sm:text-2xl font-serif-cormorant italic text-purple-200/80 mb-12 tracking-wide"
        >
          &ldquo;{tagline}&rdquo;
        </motion.p>

        {/* GLOWING BEGIN BUTTON */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(192, 132, 252, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          onClick={onBegin}
          className="relative group px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 text-white font-sans-luxury font-medium tracking-wider text-base shadow-lg cursor-pointer overflow-hidden flex items-center gap-3 border border-white/20"
        >
          {/* Internal Shimmer */}
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <Play className="w-4 h-4 fill-white text-white transition-transform group-hover:scale-110" />
          <span>{t.enterExperience}</span>
        </motion.button>

        <p className="mt-8 text-xs font-sans-luxury text-white/40 tracking-wider">
          {t.soundNotice}
        </p>
      </motion.div>
    </div>
  );
};
