import { SoundTrack } from '../types';

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private isInitialized = false;
  private isPlaying = false;
  private volume = 0.5;
  private activeTrackId: string = 'synth_piano';
  private audioElement: HTMLAudioElement | null = null;
  private masterGain: GainNode | null = null;
  private analyzer: AnalyserNode | null = null;
  private synthInterval: number | null = null;
  private currentCustomUrl: string | null = null;

  public tracks: SoundTrack[] = [
    { id: 'synth_piano', name: 'Ethereal Piano Chords', artist: 'BANI Ambient Engine', type: 'synth_piano' },
    { id: 'synth_pad', name: 'Cosmic Deep Space Pad', artist: 'BANI Ambient Engine', type: 'synth_pad' },
    { id: 'synth_rain', name: 'Gentle Rain & Keys', artist: 'BANI Ambient Engine', type: 'synth_rain' },
    { id: 'custom_default', name: 'Quiet Night Serenade', artist: 'Cinematic Piano', type: 'url', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-piano-10781.mp3' },
  ];

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = this.volume;

      this.analyzer = this.audioCtx.createAnalyser();
      this.analyzer.fftSize = 64;

      this.masterGain.connect(this.analyzer);
      this.analyzer.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  public async startAudio(): Promise<boolean> {
    this.init();
    if (!this.audioCtx) return false;

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.playSelectedTrack();
    return true;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.audioCtx.currentTime + 0.1);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getActiveTrackId(): string {
    return this.activeTrackId;
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.startAudio();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopSynth();
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public selectTrack(trackId: string, customUrl?: string) {
    this.activeTrackId = trackId;
    if (customUrl) {
      this.currentCustomUrl = customUrl;
    }
    if (this.isPlaying) {
      this.playSelectedTrack();
    }
  }

  public setCustomAudioFile(file: File) {
    const url = URL.createObjectURL(file);
    const customTrack: SoundTrack = {
      id: 'user_uploaded',
      name: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Uploaded Track',
      type: 'custom_file',
      url: url,
    };
    
    // Replace or add user track
    const existingIndex = this.tracks.findIndex(t => t.id === 'user_uploaded');
    if (existingIndex >= 0) {
      this.tracks[existingIndex] = customTrack;
    } else {
      this.tracks.push(customTrack);
    }

    this.selectTrack('user_uploaded', url);
  }

  public fadeOutAndStop(durationMs: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.masterGain || !this.audioCtx) {
        this.pause();
        resolve();
        return;
      }

      const startVol = this.masterGain.gain.value;
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.setValueAtTime(startVol, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

      setTimeout(() => {
        this.pause();
        if (this.masterGain) {
          this.masterGain.gain.value = this.volume;
        }
        resolve();
      }, durationMs);
    });
  }

  public fadeIn(durationMs: number = 2000) {
    this.startAudio();
    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + durationMs / 1000);
    }
  }

  private playSelectedTrack() {
    this.stopSynth();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    const track = this.tracks.find(t => t.id === this.activeTrackId);
    if (!track) return;

    if (track.type === 'url' || track.type === 'custom_file') {
      const audioUrl = track.url || this.currentCustomUrl;
      if (audioUrl) {
        this.audioElement = new Audio(audioUrl);
        this.audioElement.loop = true;
        this.audioElement.volume = this.volume;
        this.audioElement.play().catch(e => console.warn('Audio play prevented:', e));
      }
    } else {
      this.startSynthMode(track.type);
    }
  }

  private stopSynth() {
    if (this.synthInterval) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  private startSynthMode(type: 'synth_piano' | 'synth_pad' | 'synth_rain') {
    if (!this.audioCtx || !this.masterGain) return;

    // Emotional scale frequencies (A minor / C major pentatonic & lush add9 chords)
    // Frequencies: C4, D4, E4, G4, A4, B4, C5, E5, G5, A5
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25, 659.25, 783.99, 880.00];

    const playChordNote = (freq: number, duration: number, isPad = false) => {
      if (!this.audioCtx || !this.masterGain || !this.isPlaying) return;

      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = isPad ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(isPad ? 0.08 : 0.15, now + (isPad ? 1.5 : 0.1));
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    };

    const triggerArpeggio = () => {
      if (!this.isPlaying) return;
      const count = type === 'synth_pad' ? 2 : 3;
      for (let i = 0; i < count; i++) {
        const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
        const delay = i * 400 + Math.random() * 200;
        setTimeout(() => {
          playChordNote(randomFreq, type === 'synth_pad' ? 4 : 2.5, type === 'synth_pad');
        }, delay);
      }
    };

    triggerArpeggio();
    const intervalMs = type === 'synth_pad' ? 5000 : 3500;
    this.synthInterval = window.setInterval(triggerArpeggio, intervalMs);
  }

  public getAudioSpectrum(): number {
    if (!this.analyzer) return 0;
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return sum / (dataArray.length * 255);
  }
}

export const globalAudio = new AudioEngine();
