import { Book, Bookmark, DailyListeningStat, PlayerSettings } from '../types/audiobook';
import { INITIAL_BOOKS, INITIAL_BOOKMARKS, INITIAL_STATS } from '../data/sampleBooks';

const STORAGE_KEYS = {
  BOOKS: 'meu_audiobook_books_v1',
  BOOKMARKS: 'meu_audiobook_bookmarks_v1',
  STATS: 'meu_audiobook_stats_v1',
  SETTINGS: 'meu_audiobook_settings_v1',
  ACTIVE_BOOK_ID: 'meu_audiobook_active_book_id_v1'
};

export const DEFAULT_SETTINGS: PlayerSettings = {
  playbackSpeed: 1.0,
  preservePitch: true,
  rewindSeconds: 30,
  forwardSeconds: 30,
  autoRewindOnPause: true,
  sleepTimerShakeToReset: true,
  dailyGoalMinutes: 45,
  themeMode: 'dark',
  accentColor: 'amber'
};

export class StorageService {
  static loadBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load books from localStorage', e);
    }
    this.saveBooks(INITIAL_BOOKS);
    return INITIAL_BOOKS;
  }

  static saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (e) {
      console.warn('Failed to save books', e);
    }
  }

  static updateBookProgress(
    bookId: string,
    currentChapterId: string,
    positionSeconds: number,
    isCompleted?: boolean
  ): Book[] {
    const books = this.loadBooks();
    const updated = books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          currentChapterId,
          currentPositionSeconds: positionSeconds,
          isCompleted: isCompleted !== undefined ? isCompleted : book.isCompleted,
          lastPlayedAt: Date.now()
        };
      }
      return book;
    });
    this.saveBooks(updated);
    return updated;
  }

  static loadBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load bookmarks', e);
    }
    this.saveBookmarks(INITIAL_BOOKMARKS);
    return INITIAL_BOOKMARKS;
  }

  static saveBookmarks(bookmarks: Bookmark[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks', e);
    }
  }

  static addBookmark(bookmark: Bookmark): Bookmark[] {
    const current = this.loadBookmarks();
    const updated = [bookmark, ...current];
    this.saveBookmarks(updated);
    return updated;
  }

  static deleteBookmark(id: string): Bookmark[] {
    const current = this.loadBookmarks();
    const updated = current.filter(b => b.id !== id);
    this.saveBookmarks(updated);
    return updated;
  }

  static loadStats(): DailyListeningStat[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
    this.saveStats(INITIAL_STATS);
    return INITIAL_STATS;
  }

  static saveStats(stats: DailyListeningStat[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }
  }

  static recordListeningSeconds(seconds: number): DailyListeningStat[] {
    if (seconds <= 0) return this.loadStats();
    const today = new Date().toISOString().split('T')[0];
    const stats = this.loadStats();
    const existingIndex = stats.findIndex(s => s.date === today);
    const minutesToAdd = Math.ceil(seconds / 60);

    let updated: DailyListeningStat[];
    if (existingIndex >= 0) {
      updated = [...stats];
      updated[existingIndex] = {
        ...updated[existingIndex],
        minutesListened: updated[existingIndex].minutesListened + minutesToAdd,
        sessionsCount: updated[existingIndex].sessionsCount + 1
      };
    } else {
      updated = [...stats, { date: today, minutesListened: minutesToAdd, sessionsCount: 1 }];
    }
    this.saveStats(updated);
    return updated;
  }

  static loadSettings(): PlayerSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: PlayerSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }

  static getActiveBookId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_BOOK_ID) || INITIAL_BOOKS[0].id;
  }

  static setActiveBookId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BOOK_ID, id);
  }
}
