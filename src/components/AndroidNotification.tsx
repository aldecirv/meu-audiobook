import React from 'react';
import { Book, Chapter } from '../types/audiobook';
import { AudioPlaybackState } from '../services/audioEngine';
import { BookCoverArt } from './BookCoverArt';
import { Play, Pause, RotateCcw, RotateCw, Headphones, Gauge, ChevronDown, CheckCircle2 } from 'lucide-react';

interface AndroidNotificationProps {
  book: Book;
  chapter: Chapter;
  playbackState: AudioPlaybackState;
  onPlayPause: () => void;
  onRewind30: () => void;
  onForward30: () => void;
  onSeek: (seconds: number) => void;
  onSpeedClick: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const AndroidNotification: React.FC<AndroidNotificationProps> = ({
  book,
  chapter,
  playbackState,
  onPlayPause,
  onRewind30,
  onForward30,
  onSeek,
  onSpeedClick,
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;

  const currentSeconds = Math.round(playbackState.currentTime);
  const totalSeconds = Math.round(playbackState.duration || chapter.durationSeconds || 300);
  const progressPercent = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-700/60 rounded-2xl p-3.5 shadow-2xl text-white transition-all duration-200">
      {/* Android Notification Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-2.5 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Headphones className="w-2.5 h-2.5" />
          </div>
          <span className="font-medium text-neutral-300">Meu Audiobook</span>
          <span className="text-neutral-500">·</span>
          <span className="text-[11px] text-amber-400/90 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Foreground Service
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          title="Recolher Notificação"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Media Card Body */}
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <BookCoverArt book={book} size="sm" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate leading-tight">
            {chapter.title}
          </h4>
          <p className="text-xs text-neutral-400 truncate mt-0.5">
            {book.title} · {book.author}
          </p>

          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-400">
            <button
              onClick={onSpeedClick}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-mono text-[10px] transition-colors"
            >
              <Gauge className="w-2.5 h-2.5" />
              <span>{playbackState.playbackSpeed.toFixed(1)}x</span>
            </button>
            <span>Pitch Travado</span>
          </div>
        </div>
      </div>

      {/* Media Scrubber Slider */}
      <div className="mt-3">
        <input
          type="range"
          min={0}
          max={totalSeconds}
          value={currentSeconds}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
          <span>{formatTime(currentSeconds)}</span>
          <span>-{formatTime(Math.max(0, totalSeconds - currentSeconds))}</span>
        </div>
      </div>

      {/* Android Notification Action Controls */}
      <div className="flex items-center justify-center gap-6 mt-2 pt-1">
        <button
          onClick={onRewind30}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-colors active:scale-95 flex items-center justify-center"
          title="Voltar 30 segundos"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayPause}
          className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          title={playbackState.isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {playbackState.isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={onForward30}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-colors active:scale-95 flex items-center justify-center"
          title="Avançar 30 segundos"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
