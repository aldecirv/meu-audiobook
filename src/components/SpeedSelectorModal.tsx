import React from 'react';
import { Gauge, X, Music, Check, Clock } from 'lucide-react';

interface SpeedSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpeed: number;
  preservePitch: boolean;
  onSelectSpeed: (speed: number) => void;
  onTogglePitch: (preserve: boolean) => void;
  remainingBookSeconds: number;
}

export const SpeedSelectorModal: React.FC<SpeedSelectorModalProps> = ({
  isOpen,
  onClose,
  currentSpeed,
  preservePitch,
  onSelectSpeed,
  onTogglePitch,
  remainingBookSeconds
}) => {
  if (!isOpen) return null;

  const presets = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0];

  const calculatedRemaining = Math.round(remainingBookSeconds / currentSpeed);
  const formatHoursMinutes = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} minutos`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Velocidade de Reprodução</h3>
              <p className="text-xs text-neutral-400">0.5x até 5.0x com tom vocal preservado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Speed Value Display & Impact */}
        <div className="my-5 p-4 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex flex-col items-center">
          <div className="text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
            {currentSpeed.toFixed(2)}x
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Tempo restante no livro: </span>
            <span className="text-white font-semibold font-mono">{formatHoursMinutes(calculatedRemaining)}</span>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="mb-6">
          <input
            type="range"
            min={0.5}
            max={5.0}
            step={0.05}
            value={currentSpeed}
            onChange={(e) => onSelectSpeed(Number(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1 px-1">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
            <span>3.5x</span>
            <span>5.0x</span>
          </div>
        </div>

        {/* Quick Presets Grid */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
            Atalhos Rápidos
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((speed) => {
              const isSelected = Math.abs(currentSpeed - speed) < 0.04;
              return (
                <button
                  key={speed}
                  onClick={() => onSelectSpeed(speed)}
                  className={`py-2 px-1 text-xs font-mono font-semibold rounded-xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-neutral-950 shadow-md font-bold'
                      : 'bg-neutral-800/70 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {speed.toFixed(speed % 1 === 0 ? 1 : 2)}x
                </button>
              );
            })}
          </div>
        </div>

        {/* Pitch Preservation Switch (Media3 / ExoPlayer SoundTouch) */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-800/30 border border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Music className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-semibold text-white block">Preservar Tom da Voz (Pitch)</span>
              <span className="text-[11px] text-neutral-400 block">
                Evita efeito de voz aguda ou distorcida
              </span>
            </div>
          </div>
          <button
            onClick={() => onTogglePitch(!preservePitch)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              preservePitch ? 'bg-emerald-500' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                preservePitch ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
