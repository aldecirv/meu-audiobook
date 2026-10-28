import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types/audiobook';
import {
  Library,
  PlayCircle,
  Bookmark as BookmarkIcon,
  BarChart3,
  Settings,
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  Code2
} from 'lucide-react';

interface AndroidFrameProps {
  activeTab: ActiveTab | 'settings';
  onTabChange: (tab: ActiveTab | 'settings') => void;
  children: React.ReactNode;
  isPlaying: boolean;
  onOpenAndroidCodeModal: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  activeTab,
  onTabChange,
  children,
  isPlaying,
  onOpenAndroidCodeModal
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('09:41');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'library', label: 'Biblioteca', icon: Library },
    { id: 'player', label: 'Player', icon: PlayCircle },
    { id: 'bookmarks', label: 'Marcadores', icon: BookmarkIcon },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'settings', label: 'Ajustes', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-0 sm:p-4 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Application Desktop Toolbar */}
      <header className="w-full max-w-5xl flex items-center justify-between gap-4 px-4 py-3 mb-2 border-b border-neutral-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black shadow-md shadow-amber-500/20">
            MA
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Meu Audiobook
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-neutral-700/60 font-semibold">
                Kotlin · Compose · Media3 · Room
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between Phone Frame and Responsive View */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors"
            title={isPhoneFrame ? 'Expandir para Tela Cheia' : 'Enquadrar em Smartphone Android'}
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Tela Expandida</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Moldura Android</span>
              </>
            )}
          </button>

          {/* Android Code Explorer Button */}
          <button
            onClick={onOpenAndroidCodeModal}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código Kotlin / Room</span>
          </button>
        </div>
      </header>

      {/* Main Container: Either Phone Shell or Wide Modern View */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame
            ? 'max-w-[430px] h-[92vh] max-h-[880px] bg-neutral-950 rounded-[48px] border-[10px] border-neutral-800 shadow-2xl relative overflow-hidden'
            : 'max-w-4xl h-[90vh] bg-neutral-950 rounded-3xl border border-neutral-800/80 shadow-2xl overflow-hidden'
        }`}
      >
        {/* Android Status Bar */}
        <div className="h-10 px-6 pt-2 pb-1 flex items-center justify-between text-xs text-neutral-400 select-none bg-neutral-950/80 backdrop-blur-md z-30 shrink-0">
          <span className="font-semibold text-neutral-200 font-mono text-[11px]">{currentTimeStr}</span>

          {/* Camera Notch Punchhole for phone frame */}
          {isPhoneFrame && (
            <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-800" />
          )}

          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Reproduzindo" />
            )}
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Dynamic Screen Viewport */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-neutral-950">
          {children}
        </div>

        {/* Android Material 3 Bottom Navigation Bar */}
        <nav className="h-16 border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md flex items-center justify-around px-2 z-40 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex-1 py-1 flex flex-col items-center justify-center relative group"
              >
                <div
                  className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-400 font-bold'
                      : 'text-neutral-400 hover:text-white group-hover:bg-neutral-800/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-1 transition-colors ${
                    isSelected ? 'text-amber-400 font-bold' : 'text-neutral-500 group-hover:text-neutral-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Android Gesture Navigation Bar indicator */}
        <div className="h-3 w-full flex items-center justify-center bg-neutral-950 pb-1 shrink-0">
          <div className="w-32 h-1 bg-neutral-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
