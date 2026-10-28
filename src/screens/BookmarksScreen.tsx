import React, { useState } from 'react';
import { Bookmark, Book } from '../types/audiobook';
import { Bookmark as BookmarkIcon, Clock, Trash2, Play, BookOpen, Search, Plus } from 'lucide-react';

interface BookmarksScreenProps {
  bookmarks: Bookmark[];
  books: Book[];
  activeBook: Book | null;
  onJumpToBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onOpenCreateBookmark: () => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  bookmarks,
  books,
  activeBook,
  onJumpToBookmark,
  onDeleteBookmark,
  onOpenCreateBookmark
}) => {
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter((bm) => {
    const matchesBook = selectedBookFilter === 'all' || bm.bookId === selectedBookFilter;
    const matchesSearch =
      bm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bm.notes && bm.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      bm.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bm.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBook && matchesSearch;
  });

  const formatTimestamp = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 sm:px-6 py-4 pb-28">
      {/* Top Banner with Add Bookmark Action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Marcadores Salvos</h2>
          <p className="text-xs text-neutral-400">
            Armazenamento permanente local Room no aparelho
          </p>
        </div>
        <button
          onClick={onOpenCreateBookmark}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Marcador</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar marcadores e anotações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>

        {/* Book filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedBookFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedBookFilter === 'all'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Todos os Livros ({bookmarks.length})
          </button>

          {books.map((b) => {
            const count = bookmarks.filter((bm) => bm.bookId === b.id).length;
            if (count === 0) return null;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBookFilter(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  selectedBookFilter === b.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {b.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="my-auto py-12 text-center">
          <BookmarkIcon className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-300">Nenhum marcador encontrado</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? 'Tente outra busca'
              : 'Clique no ícone de marcador durante a reprodução para salvar trechos memoráveis'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-1">
                    <span className="font-semibold text-amber-400 truncate">{bookmark.bookTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{bookmark.chapterTitle}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-tight">
                    {bookmark.title}
                  </h4>

                  {bookmark.notes && (
                    <p className="text-xs text-neutral-300 mt-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 italic leading-relaxed">
                      "{bookmark.notes}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1 font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(bookmark.timestampSeconds)}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {formatDate(bookmark.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/80">
                <button
                  onClick={() => onJumpToBookmark(bookmark)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ouvir deste Ponto</span>
                </button>

                <button
                  onClick={() => onDeleteBookmark(bookmark.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                  title="Excluir Marcador"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
