import LZString from 'lz-string';
import { StoryData, ThemeId, SoundTrack } from '../types';
import { DEFAULT_STORY } from '../data/defaultStory';

const STORAGE_KEY_STORY = 'bani_story_data_v2';
const STORAGE_KEY_THEME = 'bani_theme_id_v2';
const STORAGE_KEY_CUSTOM_MUSIC = 'bani_custom_music_v2';

/**
 * Resize and compress an image file to Base64 Data URL
 * Keeps photos lightweight (~100-200KB) so they easily fit in localStorage & URL sharing
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Read file (Audio or Video) as Data URL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Save story data to localStorage
 */
export function saveStoryToLocalStorage(story: StoryData): void {
  try {
    localStorage.setItem(STORAGE_KEY_STORY, JSON.stringify(story));
  } catch (err) {
    console.warn('Failed to save story to localStorage:', err);
  }
}

/**
 * Load story data from localStorage
 */
export function loadStoryFromLocalStorage(): StoryData | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY_STORY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn('Failed to load story from localStorage:', err);
  }
  return null;
}

/**
 * Save theme to localStorage
 */
export function saveThemeToLocalStorage(theme: ThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (err) {
    console.warn('Failed to save theme to localStorage:', err);
  }
}

/**
 * Load theme from localStorage
 */
export function loadThemeFromLocalStorage(): ThemeId | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY_THEME);
    if (item) return item as ThemeId;
  } catch (err) {
    console.warn('Failed to load theme from localStorage:', err);
  }
  return null;
}

/**
 * Save custom audio track to localStorage
 */
export function saveCustomMusicToLocalStorage(track: SoundTrack): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_MUSIC, JSON.stringify(track));
  } catch (err) {
    console.warn('Failed to save custom music to localStorage:', err);
  }
}

/**
 * Load custom audio track from localStorage
 */
export function loadCustomMusicFromLocalStorage(): SoundTrack | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY_CUSTOM_MUSIC);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn('Failed to load custom music from localStorage:', err);
  }
  return null;
}

export interface SharedPayload {
  story: StoryData;
  theme?: ThemeId;
  customTrack?: SoundTrack;
}

/**
 * Generate a compressed shareable URL containing the story, theme, and custom music/video data
 */
export function generateShareableLink(
  story: StoryData,
  theme: ThemeId,
  customTrack?: SoundTrack
): string {
  const payload: SharedPayload = {
    story,
    theme,
    customTrack,
  };

  try {
    const jsonStr = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    const url = new URL(window.location.href);
    url.hash = `story=${compressed}`;
    return url.toString();
  } catch (err) {
    console.error('Failed to generate shareable link:', err);
    return window.location.href;
  }
}

/**
 * Parse story data, theme, and custom track from URL hash if available
 */
export function parseShareableLink(): SharedPayload | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('story=')) return null;

    const compressed = hash.split('story=')[1];
    if (!compressed) return null;

    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;

    const payload = JSON.parse(decompressed) as SharedPayload;
    if (payload && payload.story) {
      return payload;
    }
  } catch (err) {
    console.warn('Failed to parse shareable link:', err);
  }
  return null;
}
