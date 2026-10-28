import React, { useState, useRef } from 'react';
import { FolderSearch, X, HardDrive, FileAudio, CheckCircle2, Upload, AlertCircle, Library } from 'lucide-react';
import { Book, Chapter } from '../types/audiobook';

interface FolderScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooksImported: (books: Book[]) => void;
}

export const FolderScannerModal: React.FC<FolderScannerModalProps> = ({
  isOpen,
  onClose,
  onBooksImported
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [foundBooks, setFoundBooks] = useState<Book[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Modern File System Directory Picker
  const handleDirectoryPicker = async () => {
    setIsScanning(true);
    setScanStatus('Solicitando acesso ao diretório do dispositivo...');

    try {
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        setScanStatus(`Lendo pasta "${dirHandle.name}" e subpastas...`);

        const audioFiles: { name: string; file: File; path: string }[] = [];

        async function readDirectory(handle: any, currentPath: string) {
          for await (const entry of handle.values()) {
            if (entry.kind === 'file') {
              const file = await entry.getFile();
              if (file.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|flac|wav|opus)$/i.test(file.name)) {
                audioFiles.push({ name: file.name, file, path: currentPath });
              }
            } else if (entry.kind === 'directory') {
              await readDirectory(entry, `${currentPath}/${entry.name}`);
            }
          }
        }

        await readDirectory(dirHandle, dirHandle.name);
        processScannedFiles(audioFiles);
      } else {
        // Fallback to file input
        fileInputRef.current?.click();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Directory read error:', err);
        setScanStatus('Erro ao ler pasta. Tentando seletor alternativo...');
        fileInputRef.current?.click();
      } else {
        setIsScanning(false);
        setScanStatus(null);
      }
    }
  };

  // HTML5 File input fallback
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    setScanStatus('Agrupando arquivos de áudio por pasta de livro...');

    const audioFiles: { name: string; file: File; path: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const webkitPath = (file as any).webkitRelativePath || file.name;
      const pathParts = webkitPath.split('/');
      const folderName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'Audiolivro Local';

      if (file.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|flac|wav|opus)$/i.test(file.name)) {
        audioFiles.push({
          name: file.name,
          file,
          path: folderName
        });
      }
    }

    processScannedFiles(audioFiles);
  };

  const processScannedFiles = (audioFiles: { name: string; file: File; path: string }[]) => {
    if (audioFiles.length === 0) {
      setScanStatus('Nenhum arquivo de áudio encontrado no diretório.');
      setIsScanning(false);
      return;
    }

    // Group files by folder (representing individual books)
    const folderGroups: Record<string, { name: string; file: File }[]> = {};
    for (const item of audioFiles) {
      const folder = item.path || 'Audiolivro Local';
      if (!folderGroups[folder]) folderGroups[folder] = [];
      folderGroups[folder].push({ name: item.name, file: item.file });
    }

    const createdBooks: Book[] = [];

    Object.entries(folderGroups).forEach(([folderName, files], index) => {
      // Sort chapter files naturally (01, 02, etc.)
      files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      const bookId = `imported-${Date.now()}-${index}`;
      const chapters: Chapter[] = files.map((f, chIndex) => {
        const objectUrl = URL.createObjectURL(f.file);
        const cleanTitle = f.name.replace(/\.[^/.]+$/, '').replace(/^[\d\s_\-]+/, '');
        return {
          id: `${bookId}-ch-${chIndex + 1}`,
          bookId,
          index: chIndex + 1,
          title: cleanTitle || `Capítulo ${chIndex + 1}`,
          durationSeconds: 1800, // estimated until playback
          audioSrc: objectUrl,
          fileName: f.name,
          fileSizeFormatted: `${(f.file.size / (1024 * 1024)).toFixed(1)} MB`
        };
      });

      const book: Book = {
        id: bookId,
        title: folderName.replace(/[\/\\]/g, ' - '),
        author: 'Autor Local',
        folderPath: `/Armazenamento/Audiobooks/${folderName}`,
        coverColor: '#b45309',
        coverArtStyle: 'modern',
        totalDurationSeconds: chapters.length * 1800,
        currentPositionSeconds: 0,
        currentChapterId: chapters[0]?.id || '',
        isCompleted: false,
        lastPlayedAt: Date.now(),
        chapters,
        isLocalFile: true
      };

      createdBooks.push(book);
    });

    setFoundBooks(createdBooks);
    setIsScanning(false);
    setScanStatus(`Encontrado ${createdBooks.length} livro(s) com ${audioFiles.length} arquivos de áudio!`);
  };

  const handleConfirmImport = () => {
    onBooksImported(foundBooks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          // @ts-ignore
          webkitdirectory="true"
          directory="true"
          accept="audio/*,.mp3,.m4a,.aac,.ogg,.flac"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <FolderSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Escanear Áudios do Aparelho</h3>
              <p className="text-xs text-neutral-400">Agrupamento inteligente por pasta (Livro)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="my-5 space-y-4">
          {foundBooks.length === 0 ? (
            <>
              <div className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-800 text-center">
                <HardDrive className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h4 className="font-semibold text-sm text-neutral-200">
                  Selecione sua pasta de Audiobooks
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Assim como no Smart AudioBook Player, cada subpasta é reconhecida como um livro, ordenando capítulos automaticamente.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={handleDirectoryPicker}
                    disabled={isScanning}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FolderSearch className="w-4 h-4" />
                    <span>{isScanning ? 'Escaneando...' : 'Selecionar Pasta de Audiobooks'}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Selecionar Múltiplos Arquivos de Áudio</span>
                  </button>
                </div>
              </div>

              {scanStatus && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{scanStatus}</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{scanStatus}</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {foundBooks.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-white truncate">{b.title}</p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {b.chapters.length} faixas encontradas
                      </p>
                    </div>
                    <FileAudio className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setFoundBooks([])}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-semibold rounded-xl"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Adicionar à Biblioteca</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
