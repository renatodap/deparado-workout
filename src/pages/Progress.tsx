import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Dumbbell,
  Flame,
  Target,
  Calendar,
  ChevronDown,
  Star
} from 'lucide-react';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { ProgressChart } from '../components/ProgressChart';
import { Stats, WorkoutLog, PersonalRecord, Page } from '../types';
import { exercises } from '../data/exercises';

interface ProgressProps {
  stats: Stats;
  workoutLogs: WorkoutLog[];
  onNavigate: (page: Page) => void;
  getWeekStats: () => { workoutsCompleted: number; totalVolume: number; workoutsPlanned: number };
}

export function Progress({ stats, workoutLogs, onNavigate, getWeekStats }: ProgressProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const weekStats = getWeekStats();

  const completedLogs = useMemo(() => {
    return workoutLogs.filter(log => log.completed);
  }, [workoutLogs]);

  const exercisesWithData = useMemo(() => {
    const exerciseIds = new Set<string>();
    completedLogs.forEach(log => {
      log.exercises.forEach(ex => {
        if (ex.sets.some(s => s.weight > 0)) {
          exerciseIds.add(ex.exerciseId);
        }
      });
    });
    return exercises.filter(ex => exerciseIds.has(ex.id));
  }, [completedLogs]);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const thisMonth = completedLogs.filter(log => {
      const date = new Date(log.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const lastMonth = completedLogs.filter(log => {
      const date = new Date(log.date);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
    });

    const thisMonthVolume = thisMonth.reduce((sum, log) => sum + log.totalVolume, 0);
    const lastMonthVolume = lastMonth.reduce((sum, log) => sum + log.totalVolume, 0);

    const volumeChange = lastMonthVolume > 0
      ? Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100)
      : 0;

    return {
      workouts: thisMonth.length,
      volume: thisMonthVolume,
      volumeChange
    };
  }, [completedLogs]);

  const consistency = useMemo(() => {
    if (completedLogs.length === 0) return 0;

    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const recentLogs = completedLogs.filter(log => new Date(log.date) >= fourWeeksAgo);
    const expectedWorkouts = 12; // 3 per week * 4 weeks

    return Math.min(100, Math.round((recentLogs.length / expectedWorkouts) * 100));
  }, [completedLogs]);

  const muscleBalance = useMemo(() => {
    let superior = 0;
    let inferior = 0;

    completedLogs.forEach(log => {
      log.exercises.forEach(ex => {
        const exercise = exercises.find(e => e.id === ex.exerciseId);
        if (exercise) {
          const volume = ex.sets.reduce((sum, s) => sum + (s.completed ? s.weight * s.reps : 0), 0);
          if (exercise.muscleGroup === 'superior') {
            superior += volume;
          } else if (exercise.muscleGroup === 'inferior') {
            inferior += volume;
          }
        }
      });
    });

    const total = superior + inferior;
    return {
      superior: total > 0 ? Math.round((superior / total) * 100) : 50,
      inferior: total > 0 ? Math.round((inferior / total) * 100) : 50
    };
  }, [completedLogs]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Meu Progresso" subtitle="Acompanhe sua evolução" />

      <main className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Week overview */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-3">Esta Semana</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{weekStats.workoutsCompleted}</p>
              <p className="text-xs opacity-75">de {weekStats.workoutsPlanned} treinos</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-3xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs opacity-75">semanas seguidas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{(weekStats.totalVolume / 1000).toFixed(1)}</p>
              <p className="text-xs opacity-75">toneladas</p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            icon={Dumbbell}
            label="Treinos Totais"
            value={stats.totalWorkouts}
            color="primary"
          />
          <StatsCard
            icon={Flame}
            label="Maior Streak"
            value={`${stats.longestStreak} sem`}
            color="accent"
          />
          <StatsCard
            icon={Target}
            label="Consistência"
            value={`${consistency}%`}
            subtitle="últimas 4 semanas"
            color="green"
          />
          <StatsCard
            icon={Award}
            label="Volume Total"
            value={`${(stats.totalVolumeAllTime / 1000).toFixed(1)}t`}
            color="blue"
          />
        </div>

        {/* Monthly comparison */}
        {monthlyStats.volumeChange !== 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                monthlyStats.volumeChange > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`w-6 h-6 ${
                  monthlyStats.volumeChange > 0 ? 'text-green-600' : 'text-red-600 rotate-180'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Comparado ao mês passado</p>
                <p className={`text-lg font-bold ${
                  monthlyStats.volumeChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {monthlyStats.volumeChange > 0 ? '+' : ''}{monthlyStats.volumeChange}% de volume
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Muscle balance */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Equilíbrio Muscular</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Superior</span>
                <span className="font-medium text-blue-600">{muscleBalance.superior}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${muscleBalance.superior}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Inferior</span>
                <span className="font-medium text-green-600">{muscleBalance.inferior}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${muscleBalance.inferior}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exercise progress chart */}
        {exercisesWithData.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Evolução por Exercício</h3>

            <div className="relative">
              <select
                value={selectedExercise || ''}
                onChange={(e) => setSelectedExercise(e.target.value || null)}
                className="w-full p-3 pr-10 bg-white rounded-xl border border-gray-200 text-gray-900 font-medium appearance-none cursor-pointer"
              >
                <option value="">Selecione um exercício</option>
                {exercisesWithData.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {selectedExercise && (
              <ProgressChart
                logs={completedLogs}
                exerciseId={selectedExercise}
                type="weight"
                title="Peso (kg)"
              />
            )}
          </div>
        )}

        {/* Volume chart */}
        {completedLogs.length >= 2 && (
          <ProgressChart
            logs={completedLogs}
            type="volume"
            title="Volume Semanal (kg)"
          />
        )}

        {/* Personal records */}
        {stats.personalRecords.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Recordes Pessoais
            </h3>

            <div className="space-y-2">
              {stats.personalRecords.slice(0, 6).map((record, index) => (
                <div
                  key={record.exerciseId}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.exerciseName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">{record.weight} kg</p>
                    <p className="text-xs text-gray-400">{record.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {completedLogs.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Complete treinos para ver seu progresso</p>
            <p className="text-sm text-gray-400 mt-1">
              Seus gráficos e estatísticas aparecerão aqui
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Progress;
