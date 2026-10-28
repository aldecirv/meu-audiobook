/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Bookmark, DailyListeningStat, PlayerSettings, ActiveTab } from './types/audiobook';
import { StorageService, DEFAULT_SETTINGS } from './services/storageService';
import { audioEngine, AudioPlaybackState } from './services/audioEngine';
import { INITIAL_BOOKS } from './data/sampleBooks';

import { AndroidFrame } from './components/AndroidFrame';
import { AndroidNotification } from './components/AndroidNotification';
import { SleepTimerModal } from './components/SleepTimerModal';
import { SpeedSelectorModal } from './components/SpeedSelectorModal';
import { BookmarkModal } from './components/BookmarkModal';
import { FolderScannerModal } from './components/FolderScannerModal';
import { AndroidCodeExplorerModal } from './components/AndroidCodeExplorerModal';

import { LibraryScreen } from './screens/LibraryScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { BookmarksScreen } from './screens/BookmarksScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => StorageService.loadBooks());
  const [activeBookId, setActiveBookId] = useState<string>(() => StorageService.getActiveBookId());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => StorageService.loadBookmarks());
  const [stats, setStats] = useState<DailyListeningStat[]>(() => StorageService.loadStats());
  const [settings, setSettings] = useState<PlayerSettings>(() => StorageService.loadSettings());

  const [activeTab, setActiveTab] = useState<ActiveTab | 'settings'>('library');
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioEngine.getState());

  // Modals state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isFolderScannerOpen, setIsFolderScannerOpen] = useState(false);
  const [isAndroidCodeModalOpen, setIsAndroidCodeModalOpen] = useState(false);

  // Active book and chapter
  const activeBook = books.find((b) => b.id === activeBookId) || books[0];
  const activeChapter =
    activeBook?.chapters.find((c) => c.id === activeBook?.currentChapterId) ||
    activeBook?.chapters[0];

  // Subscribe to Audio Engine state changes
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((newState) => {
      setPlaybackState(newState);
      // Synchronize stats if recorded in background
      setStats(StorageService.loadStats());
    });
    return unsubscribe;
  }, []);

  // Initialize AudioEngine with active book
  useEffect(() => {
    if (activeBook && activeChapter) {
      audioEngine.setSpeed(settings.playbackSpeed);
      audioEngine.setPreservePitch(settings.preservePitch);
      audioEngine.loadBookAndChapter(activeBook, activeChapter.id, false);
    }
  }, []);

  // Handlers
  const handleSelectBook = (book: Book, autoPlay = false) => {
    setActiveBookId(book.id);
    StorageService.setActiveBookId(book.id);
    audioEngine.loadBookAndChapter(book, book.currentChapterId, autoPlay);
    setActiveTab('player');
  };

  const handlePlayPause = () => {
    audioEngine.togglePlayPause();
  };

  const handleRewind = (seconds: number) => {
    audioEngine.seekRelative(-seconds);
  };

  const handleForward = (seconds: number) => {
    audioEngine.seekRelative(seconds);
  };

  const handleSeek = (seconds: number) => {
    audioEngine.seekTo(seconds);
  };

  const handlePreviousChapter = () => {
    audioEngine.previousChapter();
  };

  const handleNextChapter = () => {
    audioEngine.nextChapter();
  };

  const handleSelectChapter = (chapterId: string) => {
    if (activeBook) {
      audioEngine.loadBookAndChapter(activeBook, chapterId, true);
    }
  };

  // Speed handlers
  const handleSelectSpeed = (speed: number) => {
    audioEngine.setSpeed(speed);
    const updated = { ...settings, playbackSpeed: speed };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleTogglePitch = (preserve: boolean) => {
    audioEngine.setPreservePitch(preserve);
    const updated = { ...settings, preservePitch: preserve };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  // Sleep timer handlers
  const handleSetSleepTimer = (minutes: number, isEndOfChapter = false) => {
    audioEngine.startSleepTimer(minutes, isEndOfChapter);
  };

  const handleCancelSleepTimer = () => {
    audioEngine.cancelSleepTimer();
  };

  const handleSimulateShake = () => {
    audioEngine.handleShakeDetected();
  };

  // Bookmarks handlers
  const handleSaveBookmark = (newBookmark: Bookmark) => {
    const updated = StorageService.addBookmark(newBookmark);
    setBookmarks(updated);
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = StorageService.deleteBookmark(id);
    setBookmarks(updated);
  };

  const handleJumpToBookmark = (bookmark: Bookmark) => {
    const targetBook = books.find((b) => b.id === bookmark.bookId);
    if (targetBook) {
      setActiveBookId(targetBook.id);
      StorageService.setActiveBookId(targetBook.id);
      audioEngine.loadBookAndChapter(targetBook, bookmark.chapterId, true);
      audioEngine.seekTo(bookmark.timestampSeconds);
      setActiveTab('player');
    }
  };

  // Folder scanning handlers
  const handleBooksImported = (imported: Book[]) => {
    const updated = [...imported, ...books];
    setBooks(updated);
    StorageService.saveBooks(updated);
    if (imported[0]) {
      handleSelectBook(imported[0], false);
    }
  };

  // Stats testing
  const handleSimulateListeningTime = (minutes: number) => {
    const updated = StorageService.recordListeningSeconds(minutes * 60);
    setStats(updated);
  };

  // Settings
  const handleUpdateSettings = (partial: Partial<PlayerSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleResetSampleData = () => {
    StorageService.saveBooks(INITIAL_BOOKS);
    setBooks(INITIAL_BOOKS);
    setActiveBookId(INITIAL_BOOKS[0].id);
    StorageService.setActiveBookId(INITIAL_BOOKS[0].id);
    audioEngine.loadBookAndChapter(INITIAL_BOOKS[0], INITIAL_BOOKS[0].chapters[0].id, false);
  };

  return (
    <div className={settings.themeMode === 'light' ? 'light-mode' : 'dark'}>
      <AndroidFrame
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPlaying={playbackState.isPlaying}
        onOpenAndroidCodeModal={() => setIsAndroidCodeModalOpen(true)}
      >
        {/* Pull-down Android MediaStyle Notification */}
        {activeBook && activeChapter && (
          <div className="px-3 pt-1">
            <AndroidNotification
              book={activeBook}
              chapter={activeChapter}
              playbackState={playbackState}
              onPlayPause={handlePlayPause}
              onRewind30={() => handleRewind(30)}
              onForward30={() => handleForward(30)}
              onSeek={handleSeek}
              onSpeedClick={() => setIsSpeedModalOpen(true)}
              onClose={() => setIsNotificationOpen(false)}
              isOpen={isNotificationOpen}
            />
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'library' && (
          <LibraryScreen
            books={books}
            activeBook={activeBook}
            onSelectBook={handleSelectBook}
            onOpenFolderScanner={() => setIsFolderScannerOpen(true)}
            playbackSpeed={playbackState.playbackSpeed}
          />
        )}

        {activeTab === 'player' && activeBook && activeChapter && (
          <PlayerScreen
            book={activeBook}
            chapter={activeChapter}
            playbackState={playbackState}
            settings={settings}
            onPlayPauseToggle={handlePlayPause}
            onRewind={handleRewind}
            onForward={handleForward}
            onSeek={handleSeek}
            onPreviousChapter={handlePreviousChapter}
            onNextChapter={handleNextChapter}
            onSelectChapter={handleSelectChapter}
            onOpenSpeedModal={() => setIsSpeedModalOpen(true)}
            onOpenSleepTimerModal={() => setIsSleepModalOpen(true)}
            onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
            onToggleNotificationDrawer={() => setIsNotificationOpen(!isNotificationOpen)}
            isNotificationOpen={isNotificationOpen}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksScreen
            bookmarks={bookmarks}
            books={books}
            activeBook={activeBook}
            onJumpToBookmark={handleJumpToBookmark}
            onDeleteBookmark={handleDeleteBookmark}
            onOpenCreateBookmark={() => setIsBookmarkModalOpen(true)}
          />
        )}

        {activeTab === 'stats' && (
          <StatsScreen
            stats={stats}
            books={books}
            settings={settings}
            onSimulateListeningTime={handleSimulateListeningTime}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetSampleData={handleResetSampleData}
            onOpenAndroidCodeModal={() => setIsAndroidCodeModalOpen(true)}
          />
        )}
      </AndroidFrame>

      {/* Global Modals */}
      <SleepTimerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
        remainingSeconds={playbackState.sleepTimerRemainingSeconds}
        onSetTimer={handleSetSleepTimer}
        onCancelTimer={handleCancelSleepTimer}
        onSimulateShake={handleSimulateShake}
      />

      <SpeedSelectorModal
        isOpen={isSpeedModalOpen}
        onClose={() => setIsSpeedModalOpen(false)}
        currentSpeed={playbackState.playbackSpeed}
        preservePitch={playbackState.preservePitch}
        onSelectSpeed={handleSelectSpeed}
        onTogglePitch={handleTogglePitch}
        remainingBookSeconds={
          activeBook
            ? Math.max(0, activeBook.totalDurationSeconds - activeBook.currentPositionSeconds)
            : 3600
        }
      />

      {activeBook && activeChapter && (
        <BookmarkModal
          isOpen={isBookmarkModalOpen}
          onClose={() => setIsBookmarkModalOpen(false)}
          book={activeBook}
          chapter={activeChapter}
          currentPositionSeconds={playbackState.currentTime}
          onSaveBookmark={handleSaveBookmark}
        />
      )}

      <FolderScannerModal
        isOpen={isFolderScannerOpen}
        onClose={() => setIsFolderScannerOpen(false)}
        onBooksImported={handleBooksImported}
      />

      <AndroidCodeExplorerModal
        isOpen={isAndroidCodeModalOpen}
        onClose={() => setIsAndroidCodeModalOpen(false)}
      />
    </div>
  );
}
