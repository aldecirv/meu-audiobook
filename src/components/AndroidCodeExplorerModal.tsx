import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidSourceFile } from '../data/androidProjectSource';
import { Code2, Folder, FileCode, Copy, Check, Download, Layers, ShieldCheck, Cpu, Smartphone, X } from 'lucide-react';

interface AndroidCodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeExplorerModal: React.FC<AndroidCodeExplorerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(ANDROID_PROJECT_FILES[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_PROJECT_FILES.find((f) => f.id === selectedFileId) || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Generate a downloadable text compilation of the full Android project
    let fullBundle = `======================================================\n`;
    fullBundle += `PROJETO ANDROID: MEU AUDIOBOOK\n`;
    fullBundle += `Stack: Kotlin + Jetpack Compose + Media3/ExoPlayer + Room\n`;
    fullBundle += `======================================================\n\n`;

    ANDROID_PROJECT_FILES.forEach((f) => {
      fullBundle += `\n/* ===================================================\n`;
      fullBundle += ` * ARQUIVO: ${f.path}\n`;
      fullBundle += ` * ${f.description}\n`;
      fullBundle += ` * =================================================== */\n\n`;
      fullBundle += f.code + `\n\n`;
    });

    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MeuAudiobook_Android_Project_Source.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[88vh] bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-neutral-100">
        {/* Top Modal Navigation Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Estrutura Completa Android (Kotlin)</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400">
                  Jetpack Compose · Media3 · Room
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Código nativo pronto para importar no Android Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors border border-neutral-700/50"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar Todos os Arquivos</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split: File Explorer + Source Code Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Android Project File Tree */}
          <div className="w-72 border-r border-neutral-800 bg-neutral-950/40 p-4 overflow-y-auto shrink-0">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Arquitetura do App</span>
            </div>

            <div className="space-y-1">
              {ANDROID_PROJECT_FILES.map((file) => {
                const isSelected = file.id === selectedFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                    <div className="min-w-0">
                      <p className="truncate leading-tight font-mono text-[11px]">{file.title}</p>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5">{file.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Architecture Highlights Pill Box */}
            <div className="mt-6 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Padrões de Produção:</span>
              </div>
              <p>• <strong className="text-neutral-300">Room 2.6:</strong> DAOs reativos com Kotlin Flow para biblioteca e marcadores.</p>
              <p>• <strong className="text-neutral-300">Media3 1.3:</strong> MediaSessionService desacoplado com SoundTouch para velocidade 0.5x–5.0x sem alterar tom.</p>
              <p>• <strong className="text-neutral-300">SensorManager:</strong> Detecção de chacoalhar (shake) com acelerômetro.</p>
            </div>
          </div>

          {/* Right Column: Code Viewer with Copy Button */}
          <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
            {/* File info bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-neutral-950/30">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400">{currentFile.path}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-400">{currentFile.description}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 flex items-center gap-1.5 transition-colors active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block with Line Numbers */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs bg-neutral-950 text-neutral-300 leading-relaxed">
              <pre className="overflow-x-auto whitespace-pre font-mono">
                {currentFile.code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
