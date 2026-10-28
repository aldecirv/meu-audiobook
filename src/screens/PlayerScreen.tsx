import React, { useState } from 'react';
import { Book, Chapter, PlayerSettings } from '../types/audiobook';
import { AudioPlaybackState } from '../services/audioEngine';
import { BookCoverArt } from '../components/BookCoverArt';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Gauge,
  Moon,
  BookmarkPlus,
  ListMusic,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface PlayerScreenProps {
  book: Book;
  chapter: Chapter;
  playbackState: AudioPlaybackState;
  settings: PlayerSettings;
  onPlayPauseToggle: () => void;
  onRewind: (seconds: number) => void;
  onForward: (seconds: number) => void;
  onSeek: (seconds: number) => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
  onSelectChapter: (chapterId: string) => void;
  onOpenSpeedModal: () => void;
  onOpenSleepTimerModal: () => void;
  onOpenBookmarkModal: () => void;
  onToggleNotificationDrawer: () => void;
  isNotificationOpen: boolean;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  book,
  chapter,
  playbackState,
  settings,
  onPlayPauseToggle,
  onRewind,
  onForward,
  onSeek,
  onPreviousChapter,
  onNextChapter,
  onSelectChapter,
  onOpenSpeedModal,
  onOpenSleepTimerModal,
  onOpenBookmarkModal,
  onToggleNotificationDrawer,
  isNotificationOpen
}) => {
  const [showChaptersList, setShowChaptersList] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const currentSeconds = Math.round(playbackState.currentTime);
  const totalSeconds = Math.round(playbackState.duration || chapter.durationSeconds || 300);

  // Overall book progress
  const bookProgressPercent =
    book.totalDurationSeconds > 0
      ? Math.min(100, Math.round((book.currentPositionSeconds / book.totalDurationSeconds) * 100))
      : 0;

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatSleepCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 sm:px-8 py-4 pb-28 max-w-xl mx-auto w-full">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleNotificationDrawer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isNotificationOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
          title="Ver Notificação de Mídia Android"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span>Notificação Android</span>
        </button>

        <div className="flex items-center gap-2">
          {playbackState.sleepTimerRemainingSeconds !== null && (
            <button
              onClick={onOpenSleepTimerModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold animate-pulse"
            >
              <Moon className="w-3 h-3" />
              <span>{formatSleepCountdown(playbackState.sleepTimerRemainingSeconds)}</span>
            </button>
          )}

          <button
            onClick={() => setShowChaptersList(!showChaptersList)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors"
            title="Lista de Capítulos"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapters Sheet Dropdown / Drawer */}
      {showChaptersList && (
        <div className="mb-4 p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl max-h-56 overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Capítulos ({book.chapters.length})
            </span>
            <button
              onClick={() => setShowChaptersList(false)}
              className="text-neutral-400 hover:text-white text-xs"
            >
              Fechar
            </button>
          </div>
          <div className="space-y-1">
            {book.chapters.map((ch, idx) => {
              const isCurrent = ch.id === chapter.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    onSelectChapter(ch.id);
                    setShowChaptersList(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span>{idx + 1}. </span>
                    <span>{ch.title}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                    {formatTime(ch.durationSeconds)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Center Cover Art Showcase */}
      <div className="my-auto py-4 flex flex-col items-center">
        <div className="relative group">
          <BookCoverArt book={book} size="xl" className="shadow-2xl" />
        </div>

        {/* Title & Metadata */}
        <div className="text-center mt-6 px-4 w-full">
          <h2 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">
            {chapter.title}
          </h2>
          <p className="text-sm font-semibold text-amber-400/90 truncate mt-1">
            {book.title}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mt-1">
            <span>{book.author}</span>
            {book.narrator && (
              <>
                <span aria-hidden="true">·</span>
                <span>Voz: {book.narrator}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scrubbers Section: Chapter Seekbar & Book Progress */}
      <div className="w-full mt-4 space-y-3">
        {/* Chapter progress slider */}
        <div>
          <input
            type="range"
            min={0}
            max={totalSeconds}
            value={currentSeconds}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
          />
          <div className="flex justify-between text-xs text-neutral-400 font-mono mt-1 px-0.5">
            <span>{formatTime(currentSeconds)}</span>
            <span>-{formatTime(Math.max(0, totalSeconds - currentSeconds))}</span>
          </div>
        </div>

        {/* Global Book Progress Mini Indicator */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
          <span>Progresso Total do Livro</span>
          <span className="font-mono text-amber-400 font-bold">{bookProgressPercent}%</span>
        </div>
      </div>

      {/* Primary Playback Controls (±30s, Play/Pause, Chapter Nav) */}
      <div className="w-full mt-6 flex items-center justify-between px-2 sm:px-6">
        {/* Previous Chapter */}
        <button
          onClick={onPreviousChapter}
          className="p-2.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800/80 transition-all active:scale-95"
          title="Capítulo Anterior"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Rewind 30s */}
        <button
          onClick={() => onRewind(settings.rewindSeconds)}
          className="p-3 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition-all active:scale-95 flex flex-col items-center justify-center relative"
          title={`Voltar ${settings.rewindSeconds}s`}
        >
          <RotateCcw className="w-7 h-7" />
          <span className="text-[9px] font-bold absolute text-white font-mono top-1/2 -translate-y-1/2">
            {settings.rewindSeconds}
          </span>
        </button>

        {/* Big Central Play/Pause Button */}
        <button
          onClick={onPlayPauseToggle}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl shadow-amber-500/30 transition-all active:scale-90"
          title={playbackState.isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {playbackState.isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        {/* Forward 30s */}
        <button
          onClick={() => onForward(settings.forwardSeconds)}
          className="p-3 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition-all active:scale-95 flex flex-col items-center justify-center relative"
          title={`Avançar ${settings.forwardSeconds}s`}
        >
          <RotateCw className="w-7 h-7" />
          <span className="text-[9px] font-bold absolute text-white font-mono top-1/2 -translate-y-1/2">
            {settings.forwardSeconds}
          </span>
        </button>

        {/* Next Chapter */}
        <button
          onClick={onNextChapter}
          className="p-2.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800/80 transition-all active:scale-95"
          title="Próximo Capítulo"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Bottom Toolbar (Speed, Sleep, Bookmark) */}
      <div className="w-full mt-8 grid grid-cols-3 gap-2">
        {/* Speed button with pitch lock indicator */}
        <button
          onClick={onOpenSpeedModal}
          className="py-2.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 text-center flex flex-col items-center justify-center gap-1 transition-colors active:scale-95"
        >
          <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
            <Gauge className="w-3.5 h-3.5" />
            <span>{playbackState.playbackSpeed.toFixed(1)}x</span>
          </div>
          <span className="text-[10px] text-neutral-400">Velocidade</span>
        </button>

        {/* Sleep Timer */}
        <button
          onClick={onOpenSleepTimerModal}
          className={`py-2.5 px-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${
            playbackState.sleepTimerRemainingSeconds !== null
              ? 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800/80 text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-1 text-xs font-bold">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {playbackState.sleepTimerRemainingSeconds !== null
                ? formatSleepCountdown(playbackState.sleepTimerRemainingSeconds)
                : 'Sleep'}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400">Timer</span>
        </button>

        {/* Bookmark Action */}
        <button
          onClick={onOpenBookmarkModal}
          className="py-2.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 text-center flex flex-col items-center justify-center gap-1 transition-colors active:scale-95"
        >
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Marcar</span>
          </div>
          <span className="text-[10px] text-neutral-400">Trecho</span>
        </button>
      </div>
    </div>
  );
};
