import { useMemo } from 'react';
import { WorkoutLog } from '../types';

interface ProgressChartProps {
  logs: WorkoutLog[];
  exerciseId?: string;
  type: 'weight' | 'volume' | 'frequency';
  title: string;
}

export function ProgressChart({ logs, exerciseId, type, title }: ProgressChartProps) {
  const data = useMemo(() => {
    if (type === 'weight' && exerciseId) {
      // Get weight progression for specific exercise
      const points: { date: string; value: number }[] = [];
      logs.forEach(log => {
        const exercise = log.exercises.find(e => e.exerciseId === exerciseId);
        if (exercise) {
          const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
          if (maxWeight > 0) {
            points.push({
              date: log.date,
              value: maxWeight
            });
          }
        }
      });
      return points.slice(-10); // Last 10 workouts
    }

    if (type === 'volume') {
      // Weekly volume
      const weeklyData: { [key: string]: number } = {};
      logs.forEach(log => {
        const date = new Date(log.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + log.totalVolume;
      });
      return Object.entries(weeklyData)
        .map(([date, value]) => ({ date, value }))
        .slice(-8); // Last 8 weeks
    }

    if (type === 'frequency') {
      // Monthly frequency
      const monthlyData: { [key: string]: number } = {};
      logs.forEach(log => {
        const date = new Date(log.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });
      return Object.entries(monthlyData)
        .map(([date, value]) => ({ date, value }))
        .slice(-6); // Last 6 months
    }

    return [];
  }, [logs, exerciseId, type]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">
          Dados insuficientes para o gráfico
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>

      {/* Simple bar chart */}
      <div className="h-32 flex items-end gap-2">
        {data.map((point, index) => {
          const height = ((point.value - minValue) / range) * 80 + 20; // 20-100%
          const isLast = index === data.length - 1;

          return (
            <div
              key={point.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-xs font-medium text-gray-700">
                {point.value.toLocaleString('pt-BR')}
              </span>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  isLast ? 'bg-primary-500' : 'bg-primary-200'
                }`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400">
                {formatDateLabel(point.date, type)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
        <span className="text-gray-500">
          Min: {minValue.toLocaleString('pt-BR')} {type === 'weight' || type === 'volume' ? 'kg' : ''}
        </span>
        <span className="text-gray-500">
          Max: {maxValue.toLocaleString('pt-BR')} {type === 'weight' || type === 'volume' ? 'kg' : ''}
        </span>
      </div>
    </div>
  );
}

function formatDateLabel(date: string, type: string): string {
  const d = new Date(date);

  if (type === 'frequency') {
    return d.toLocaleDateString('pt-BR', { month: 'short' });
  }

  if (type === 'volume') {
    return `S${Math.ceil(d.getDate() / 7)}`;
  }

  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' });
}

interface CalendarHeatmapProps {
  logs: WorkoutLog[];
  year: number;
  month: number;
}

export function CalendarHeatmap({ logs, year, month }: CalendarHeatmapProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const workoutDays = new Set(
    logs
      .filter(log => {
        const d = new Date(log.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map(log => new Date(log.date).getDate())
  );

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = Array(firstDayOfWeek).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const monthName = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4 capitalize">{monthName} {year}</h3>

      <div className="grid grid-cols-7 gap-1">
        {/* Day labels */}
        {dayLabels.map((label, i) => (
          <div key={i} className="h-8 flex items-center justify-center text-xs text-gray-400 font-medium">
            {label}
          </div>
        ))}

        {/* Calendar days */}
        {weeks.flat().map((day, i) => (
          <div
            key={i}
            className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
              day === null
                ? 'bg-transparent'
                : workoutDays.has(day)
                ? 'bg-primary-500 text-white font-medium'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <span className="text-sm text-gray-600">
          {workoutDays.size} treino{workoutDays.size !== 1 ? 's' : ''} neste mês
        </span>
      </div>
    </div>
  );
}

export default ProgressChart;
