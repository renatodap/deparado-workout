import { Calendar, Clock, Dumbbell, ChevronRight, Star } from 'lucide-react';
import { WorkoutPlan, WorkoutLog } from '../types';

interface WorkoutCardProps {
  workout: WorkoutPlan;
  daysUntil?: number;
  onClick?: () => void;
  isToday?: boolean;
}

export function WorkoutCard({
  workout,
  daysUntil = 0,
  onClick,
  isToday = false
}: WorkoutCardProps) {
  const getDaysText = () => {
    if (daysUntil === 0) return 'Hoje';
    if (daysUntil === 1) return 'Amanhã';
    return `Em ${daysUntil} dias`;
  };

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer touch-feedback ${
        isToday ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isToday && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                HOJE
              </span>
            )}
            {workout.isOptional && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                OPCIONAL
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{workout.name}</h3>
          <p className="text-sm text-gray-500">{workout.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>{workout.dayOfWeek}</span>
        </div>
        <div className="flex items-center gap-1">
          <Dumbbell className="w-4 h-4 text-primary-500" />
          <span>{workout.exercises.length} exercícios</span>
        </div>
        {daysUntil >= 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{getDaysText()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface WorkoutLogCardProps {
  log: WorkoutLog;
  onClick?: () => void;
}

export function WorkoutLogCard({ log, onClick }: WorkoutLogCardProps) {
  const date = new Date(log.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const duration = log.endTime
    ? Math.round(
        (new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) /
          1000 /
          60
      )
    : 0;

  const feelingEmojis = ['', '😫', '😕', '😐', '😊', '🤩'];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer touch-feedback hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{log.workoutName}</h4>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        {log.feeling && (
          <span className="text-2xl">{feelingEmojis[log.feeling]}</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{duration} min</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Dumbbell className="w-4 h-4" />
          <span>{log.totalVolume.toLocaleString('pt-BR')} kg</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Star className="w-4 h-4" />
          <span>{log.exercises.length} exercícios</span>
        </div>
      </div>

      {log.notes && (
        <p className="mt-2 text-sm text-gray-500 italic truncate">
          "{log.notes}"
        </p>
      )}
    </div>
  );
}

export default WorkoutCard;
