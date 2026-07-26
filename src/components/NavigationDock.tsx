import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneId, ThemeId, SoundTrack } from '../types';
import { THEME_CONFIGS } from '../data/defaultStory';
import { globalAudio } from '../audio/AudioEngine';
import { readFileAsDataUrl, saveCustomMusicToLocalStorage } from '../utils/storage';
import { translations, Language } from '../data/translations';
import {
  Palette,
  Music,
  Edit3,
  Play,
  Pause,
  Upload,
  Check,
  Globe,
} from 'lucide-react';

interface NavigationDockProps {
  currentScene: SceneId;
  lang: Language;
  onToggleLang: () => void;
  onSelectScene: (scene: SceneId) => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onOpenCreator: () => void;
  onCustomMusicUploaded?: (track: SoundTrack) => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  currentScene,
  lang,
  onToggleLang,
  onSelectScene,
  currentTheme,
  onSelectTheme,
  onOpenCreator,
  onCustomMusicUploaded,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(globalAudio.getIsPlaying());
  const [volume, setVolume] = useState(globalAudio.getVolume());
  const [activeTrack, setActiveTrack] = useState(globalAudio.getActiveTrackId());

  const tNav = translations[lang];

  const SCENE_LIST: { id: SceneId; label: string }[] = [
    { id: 'landing', label: tNav.scenes.landing },
    { id: 'intro', label: tNav.scenes.intro },
    { id: 'gallery', label: tNav.scenes.gallery },
    { id: 'letter', label: tNav.scenes.letter },
    { id: 'secret', label: tNav.scenes.secret },
    { id: 'ending', label: tNav.scenes.ending },
  ];

  const currentSceneIndex = SCENE_LIST.findIndex((s) => s.id === currentScene);
  const progressPercent = ((currentSceneIndex + 1) / SCENE_LIST.length) * 100;

  const handleTogglePlay = () => {
    globalAudio.togglePlay();
    setIsPlaying(globalAudio.getIsPlaying());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    globalAudio.setVolume(newVol);
  };

  const handleTrackChange = (trackId: string) => {
    setActiveTrack(trackId);
    globalAudio.selectTrack(trackId);
    setIsPlaying(true);
  };

  const handleCustomAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const customTrack: SoundTrack = {
          id: 'user_uploaded',
          name: file.name.replace(/\.[^/.]+$/, ''),
          artist: lang === 'en' ? 'Your Selected Track' : 'Musik Pilihanmu',
          type: 'custom_file',
          url: dataUrl,
        };

        globalAudio.tracks = globalAudio.tracks.filter(tr => tr.id !== 'user_uploaded');
        globalAudio.tracks.push(customTrack);
        globalAudio.selectTrack('user_uploaded', dataUrl);
        setActiveTrack('user_uploaded');
        setIsPlaying(true);

        saveCustomMusicToLocalStorage(customTrack);
        if (onCustomMusicUploaded) {
          onCustomMusicUploaded(customTrack);
        }
      } catch (err) {
        console.error('Failed uploading custom audio file:', err);
      }
    }
  };

  return (
    <>
      {/* Top Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-full px-4">
        <div className="glass-pill px-4 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2 sm:gap-4 backdrop-blur-2xl bg-black/60">
          {/* Scene Dots / Step Navigator */}
          <div className="hidden md:flex items-center gap-1.5 pr-3 border-r border-white/15">
            {SCENE_LIST.map((scene) => (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className={`relative px-3 py-1 rounded-full text-[11px] font-sans-luxury tracking-wider transition-all cursor-pointer ${
                  currentScene === scene.id
                    ? 'text-white bg-purple-600/80 font-medium'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {scene.label}
              </button>
            ))}
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans-luxury text-xs tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-white/15"
            title={lang === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-purple-300" />
            <span className="font-semibold text-purple-200">{lang === 'en' ? 'EN' : 'ID'}</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => {
              setIsThemeOpen(!isThemeOpen);
              setIsAudioOpen(false);
            }}
            className={`p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative ${
              isThemeOpen ? 'bg-purple-600/60 text-white' : ''
            }`}
            title={tNav.theme}
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Audio Controls Button */}
          <button
            onClick={() => {
              setIsAudioOpen(!isAudioOpen);
              setIsThemeOpen(false);
            }}
            className={`p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative ${
              isAudioOpen ? 'bg-purple-600/60 text-white' : ''
            }`}
            title={tNav.musicSettings}
          >
            <Music className="w-4 h-4" />
            {isPlaying && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            )}
          </button>

          {/* Creator Mode Button */}
          <button
            onClick={onOpenCreator}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans-luxury text-xs tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-white/15"
            title={tNav.editStory}
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">{tNav.editStory}</span>
          </button>
        </div>
      </div>

      {/* THEMES MODAL POPUP */}
      <AnimatePresence>
        {isThemeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-lg glass-card p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/90"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-serif-display text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>{tNav.themesCount}</span>
              </h3>
              <button
                onClick={() => setIsThemeOpen(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                {tNav.close}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {THEME_CONFIGS.map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => {
                    onSelectTheme(thm.id);
                    setIsThemeOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    currentTheme === thm.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/10 hover:border-white/30 bg-white/5 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-sans-luxury font-medium">{thm.name}</span>
                    {currentTheme === thm.id && <Check className="w-3.5 h-3.5 text-purple-300" />}
                  </div>
                  <p className="text-[10px] text-white/50 line-clamp-2">{thm.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIO MODAL POPUP */}
      <AnimatePresence>
        {isAudioOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md glass-card p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/90 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-serif-display text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>{tNav.musicSettings}</span>
              </h3>
              <button
                onClick={() => setIsAudioOpen(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                {tNav.close}
              </button>
            </div>

            {/* Play/Pause & Volume Slider */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <button
                onClick={handleTogglePlay}
                className="p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white cursor-pointer transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs font-sans-luxury text-white/60">
                  <span>{tNav.audio.volume}</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-purple-500 bg-white/20 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            </div>

            {/* Track Selection */}
            <div className="space-y-2">
              <p className="text-xs font-sans-luxury text-white/50 uppercase tracking-wider">
                {tNav.audio.bgMusic}
              </p>
              {globalAudio.tracks.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => handleTrackChange(tr.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-sans-luxury transition-all cursor-pointer ${
                    activeTrack === tr.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/10 hover:bg-white/5 text-white/70'
                  }`}
                >
                  <div>
                    <p className="font-medium">{tr.name}</p>
                    <p className="text-[10px] text-white/40">{tr.artist}</p>
                  </div>
                  {activeTrack === tr.id && <Check className="w-4 h-4 text-purple-300" />}
                </button>
              ))}
            </div>

            {/* Custom MP3 Upload */}
            <div className="pt-2 border-t border-white/10">
              <label className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-sans-luxury text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/15">
                <Upload className="w-3.5 h-3.5 text-purple-300" />
                <span>{tNav.audio.uploadCustom}</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleCustomAudioUpload}
                  className="hidden"
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
