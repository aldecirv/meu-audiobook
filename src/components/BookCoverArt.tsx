import React from 'react';
import { Book } from '../types/audiobook';
import { BookOpen, Headphones, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface BookCoverArtProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({ book, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-16 text-[8px]',
    md: 'w-18 h-24 text-[10px]',
    lg: 'w-36 h-48 text-xs',
    xl: 'w-56 h-72 text-sm'
  }[size];

  // If a custom image exists, render it
  if (book.coverImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-xl shadow-md border border-neutral-700/30 ${sizeClasses} ${className}`}>
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Generative Stylized Book Covers
  const getThemeStyles = () => {
    switch (book.coverArtStyle) {
      case 'machado':
        return {
          bg: 'bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900',
          accent: 'text-amber-300',
          border: 'border-amber-700/40',
          icon: BookOpen,
          badge: 'Machado de Assis'
        };
      case 'alienista':
        return {
          bg: 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950',
          accent: 'text-emerald-300',
          border: 'border-emerald-700/40',
          icon: ShieldAlert,
          badge: 'Clássico Psicológico'
        };
      case 'verne':
        return {
          bg: 'bg-gradient-to-br from-cyan-950 via-sky-900 to-blue-950',
          accent: 'text-cyan-300',
          border: 'border-cyan-700/40',
          icon: Compass,
          badge: 'Ficção & Aventura'
        };
      case 'classic':
        return {
          bg: 'bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-950',
          accent: 'text-purple-300',
          border: 'border-purple-700/40',
          icon: Sparkles,
          badge: 'Literatura Brasileira'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-stone-900 via-zinc-800 to-neutral-900',
          accent: 'text-amber-400',
          border: 'border-stone-700/40',
          icon: Headphones,
          badge: 'Audiobook'
        };
    }
  };

  const theme = getThemeStyles();
  const IconComponent = theme.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg border ${theme.border} ${theme.bg} ${sizeClasses} ${className} flex flex-col justify-between p-2 select-none group transition-transform duration-200`}
      style={{
        boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.4), inset 2px 0 6px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Book Spine Texture on Left Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />

      {/* Decorative Gold Filigree Border Inside */}
      <div className="absolute inset-1 border border-white/10 rounded-lg pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-white/70">
        <span className="text-[9px] font-semibold tracking-wider uppercase opacity-80 truncate max-w-[85%]">
          {book.author}
        </span>
        <IconComponent className={`w-3.5 h-3.5 ${theme.accent} shrink-0`} />
      </div>

      {/* Center Art Motif */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-1">
        <div className={`p-2 rounded-full bg-white/5 border border-white/10 mb-1 ${theme.accent}`}>
          <IconComponent className={size === 'xl' ? 'w-8 h-8' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
        </div>
        <p className="font-bold text-white leading-tight line-clamp-2 drop-shadow-sm font-serif">
          {book.title}
        </p>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1 text-[8px] text-white/60">
        <span className="truncate">{book.chapters.length} cap.</span>
        <span className="font-mono">{Math.round(book.totalDurationSeconds / 3600)}h</span>
      </div>
    </div>
  );
};
