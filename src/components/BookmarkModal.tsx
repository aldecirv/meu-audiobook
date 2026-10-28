import React, { useState } from 'react';
import { Bookmark as BookmarkIcon, X, Clock, FileText, Check } from 'lucide-react';
import { Book, Chapter, Bookmark } from '../types/audiobook';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  chapter: Chapter;
  currentPositionSeconds: number;
  onSaveBookmark: (bookmark: Bookmark) => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  book,
  chapter,
  currentPositionSeconds,
  onSaveBookmark
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const formatTimestamp = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = Math.floor(totalSec % 60);
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      timestampSeconds: Math.round(currentPositionSeconds),
      title: title.trim() || `Marcador em ${formatTimestamp(currentPositionSeconds)}`,
      notes: notes.trim(),
      createdAt: Date.now()
    };
    onSaveBookmark(newBookmark);
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Criar Marcador</h3>
              <p className="text-xs text-neutral-400">Salvar trecho no banco de dados local Room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Pill */}
        <div className="my-4 p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 flex items-center justify-between text-xs">
          <div className="min-w-0 pr-2">
            <p className="font-semibold text-neutral-200 truncate">{book.title}</p>
            <p className="text-neutral-400 truncate">{chapter.title}</p>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimestamp(currentPositionSeconds)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Título do Marcador
            </label>
            <input
              type="text"
              placeholder={`Ex: Frase importante sobre o Bentinho...`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700/60 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Anotações / Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Adicione suas notas, citações ou reflexões sobre este trecho do audiolivro..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700/60 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Marcador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
