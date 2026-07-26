import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SecretContent } from '../types';
import { Lock, Key, Eye, Play, Music, Sparkles, ArrowRight, ShieldCheck, Video } from 'lucide-react';
import { translations, Language } from '../data/translations';

interface SecretSceneProps {
  secret: SecretContent;
  lang: Language;
  onNext: () => void;
}

export const SecretScene: React.FC<SecretSceneProps> = ({ secret, lang, onNext }) => {
  const t = translations[lang].secret;
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!secret.isPasswordProtected);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPlayingSecretAudio, setIsPlayingSecretAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.password || passwordInput.trim() === secret.password) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg(t.wrongPass);
    }
  };

  const toggleSecretAudio = () => {
    if (!secret.hiddenAudioUrl) return;
    if (isPlayingSecretAudio && audioObj) {
      audioObj.pause();
      setIsPlayingSecretAudio(false);
    } else {
      const newAudio = new Audio(secret.hiddenAudioUrl);
      newAudio.play();
      setAudioObj(newAudio);
      setIsPlayingSecretAudio(true);
      newAudio.onended = () => setIsPlayingSecretAudio(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-20 z-10 max-w-4xl mx-auto flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* LOCKED STATE */
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 glow-box-purple">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-display text-white mb-2">
              {t.title}
            </h2>
            <p className="text-xs font-sans-luxury text-white/60 mb-6">
              {t.lockedSub}
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder={t.enterPass}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 font-sans-luxury text-sm text-center tracking-widest"
                />
                <Key className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-sans-luxury animate-pulse">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-sans-luxury text-sm tracking-wider font-medium cursor-pointer shadow-lg hover:shadow-purple-500/30 transition-all border border-white/20"
              >
                {t.unlockBtn}
              </button>
            </form>

            <button
              onClick={() => setIsUnlocked(true)}
              className="mt-6 text-xs font-sans-luxury text-purple-300/70 hover:text-purple-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.previewBtn}</span>
            </button>

            {secret.unlockedHint && (
              <p className="mt-4 text-[11px] font-sans-luxury text-white/40 italic">
                {secret.unlockedHint}
              </p>
            )}
          </motion.div>
        ) : (
          /* UNLOCKED STATE */
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-sans-luxury tracking-widest uppercase text-emerald-300 mb-3 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.unlockedBadge}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white">
                {t.unlockedTitle}
              </h2>
            </div>

            {/* Secret Message Card */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-purple-500/30 glow-box-purple text-center">
              <Sparkles className="w-8 h-8 text-purple-300 mx-auto mb-4" />
              <p className="text-xl sm:text-2xl font-serif-cormorant italic text-purple-100 leading-relaxed">
                &ldquo;{secret.hiddenMessage}&rdquo;
              </p>
            </div>

            {/* Hidden Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hidden Image */}
              {secret.hiddenImageUrl && (
                <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col items-center">
                  <span className="text-xs font-sans-luxury uppercase tracking-widest text-white/60 mb-3 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    {t.secretPhoto}
                  </span>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={secret.hiddenImageUrl}
                      alt="Secret"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* Hidden Video */}
              {secret.hiddenVideoUrl && (
                <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col items-center">
                  <span className="text-xs font-sans-luxury uppercase tracking-widest text-white/60 mb-3 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    {t.secretVideo}
                  </span>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <video
                      src={secret.hiddenVideoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hidden Voice/Audio Message */}
            {secret.hiddenAudioUrl && (
              <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-600/30 text-purple-300">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif-display text-white">{t.voiceNote}</h4>
                  </div>
                </div>

                <button
                  onClick={toggleSecretAudio}
                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-sans-luxury text-xs tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Play className={`w-3.5 h-3.5 ${isPlayingSecretAudio ? 'animate-pulse' : ''}`} />
                  <span>{isPlayingSecretAudio ? t.pauseVoice : t.playVoice}</span>
                </button>
              </div>
            )}

            {/* Next Scene Button */}
            <div className="pt-8 flex justify-center">
              <button
                onClick={onNext}
                className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-sans-luxury text-sm tracking-wider flex items-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/25 border border-white/20"
              >
                <span>{t.next}</span>
                <ArrowRight className="w-4 h-4 text-purple-200 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
