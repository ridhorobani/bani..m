import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneId, ThemeId, StoryData, PhotoItem, SoundTrack } from './types';
import { DEFAULT_STORY, THEME_CONFIGS } from './data/defaultStory';
import { Language } from './data/translations';
import { ThemeCanvas } from './components/ThemeCanvas';
import { LandingScene } from './components/LandingScene';
import { IntroScene } from './components/IntroScene';
import { GalleryScene } from './components/GalleryScene';
import { LetterScene } from './components/LetterScene';
import { SecretScene } from './components/SecretScene';
import { EndingScene } from './components/EndingScene';
import { NavigationDock } from './components/NavigationDock';
import { StoryCreatorModal } from './components/StoryCreatorModal';
import { EasterEggsOverlay } from './components/EasterEggsOverlay';
import { globalAudio } from './audio/AudioEngine';
import {
  saveStoryToLocalStorage,
  loadStoryFromLocalStorage,
  parseShareableLink,
  loadCustomMusicFromLocalStorage,
} from './utils/storage';

export default function App() {
  const [currentScene, setCurrentScene] = useState<SceneId>('landing');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_STORY.defaultTheme);
  const [storyData, setStoryData] = useState<StoryData>(DEFAULT_STORY);
  const [customTrack, setCustomTrack] = useState<SoundTrack | undefined>(undefined);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('bani_app_lang');
    return (savedLang === 'id' || savedLang === 'en') ? savedLang : 'en';
  });

  // Save language preference to localStorage
  const handleToggleLang = () => {
    setLang((prev) => {
      const nextLang = prev === 'en' ? 'id' : 'en';
      localStorage.setItem('bani_app_lang', nextLang);
      return nextLang;
    });
  };

  // Initialize from Share Link Hash or LocalStorage
  useEffect(() => {
    // 1. Check URL Hash for shared experience
    const sharedData = parseShareableLink();
    if (sharedData) {
      if (sharedData.story) setStoryData(sharedData.story);
      if (sharedData.theme) setCurrentTheme(sharedData.theme);
      if (sharedData.customTrack) {
        setCustomTrack(sharedData.customTrack);
        globalAudio.tracks = globalAudio.tracks.filter(t => t.id !== 'user_uploaded');
        globalAudio.tracks.push(sharedData.customTrack);
        globalAudio.selectTrack('user_uploaded', sharedData.customTrack.url);
      }
      return;
    }

    // 2. Otherwise load from LocalStorage
    const localStory = loadStoryFromLocalStorage();
    if (localStory) {
      setStoryData(localStory);
    }

    const savedMusic = loadCustomMusicFromLocalStorage();
    if (savedMusic) {
      setCustomTrack(savedMusic);
      globalAudio.tracks = globalAudio.tracks.filter(t => t.id !== 'user_uploaded');
      globalAudio.tracks.push(savedMusic);
      globalAudio.selectTrack('user_uploaded', savedMusic.url);
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    saveStoryToLocalStorage(storyData);
  }, [storyData]);

  // Get active theme config
  const activeThemeConfig = THEME_CONFIGS.find((t) => t.id === currentTheme) || THEME_CONFIGS[0];

  const handleBegin = () => {
    globalAudio.fadeIn(3000);
    setCurrentScene('intro');
  };

  const handleAddPhoto = (newPhoto: PhotoItem) => {
    setStoryData((prev) => {
      const updated = {
        ...prev,
        photos: [newPhoto, ...prev.photos],
      };
      saveStoryToLocalStorage(updated);
      return updated;
    });
  };

  const handleRemovePhoto = (id: string) => {
    setStoryData((prev) => {
      const updated = {
        ...prev,
        photos: prev.photos.filter((p) => p.id !== id),
      };
      saveStoryToLocalStorage(updated);
      return updated;
    });
  };

  const handleReplacePhoto = (id: string, updatedPhoto: PhotoItem) => {
    setStoryData((prev) => {
      const updatedPhotos = prev.photos.map((p) => (p.id === id ? updatedPhoto : p));
      const updated = {
        ...prev,
        photos: updatedPhotos,
      };
      saveStoryToLocalStorage(updated);
      return updated;
    });
  };

  const handleSaveStoryFromStudio = (newStory: StoryData) => {
    setStoryData(newStory);
    saveStoryToLocalStorage(newStory);
  };

  return (
    <div
      className={`min-h-screen w-full relative bg-gradient-to-br ${activeThemeConfig.bgGradient} transition-colors duration-1000 overflow-x-hidden font-sans-luxury text-white`}
    >
      {/* Background Interactive Shader/Particle Canvas */}
      <ThemeCanvas themeId={currentTheme} />

      {/* Floating Navigation Dock */}
      <NavigationDock
        currentScene={currentScene}
        lang={lang}
        onToggleLang={handleToggleLang}
        onSelectScene={setCurrentScene}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        onOpenCreator={() => setIsCreatorOpen(true)}
        onCustomMusicUploaded={(track) => setCustomTrack(track)}
      />

      {/* Interactive Easter Eggs Overlay */}
      <EasterEggsOverlay />

      {/* Main Animated Scene Switcher */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          {currentScene === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <LandingScene
                onBegin={handleBegin}
                title={storyData.title}
                tagline={storyData.tagline}
                lang={lang}
              />
            </motion.section>
          )}

          {currentScene === 'intro' && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <IntroScene
                sentence={storyData.introSentence}
                paragraphs={storyData.introParagraphs}
                recipientName={storyData.recipientName}
                lang={lang}
                onNext={() => setCurrentScene('gallery')}
              />
            </motion.section>
          )}

          {currentScene === 'gallery' && (
            <motion.section
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <GalleryScene
                photos={storyData.photos}
                lang={lang}
                onAddPhoto={handleAddPhoto}
                onRemovePhoto={handleRemovePhoto}
                onReplacePhoto={handleReplacePhoto}
                onNext={() => setCurrentScene('letter')}
              />
            </motion.section>
          )}

          {currentScene === 'letter' && (
            <motion.section
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <LetterScene
                letterContent={storyData.letterContent}
                recipientName={storyData.recipientName}
                lang={lang}
                onNext={() => setCurrentScene('secret')}
              />
            </motion.section>
          )}

          {currentScene === 'secret' && (
            <motion.section
              key="secret"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <SecretScene
                secret={storyData.secret}
                lang={lang}
                onNext={() => setCurrentScene('ending')}
              />
            </motion.section>
          )}

          {currentScene === 'ending' && (
            <motion.section
              key="ending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <EndingScene
                endingMessage={storyData.endingMessage}
                recipientName={storyData.recipientName}
                storyData={storyData}
                currentTheme={currentTheme}
                customTrack={customTrack}
                lang={lang}
                onReturn={() => setCurrentScene('landing')}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Story Studio Creator Modal */}
      <StoryCreatorModal
        isOpen={isCreatorOpen}
        lang={lang}
        onClose={() => setIsCreatorOpen(false)}
        storyData={storyData}
        onSaveStory={handleSaveStoryFromStudio}
        onResetDefault={() => {
          setStoryData(DEFAULT_STORY);
          saveStoryToLocalStorage(DEFAULT_STORY);
        }}
      />
    </div>
  );
}
