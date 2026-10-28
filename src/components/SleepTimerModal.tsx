import React, { useState } from 'react';
import { Moon, X, BellOff, Vibrate, Check, Play } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingSeconds: number | null;
  onSetTimer: (minutes: number, isEndOfChapter?: boolean) => void;
  onCancelTimer: () => void;
  onSimulateShake: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  remainingSeconds,
  onSetTimer,
  onCancelTimer,
  onSimulateShake
}) => {
  const [customMinutes, setCustomMinutes] = useState(20);
  const [shakeEnabled, setShakeEnabled] = useState(true);

  if (!isOpen) return null;

  const presets = [
    { label: '5 min', value: 5 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 }
  ];

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Temporizador de Sono</h3>
              <p className="text-xs text-neutral-400">Pausa suave com fade nos últimos 20s</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Countdown */}
        {remainingSeconds !== null ? (
          <div className="my-5 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 flex flex-col items-center">
            <span className="text-xs text-indigo-300 font-medium tracking-wide uppercase">
              Tempo Restante
            </span>
            <div className="text-4xl font-extrabold text-indigo-400 font-mono my-2 tracking-tight">
              {formatCountdown(remainingSeconds)}
            </div>
            <p className="text-xs text-neutral-400 text-center mb-4">
              O áudio esmaecerá suavemente antes de parar a reprodução.
            </p>

            <div className="flex items-center gap-2 w-full">
              <button
                onClick={onSimulateShake}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Simula o movimento do acelerômetro do smartphone"
              >
                <Vibrate className="w-4 h-4 text-amber-400" />
                <span>Simular Chacoalhar (+15m)</span>
              </button>

              <button
                onClick={() => {
                  onCancelTimer();
                }}
                className="py-2.5 px-4 rounded-xl bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 text-xs text-red-300 font-semibold transition-colors"
              >
                Desativar
              </button>
            </div>
          </div>
        ) : (
          <div className="my-5 space-y-4">
            {/* Quick Presets */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                Durações Rápidas
              </label>
              <div className="grid grid-cols-5 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => {
                      onSetTimer(p.value);
                      onClose();
                    }}
                    className="py-2.5 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-amber-600 hover:text-white text-neutral-300 transition-all border border-neutral-700/50 active:scale-95"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* End of chapter option */}
            <button
              onClick={() => {
                onSetTimer(0, true);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-left flex items-center justify-between text-sm transition-colors group"
            >
              <div>
                <span className="font-semibold text-neutral-200 group-hover:text-amber-400">
                  Ao Final do Capítulo
                </span>
                <p className="text-xs text-neutral-400">Pára assim que o capítulo atual terminar</p>
              </div>
              <Play className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
            </button>

            {/* Custom slider */}
            <div className="p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-neutral-400 font-medium">Tempo personalizado</span>
                <span className="text-amber-400 font-mono font-bold text-sm">{customMinutes} minutos</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <button
                onClick={() => {
                  onSetTimer(customMinutes);
                  onClose();
                }}
                className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
              >
                Iniciar com {customMinutes} min
              </button>
            </div>

            {/* Shake to Reset Feature */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/30 border border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Chacoalhar para Estender</span>
                  <span className="text-[11px] text-neutral-400 block">
                    Ao mover o aparelho na cama, adiciona tempo sem destravar a tela
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={shakeEnabled}
                onChange={(e) => setShakeEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500"
              />
            </div>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
