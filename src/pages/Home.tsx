import {
  Dumbbell,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Header } from '../components/Header';
import { WorkoutCard } from '../components/WorkoutCard';
import { StatsCard, MiniStats } from '../components/StatsCard';
import { getNextWorkout, getTodayWorkout, getRandomQuote } from '../data/workouts';
import { User, Stats, WorkoutLog, Page } from '../types';
import { useMemo } from 'react';

interface HomeProps {
  user: User;
  stats: Stats;
  workoutLogs: WorkoutLog[];
  onNavigate: (page: Page) => void;
  onStartWorkout: () => void;
  getWeekStats: () => { workoutsCompleted: number; totalVolume: number; workoutsPlanned: number };
}

export function Home({
  user,
  stats,
  workoutLogs,
  onNavigate,
  onStartWorkout,
  getWeekStats
}: HomeProps) {
  const todayWorkout = getTodayWorkout();
  const { workout: nextWorkout, daysUntil } = getNextWorkout();
  const weekStats = getWeekStats();
  const quote = useMemo(() => getRandomQuote(), []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const hasWorkoutToday = todayWorkout !== null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header
        title={`${getGreeting()}, ${user.name}!`}
        subtitle="Pronta para treinar?"
        showProfile
        onProfileClick={() => onNavigate('profile')}
      />

      <main className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 text-white shadow-lg shadow-primary-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-lg font-medium leading-snug">
                {quote.text} {quote.emoji}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Workout Card */}
        {hasWorkoutToday ? (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Treino de Hoje</h2>
            <WorkoutCard
              workout={todayWorkout}
              isToday
              onClick={onStartWorkout}
            />
            <button
              onClick={onStartWorkout}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all touch-feedback shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-6 h-6" />
              COMEÇAR TREINO
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Próximo Treino</h2>
            <WorkoutCard
              workout={nextWorkout}
              daysUntil={daysUntil}
              onClick={() => onNavigate('workout')}
            />
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-gray-600">
                Hoje é dia de descanso! Aproveite para recuperar.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Seu próximo treino é {daysUntil === 1 ? 'amanhã' : `em ${daysUntil} dias`}.
              </p>
            </div>
          </div>
        )}

        {/* Week Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Esta Semana</h2>
            <button
              onClick={() => onNavigate('progress')}
              className="text-sm text-primary-600 font-medium flex items-center gap-1"
            >
              Ver mais <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              <MiniStats
                label="Treinos"
                value={`${weekStats.workoutsCompleted}/${weekStats.workoutsPlanned}`}
                icon={Target}
              />
              <MiniStats
                label="Streak"
                value={`${stats.currentStreak}🔥`}
                icon={Flame}
              />
              <MiniStats
                label="Volume"
                value={`${(weekStats.totalVolume / 1000).toFixed(1)}t`}
                icon={TrendingUp}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            icon={Dumbbell}
            label="Total de Treinos"
            value={stats.totalWorkouts}
            color="primary"
            size="sm"
          />
          <StatsCard
            icon={Flame}
            label="Maior Streak"
            value={`${stats.longestStreak} sem`}
            color="accent"
            size="sm"
          />
        </div>

        {/* Recent Workouts Preview */}
        {workoutLogs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Últimos Treinos</h2>
              <button
                onClick={() => onNavigate('history')}
                className="text-sm text-primary-600 font-medium flex items-center gap-1"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {workoutLogs
                .filter(log => log.completed)
                .slice(-3)
                .reverse()
                .map(log => {
                  const date = new Date(log.date);
                  return (
                    <div
                      key={log.id}
                      className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{log.workoutName}</p>
                          <p className="text-sm text-gray-500">
                            {date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">
                          {log.totalVolume.toLocaleString('pt-BR')} kg
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* First workout encouragement */}
        {workoutLogs.length === 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-200 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              Bem-vinda, {user.name}!
            </h3>
            <p className="text-amber-700">
              Comece seu primeiro treino e inicie sua jornada de transformação!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
