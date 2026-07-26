export type ThemeId =
  | 'night_sky'
  | 'galaxy'
  | 'aurora'
  | 'rain'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'coffee_shop'
  | 'sakura'
  | 'minimal_white'
  | 'vintage_paper';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  glowColor: string;
  particleType: 'stars' | 'galaxy_dust' | 'aurora_orbs' | 'rain' | 'bubbles' | 'ember' | 'fireflies' | 'coffee_steam' | 'petals' | 'minimal_dots' | 'paper_dust';
  fontColorClass: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  location?: string;
  rotation?: number; // for polaroid stack layout
}

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: string;
  tag?: string;
}

export interface SecretContent {
  isPasswordProtected: boolean;
  password?: string;
  hiddenMessage: string;
  hiddenImageUrl?: string;
  hiddenVideoUrl?: string;
  hiddenAudioUrl?: string;
  unlockedHint?: string;
}

export interface StoryData {
  title: string;
  tagline: string;
  recipientName: string;
  introSentence: string;
  introParagraphs: string[];
  letterContent: string;
  photos: PhotoItem[];
  timeline?: MemoryItem[];
  secret: SecretContent;
  endingMessage: string;
  defaultTheme: ThemeId;
}

export type SceneId = 'landing' | 'intro' | 'gallery' | 'letter' | 'secret' | 'ending';

export interface SoundTrack {
  id: string;
  name: string;
  artist: string;
  type: 'synth_piano' | 'synth_pad' | 'synth_rain' | 'custom_file' | 'url';
  url?: string;
}
