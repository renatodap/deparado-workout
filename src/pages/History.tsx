import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Dumbbell, Clock, Filter } from 'lucide-react';
import { Header } from '../components/Header';
import { WorkoutLogCard } from '../components/WorkoutCard';
import { CalendarHeatmap } from '../components/ProgressChart';
import { Modal } from '../components/Modal';
import { WorkoutLog, Page } from '../types';

interface HistoryProps {
  workoutLogs: WorkoutLog[];
  onNavigate: (page: Page) => void;
}

export function History({ workoutLogs, onNavigate }: HistoryProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const completedLogs = useMemo(() => {
    return workoutLogs.filter(log => log.completed);
  }, [workoutLogs]);

  const filteredLogs = useMemo(() => {
    let logs = completedLogs;

    if (filter !== 'all') {
      logs = logs.filter(log => log.workoutPlanId === filter);
    }

    // Sort by date descending
    return [...logs].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [completedLogs, filter]);

  const monthLogs = useMemo(() => {
    return completedLogs.filter(log => {
      const date = new Date(log.date);
      return date.getFullYear() === currentMonth.year &&
             date.getMonth() === currentMonth.month;
    });
  }, [completedLogs, currentMonth]);

  const navigateMonth = (delta: number) => {
    setCurrentMonth(prev => {
      let newMonth = prev.month + delta;
      let newYear = prev.year;

      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }

      return { year: newYear, month: newMonth };
    });
  };

  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const feelingEmojis = ['', '😫', '😕', '😐', '😊', '🤩'];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header
        title="Histórico"
        subtitle={`${completedLogs.length} treinos realizados`}
      />

      <main className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-900 capitalize">{monthName}</span>
          <button
            onClick={() => navigateMonth(1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar heatmap */}
        <CalendarHeatmap
          logs={completedLogs}
          year={currentMonth.year}
          month={currentMonth.month}
        />

        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span>Filtrar:</span>
          </div>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'treino-a', label: 'Treino A' },
            { id: 'treino-b', label: 'Treino B' },
            { id: 'treino-c', label: 'Treino C' }
          ].map(option => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === option.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Workout list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Treinos Recentes</h3>

          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum treino encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                Complete seu primeiro treino para ver o histórico
              </p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <WorkoutLogCard
                key={log.id}
                log={log}
                onClick={() => setSelectedLog(log)}
              />
            ))
          )}
        </div>
      </main>

      {/* Workout detail modal */}
      <Modal
        isOpen={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        title={selectedLog?.workoutName}
        size="lg"
      >
        {selectedLog && (
          <div className="p-4 space-y-4">
            {/* Date and feeling */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(selectedLog.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
              {selectedLog.feeling && (
                <span className="text-2xl">{feelingEmojis[selectedLog.feeling]}</span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                <p className="font-bold text-gray-900">
                  {selectedLog.endTime
                    ? Math.round(
                        (new Date(selectedLog.endTime).getTime() -
                          new Date(selectedLog.startTime).getTime()) /
                          1000 /
                          60
                      )
                    : 0}{' '}
                  min
                </p>
                <p className="text-xs text-gray-500">Duração</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Dumbbell className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                <p className="font-bold text-gray-900">
                  {selectedLog.totalVolume.toLocaleString('pt-BR')} kg
                </p>
                <p className="text-xs text-gray-500">Volume Total</p>
              </div>
            </div>

            {/* Exercises */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Exercícios</h4>
              <div className="space-y-2">
                {selectedLog.exercises.map((exercise, index) => {
                  const completedSets = exercise.sets.filter(s => s.completed).length;
                  const maxWeight = Math.max(...exercise.sets.map(s => s.weight), 0);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {exercise.exerciseName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {completedSets} séries completadas
                        </p>
                      </div>
                      {maxWeight > 0 && (
                        <span className="font-bold text-primary-600">
                          {maxWeight} kg
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {selectedLog.notes && (
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-sm text-amber-700 italic">
                  "{selectedLog.notes}"
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default History;
