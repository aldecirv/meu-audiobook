import React, { useState } from 'react';
import { Book } from '../types/audiobook';
import { BookCoverArt } from '../components/BookCoverArt';
import { FolderSearch, Search, Play, CheckCircle2, Clock, BookOpen, Sparkles, Filter } from 'lucide-react';

interface LibraryScreenProps {
  books: Book[];
  activeBook: Book | null;
  onSelectBook: (book: Book, autoPlay?: boolean) => void;
  onOpenFolderScanner: () => void;
  playbackSpeed: number;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  books,
  activeBook,
  onSelectBook,
  onOpenFolderScanner,
  playbackSpeed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.folderPath.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'in_progress') {
      return !b.isCompleted && b.currentPositionSeconds > 0;
    }
    if (filterTab === 'completed') {
      return b.isCompleted;
    }
    return true;
  });

  const formatRemainingTime = (totalSeconds: number, currentPositionSeconds: number) => {
    const remainingRaw = Math.max(0, totalSeconds - currentPositionSeconds);
    const speedAdjusted = Math.round(remainingRaw / playbackSpeed);

    const hours = Math.floor(speedAdjusted / 3600);
    const minutes = Math.floor((speedAdjusted % 3600) / 60);

    if (hours > 0) return `${hours}h ${minutes}m restantes`;
    return `${minutes}m restantes`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 px-4 sm:px-6 pt-4">
      {/* Top Banner / Device Folder Scanner Prompt */}
      <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <FolderSearch className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Escanear Pastas do Dispositivo</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Reconhece pastas de livros locais offline e organiza capítulos
            </p>
          </div>
        </div>
        <button
          onClick={onOpenFolderScanner}
          className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-2"
        >
          <FolderSearch className="w-4 h-4" />
          <span>Escanear Pasta</span>
        </button>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por livro, autor ou pasta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900/80 rounded-xl border border-neutral-800">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
              filterTab === 'all'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todos ({books.length})
          </button>
          <button
            onClick={() => setFilterTab('in_progress')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
              filterTab === 'in_progress'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Em Andamento
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
              filterTab === 'completed'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Concluídos
          </button>
        </div>
      </div>

      {/* Books List Grid */}
      {filteredBooks.length === 0 ? (
        <div className="my-auto py-12 text-center">
          <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-300">Nenhum livro encontrado</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            {searchQuery ? 'Tente outros termos de pesquisa' : 'Escaneie uma pasta com audiolivros'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBooks.map((book) => {
            const isActive = activeBook?.id === book.id;
            const progressFraction =
              book.totalDurationSeconds > 0
                ? Math.min(1, book.currentPositionSeconds / book.totalDurationSeconds)
                : 0;
            const progressPercent = Math.round(progressFraction * 100);

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book, false)}
                className={`group p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-neutral-900 border-amber-500/50 shadow-xl shadow-amber-950/20'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-neutral-700/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Book Cover */}
                  <div className="shrink-0 group-hover:scale-[1.02] transition-transform">
                    <BookCoverArt book={book} size="md" />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1">
                      <span className="truncate">{book.author}</span>
                      {book.isCompleted && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Concluído
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {book.title}
                    </h3>

                    {book.narrator && (
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        Voz: {book.narrator}
                      </p>
                    )}

                    <p className="text-[10px] text-neutral-400 font-mono truncate mt-1">
                      {book.folderPath}
                    </p>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                    <span className="text-amber-400 font-semibold">{progressPercent}%</span>
                    <span className="text-neutral-400 text-[10px]">
                      {book.isCompleted
                        ? 'Livro finalizado'
                        : formatRemainingTime(book.totalDurationSeconds, book.currentPositionSeconds)}
                    </span>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        book.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {book.chapters.length} capítulos
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBook(book, true);
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{book.currentPositionSeconds > 0 ? 'Continuar' : 'Iniciar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
