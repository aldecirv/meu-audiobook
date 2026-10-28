export interface Chapter {
  id: string;
  bookId: string;
  index: number;
  title: string;
  durationSeconds: number;
  audioSrc: string; // URL or synthesized audio
  fileName: string;
  fileSizeFormatted?: string;
  textExcerpt?: string; // used for realistic public domain text-to-speech fallback
}

export interface Book {
  id: string;
  title: string;
  author: string;
  narrator?: string;
  folderPath: string;
  coverColor: string; // Theme color
  coverArtStyle: 'machado' | 'alienista' | 'verne' | 'classic' | 'modern';
  coverImageUrl?: string;
  totalDurationSeconds: number;
  currentPositionSeconds: number;
  currentChapterId: string;
  isCompleted: boolean;
  lastPlayedAt: number;
  chapters: Chapter[];
  isLocalFile?: boolean;
}

export interface Bookmark {
  id: string;
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  timestampSeconds: number;
  title: string;
  notes?: string;
  createdAt: number;
}

export interface DailyListeningStat {
  date: string; // YYYY-MM-DD
  minutesListened: number;
  sessionsCount: number;
}

export interface PlayerSettings {
  playbackSpeed: number; // 0.5 to 5.0
  preservePitch: boolean;
  rewindSeconds: number; // 10, 30
  forwardSeconds: number; // 30, 60
  autoRewindOnPause: boolean; // Rewind 5s after pause > 5 min
  sleepTimerShakeToReset: boolean;
  dailyGoalMinutes: number;
  themeMode: 'dark' | 'light';
  accentColor: 'amber' | 'emerald' | 'cyan' | 'rose' | 'indigo';
}

export type ActiveTab = 'library' | 'player' | 'bookmarks' | 'stats' | 'code';
