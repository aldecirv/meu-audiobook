import React from 'react';
import { PlayerSettings } from '../types/audiobook';
import {
  Moon,
  Sun,
  Shield,
  RotateCcw,
  Vibrate,
  Code2,
  RefreshCw,
  Target,
  Sparkles,
  Info
} from 'lucide-react';

interface SettingsScreenProps {
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  onResetSampleData: () => void;
  onOpenAndroidCodeModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetSampleData,
  onOpenAndroidCodeModal
}) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 sm:px-6 py-4 pb-28">
      {/* Top Banner */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Configurações do Player</h2>
        <p className="text-xs text-neutral-400">
          Personalização do aplicativo offline estilo Smart AudioBook Player
        </p>
      </div>

      <div className="space-y-4">
        {/* Android Code Explorer Promo Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-800/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Código Nativo Android (Kotlin)</h3>
              <p className="text-[11px] text-neutral-400">
                Ver arquivos Jetpack Compose, Media3 e Room
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAndroidCodeModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shrink-0 transition-colors shadow-sm"
          >
            Abrir Código
          </button>
        </div>

        {/* Section: Appearance (Theme Dark / Light) */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
            Aparência & Tema
          </span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.themeMode === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <span className="text-xs font-semibold text-white block">Tema Noturno / Claro</span>
                <span className="text-[11px] text-neutral-400 block">
                  Alto contraste otimizado para audiolivros
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-800 rounded-xl">
              <button
                onClick={() => onUpdateSettings({ themeMode: 'dark' })}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  settings.themeMode === 'dark'
                    ? 'bg-amber-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Escuro
              </button>
              <button
                onClick={() => onUpdateSettings({ themeMode: 'light' })}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  settings.themeMode === 'light'
                    ? 'bg-amber-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Claro
              </button>
            </div>
          </div>
        </div>

        {/* Section: Playback Ergonomics */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
            Reprodução & Saltos
          </span>

          {/* Jump Interval Rewind */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Salto de Volta</span>
              <span className="text-[11px] text-neutral-400 block">Tempo ao clicar no botão de voltar</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-neutral-800 rounded-xl">
              {[10, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onUpdateSettings({ rewindSeconds: sec })}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                    settings.rewindSeconds === sec
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Jump Interval Forward */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Salto de Avanço</span>
              <span className="text-[11px] text-neutral-400 block">Tempo ao clicar no botão de avançar</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-neutral-800 rounded-xl">
              {[30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onUpdateSettings({ forwardSeconds: sec })}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                    settings.forwardSeconds === sec
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Smart Auto Rewind on Pause */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="pr-4">
              <span className="text-xs font-semibold text-white block">
                Retomada Automática Inteligente
              </span>
              <span className="text-[11px] text-neutral-400 block">
                Volta 5 segundos automaticamente se o livro ficou pausado por mais de 5 minutos
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoRewindOnPause: !settings.autoRewindOnPause })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                settings.autoRewindOnPause ? 'bg-amber-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoRewindOnPause ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Offline & Zero Ads Guarantee */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              100% Offline & Sem Anúncios
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Seus arquivos de áudio permanecem exclusivamente no seu aparelho. O banco de dados Room (e armazenamento local) não envia dados para a nuvem.
          </p>
        </div>

        {/* Reset / Restore sample data button */}
        <div className="pt-2">
          <button
            onClick={onResetSampleData}
            className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Livros Clássicos de Exemplo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
