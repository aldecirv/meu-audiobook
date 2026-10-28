import React from 'react';
import { DailyListeningStat, Book, PlayerSettings } from '../types/audiobook';
import { Flame, Clock, Award, BookCheck, Gauge, TrendingUp, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatsScreenProps {
  stats: DailyListeningStat[];
  books: Book[];
  settings: PlayerSettings;
  onSimulateListeningTime: (minutes: number) => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  stats,
  books,
  settings,
  onSimulateListeningTime
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayStat = stats.find((s) => s.date === todayStr);
  const todayMinutes = todayStat ? todayStat.minutesListened : 0;

  // Calculate streak (consecutive active days)
  let streak = 0;
  const sortedStats = [...stats].sort((a, b) => b.date.localeCompare(a.date));
  let checkDate = new Date();

  for (let i = 0; i < 30; i++) {
    const dateKey = checkDate.toISOString().split('T')[0];
    const statItem = stats.find((s) => s.date === dateKey);
    if (statItem && statItem.minutesListened > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      // today might be 0 yet, check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Lifetime aggregates
  const totalMinutesAllTime = stats.reduce((acc, curr) => acc + curr.minutesListened, 0);
  const totalHoursAllTime = (totalMinutesAllTime / 60).toFixed(1);
  const completedBooksCount = books.filter((b) => b.isCompleted).length;

  // Last 7 days for the chart
  const last7Days: { dateStr: string; label: string; minutes: number }[] = [];
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const stat = stats.find((s) => s.date === dateStr);
    last7Days.push({
      dateStr,
      label: daysOfWeek[d.getDay()],
      minutes: stat ? stat.minutesListened : 0
    });
  }

  const maxMinutesInWeek = Math.max(60, ...last7Days.map((d) => d.minutes));

  const goalPercent = Math.min(100, Math.round((todayMinutes / settings.dailyGoalMinutes) * 100));

  const handleCelebrateGoal = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onSimulateListeningTime(15);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 sm:px-6 py-4 pb-28">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Estatísticas de Escuta</h2>
          <p className="text-xs text-neutral-400">
            Registro diário offline e métricas de hábito
          </p>
        </div>

        <button
          onClick={handleCelebrateGoal}
          className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-amber-500/30"
          title="Adiciona 15 minutos ao histórico para simular leitura de teste"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+15 min (Testar)</span>
        </button>
      </div>

      {/* Hero Metric Cards (Today & Streak) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Today Card */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Hoje
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-extrabold text-white font-mono">
              {todayMinutes}
              <span className="text-sm font-sans font-normal text-neutral-400 ml-1">min</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Meta diária ({settings.dailyGoalMinutes}m)</span>
              <span className="font-mono text-amber-400 font-bold">{goalPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Sequência
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-extrabold text-orange-400 font-mono flex items-center gap-1">
              <span>{streak}</span>
              <span className="text-sm font-sans font-normal text-neutral-400">dias</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400">
            {streak >= 3 ? 'Hábito constante mantido!' : 'Escute diariamente para subir'}
          </p>
        </div>
      </div>

      {/* Weekly Listening Bar Chart */}
      <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Últimos 7 Dias</h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            Média: {Math.round(last7Days.reduce((a, b) => a + b.minutes, 0) / 7)} min/dia
          </span>
        </div>

        {/* Chart Visualization */}
        <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
          {last7Days.map((day) => {
            const heightPercent = Math.max(12, Math.round((day.minutes / maxMinutesInWeek) * 100));
            const isToday = day.dateStr === todayStr;

            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-neutral-400 opacity-80 group-hover:opacity-100">
                  {day.minutes > 0 ? `${day.minutes}m` : '-'}
                </span>

                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    className={`w-full rounded-xl transition-all duration-300 ${
                      isToday
                        ? 'bg-amber-500 shadow-md shadow-amber-500/20'
                        : day.minutes > 0
                        ? 'bg-neutral-700 hover:bg-neutral-600'
                        : 'bg-neutral-800/60'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span
                  className={`text-[11px] font-medium ${
                    isToday ? 'text-amber-400 font-bold' : 'text-neutral-500'
                  }`}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Aggregates Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
          <BookCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
          <div className="text-lg font-extrabold text-white font-mono">{completedBooksCount}</div>
          <p className="text-[10px] text-neutral-400">Livros Concluídos</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
          <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
          <div className="text-lg font-extrabold text-white font-mono">{totalHoursAllTime}h</div>
          <p className="text-[10px] text-neutral-400">Total Ouvido</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
          <Gauge className="w-4 h-4 text-purple-400 mx-auto mb-1.5" />
          <div className="text-lg font-extrabold text-white font-mono">{settings.playbackSpeed.toFixed(1)}x</div>
          <p className="text-[10px] text-neutral-400">Velocidade Atual</p>
        </div>
      </div>
    </div>
  );
};
