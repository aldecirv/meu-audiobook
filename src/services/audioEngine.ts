import { Book, Chapter, PlayerSettings } from '../types/audiobook';
import { StorageService } from './storageService';

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  playbackSpeed: number;
  preservePitch: boolean;
  sleepTimerRemainingSeconds: number | null;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
}

export type PlaybackListener = (state: AudioPlaybackState) => void;

class AudioEngine {
  private audio: HTMLAudioElement;
  private currentBook: Book | null = null;
  private currentChapter: Chapter | null = null;
  private listeners: PlaybackListener[] = [];
  private sleepTimerId: any = null;
  private sleepTimerSecondsLeft: number | null = null;
  private pauseTimestamp: number | null = null;
  private listeningSecondsTracker = 0;
  private lastStatRecordTime = Date.now();
  private shakeListenerAttached = false;
  private lastShakeTime = 0;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private isUsingSpeech = false;
  private speechStartTime = 0;
  private speechInterval: any = null;

  private state: AudioPlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    bufferedPercent: 0,
    playbackSpeed: 1.0,
    preservePitch: true,
    sleepTimerRemainingSeconds: null,
    volume: 1.0,
    isMuted: false,
    isBuffering: false
  };

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.setupAudioListeners();
    this.setupMediaSession();
    this.setupShakeSensor();
  }

  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (!this.isUsingSpeech) {
        this.state.currentTime = this.audio.currentTime;
        this.trackListeningTime();
        this.notify();
      }
    });

    this.audio.addEventListener('durationchange', () => {
      if (!this.isUsingSpeech && this.audio.duration && !isNaN(this.audio.duration)) {
        this.state.duration = this.audio.duration;
        this.notify();
      }
    });

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.isBuffering = false;
      this.notify();
      this.updateMediaSessionPlaybackState('playing');
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.pauseTimestamp = Date.now();
      this.notify();
      this.updateMediaSessionPlaybackState('paused');
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('waiting', () => {
      this.state.isBuffering = true;
      this.notify();
    });

    this.audio.addEventListener('canplay', () => {
      this.state.isBuffering = false;
      this.notify();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio element error, falling back to Web Speech Synthesizer if excerpt available', e);
      if (this.currentChapter?.textExcerpt && ('speechSynthesis' in window)) {
        this.startSpeechFallback();
      }
    });
  }

  private setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const offset = details.seekOffset || 30;
        this.seekRelative(-offset);
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const offset = details.seekOffset || 30;
        this.seekRelative(offset);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => this.previousChapter());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextChapter());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seekTo(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('Error configuring MediaSession', e);
    }
  }

  private updateMediaSessionMetadata() {
    if (!('mediaSession' in navigator) || !this.currentBook || !this.currentChapter) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentChapter.title,
        artist: this.currentBook.author,
        album: this.currentBook.title,
        artwork: [
          {
            src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=512&q=80',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      });
    } catch (e) {
      console.warn('Error setting MediaMetadata', e);
    }
  }

  private updateMediaSessionPlaybackState(state: 'none' | 'paused' | 'playing') {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  public loadBookAndChapter(book: Book, chapterId?: string, autoPlay = false) {
    this.currentBook = book;
    const targetChapterId = chapterId || book.currentChapterId || book.chapters[0]?.id;
    const chapter = book.chapters.find(c => c.id === targetChapterId) || book.chapters[0];

    if (!chapter) return;
    this.currentChapter = chapter;

    this.stopSpeechFallback();

    // Check if smart auto-rewind on pause should apply (> 5 minutes paused)
    let initialPosition = 0;
    if (book.currentChapterId === chapter.id && book.currentPositionSeconds > 0) {
      initialPosition = book.currentPositionSeconds;
      if (this.pauseTimestamp && (Date.now() - this.pauseTimestamp > 300000)) {
        initialPosition = Math.max(0, initialPosition - 5);
      }
    }

    this.audio.src = chapter.audioSrc;
    this.setSpeed(this.state.playbackSpeed);
    this.audio.currentTime = initialPosition;
    this.state.currentTime = initialPosition;
    this.state.duration = chapter.durationSeconds || 300;

    this.updateMediaSessionMetadata();
    this.notify();

    if (autoPlay) {
      this.play();
    }
  }

  public async play(): Promise<void> {
    if (!this.currentChapter) return;

    try {
      this.applyPitchPreservation();
      await this.audio.play();
      this.state.isPlaying = true;
      this.notify();
    } catch (err) {
      console.warn('Native audio play error, using Web Speech Synthesizer fallback', err);
      this.startSpeechFallback();
    }
  }

  public pause(): void {
    if (this.isUsingSpeech) {
      window.speechSynthesis.pause();
      if (this.speechInterval) clearInterval(this.speechInterval);
      this.state.isPlaying = false;
      this.notify();
      return;
    }

    this.audio.pause();
    this.state.isPlaying = false;
    this.pauseTimestamp = Date.now();
    this.persistCurrentProgress();
    this.notify();
  }

  public togglePlayPause(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seekTo(seconds: number): void {
    const target = Math.max(0, Math.min(seconds, this.state.duration || 3600));
    if (this.isUsingSpeech) {
      this.state.currentTime = target;
      this.notify();
      return;
    }
    this.audio.currentTime = target;
    this.state.currentTime = target;
    this.persistCurrentProgress();
    this.notify();
  }

  public seekRelative(seconds: number): void {
    this.seekTo(this.state.currentTime + seconds);
  }

  public setSpeed(speed: number): void {
    const clamped = Math.max(0.5, Math.min(5.0, Number(speed.toFixed(2))));
    this.state.playbackSpeed = clamped;
    this.applyPitchPreservation();
    this.audio.playbackRate = clamped;

    if (this.speechUtterance && this.isUsingSpeech) {
      // Speech synthesis rate range 0.5 to 2.0
      this.speechUtterance.rate = Math.min(clamped, 2.0);
    }

    this.notify();
  }

  public setPreservePitch(preserve: boolean): void {
    this.state.preservePitch = preserve;
    this.applyPitchPreservation();
    this.notify();
  }

  private applyPitchPreservation() {
    const preserve = this.state.preservePitch;
    const a = this.audio as any;
    if ('preservesPitch' in a) a.preservesPitch = preserve;
    if ('mozPreservesPitch' in a) a.mozPreservesPitch = preserve;
    if ('webkitPreservesPitch' in a) a.webkitPreservesPitch = preserve;
  }

  public setVolume(volume: number): void {
    const vol = Math.max(0, Math.min(1, volume));
    this.audio.volume = vol;
    this.state.volume = vol;
    this.state.isMuted = vol === 0;
    this.notify();
  }

  public previousChapter(): void {
    if (!this.currentBook || !this.currentChapter) return;
    const currentIndex = this.currentBook.chapters.findIndex(c => c.id === this.currentChapter!.id);
    if (currentIndex > 0) {
      const prevChapter = this.currentBook.chapters[currentIndex - 1];
      this.loadBookAndChapter(this.currentBook, prevChapter.id, this.state.isPlaying);
    } else {
      this.seekTo(0);
    }
  }

  public nextChapter(): void {
    if (!this.currentBook || !this.currentChapter) return;
    const currentIndex = this.currentBook.chapters.findIndex(c => c.id === this.currentChapter!.id);
    if (currentIndex < this.currentBook.chapters.length - 1) {
      const nextChapter = this.currentBook.chapters[currentIndex + 1];
      this.loadBookAndChapter(this.currentBook, nextChapter.id, this.state.isPlaying);
    } else {
      // End of book!
      this.pause();
      StorageService.updateBookProgress(this.currentBook.id, this.currentChapter.id, this.state.duration, true);
    }
  }

  private handleTrackEnded() {
    this.nextChapter();
  }

  // Sleep Timer functionality
  public startSleepTimer(minutes: number, isEndOfChapter = false) {
    this.cancelSleepTimer();

    if (isEndOfChapter && this.currentChapter) {
      const remainingSeconds = Math.max(10, Math.round(this.state.duration - this.state.currentTime));
      this.sleepTimerSecondsLeft = remainingSeconds;
    } else {
      this.sleepTimerSecondsLeft = minutes * 60;
    }

    this.state.sleepTimerRemainingSeconds = this.sleepTimerSecondsLeft;
    this.notify();

    this.sleepTimerId = setInterval(() => {
      if (this.sleepTimerSecondsLeft === null) return;
      this.sleepTimerSecondsLeft -= 1;
      this.state.sleepTimerRemainingSeconds = this.sleepTimerSecondsLeft;

      // Gentle fade out in the last 20 seconds
      if (this.sleepTimerSecondsLeft <= 20 && this.sleepTimerSecondsLeft > 0) {
        const factor = this.sleepTimerSecondsLeft / 20;
        this.audio.volume = Math.max(0.05, factor);
      }

      if (this.sleepTimerSecondsLeft <= 0) {
        this.cancelSleepTimer();
        this.pause();
        this.audio.volume = this.state.volume; // restore volume
      } else {
        this.notify();
      }
    }, 1000);
  }

  public cancelSleepTimer() {
    if (this.sleepTimerId) {
      clearInterval(this.sleepTimerId);
      this.sleepTimerId = null;
    }
    this.sleepTimerSecondsLeft = null;
    this.state.sleepTimerRemainingSeconds = null;
    this.audio.volume = this.state.volume;
    this.notify();
  }

  // Shake detection to reset sleep timer
  private setupShakeSensor() {
    if (typeof window === 'undefined' || this.shakeListenerAttached) return;

    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', (event) => {
        const acc = event.accelerationIncludingGravity;
        if (!acc) return;
        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        if (magnitude > 18) {
          const now = Date.now();
          if (now - this.lastShakeTime > 3000) {
            this.lastShakeTime = now;
            this.handleShakeDetected();
          }
        }
      });
      this.shakeListenerAttached = true;
    }
  }

  public handleShakeDetected() {
    if (this.state.sleepTimerRemainingSeconds !== null) {
      // Extend timer back to 15 minutes!
      this.startSleepTimer(15);
    }
  }

  // Track listening time for stats
  private trackListeningTime() {
    const now = Date.now();
    if (now - this.lastStatRecordTime >= 1000) {
      this.listeningSecondsTracker += 1;
      this.lastStatRecordTime = now;

      // Every 30 seconds of active playback, persist to Room/Daily stats
      if (this.listeningSecondsTracker >= 30) {
        StorageService.recordListeningSeconds(this.listeningSecondsTracker);
        this.listeningSecondsTracker = 0;
      }
    }
  }

  private persistCurrentProgress() {
    if (!this.currentBook || !this.currentChapter) return;
    StorageService.updateBookProgress(
      this.currentBook.id,
      this.currentChapter.id,
      Math.round(this.state.currentTime)
    );
  }

  // SpeechSynthesis Fallback for reading literary excerpts when offline or audio format unsupported
  private startSpeechFallback() {
    if (!('speechSynthesis' in window) || !this.currentChapter?.textExcerpt) return;
    this.stopSpeechFallback();

    this.isUsingSpeech = true;
    const text = this.currentChapter.textExcerpt;
    this.speechUtterance = new SpeechSynthesisUtterance(text);
    this.speechUtterance.lang = 'pt-BR';
    this.speechUtterance.rate = Math.min(this.state.playbackSpeed, 2.0);

    this.speechStartTime = Date.now();
    this.state.isPlaying = true;
    this.notify();

    this.speechUtterance.onend = () => {
      this.isUsingSpeech = false;
      this.handleTrackEnded();
    };

    if (this.speechInterval) clearInterval(this.speechInterval);
    this.speechInterval = setInterval(() => {
      if (this.isUsingSpeech && this.state.isPlaying) {
        this.state.currentTime += 1;
        this.trackListeningTime();
        this.notify();
      }
    }, 1000);

    window.speechSynthesis.speak(this.speechUtterance);
  }

  private stopSpeechFallback() {
    if (this.isUsingSpeech && ('speechSynthesis' in window)) {
      window.speechSynthesis.cancel();
      this.isUsingSpeech = false;
      if (this.speechInterval) clearInterval(this.speechInterval);
    }
  }

  public getCurrentBook(): Book | null {
    return this.currentBook;
  }

  public getCurrentChapter(): Chapter | null {
    return this.currentChapter;
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }
}

export const audioEngine = new AudioEngine();
