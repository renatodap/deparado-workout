import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { useRestTimer } from '../hooks/useTimer';
import { useEffect, useState } from 'react';

interface RestTimerProps {
  defaultTime?: number;
  onComplete?: () => void;
  autoStart?: boolean;
  nextExercise?: string;
}

export function RestTimer({
  defaultTime = 60,
  onComplete,
  autoStart = false,
  nextExercise
}: RestTimerProps) {
  const {
    remainingTime,
    isResting,
    isRunning,
    startRest,
    stopRest,
    formattedTime,
    pause,
    start,
    reset
  } = useRestTimer(defaultTime);

  const [customTime, setCustomTime] = useState(defaultTime);

  useEffect(() => {
    if (autoStart) {
      startRest(customTime);
    }
  }, []);

  useEffect(() => {
    if (remainingTime === 0 && !isRunning && isResting === false) {
      onComplete?.();
    }
  }, [remainingTime, isRunning, isResting, onComplete]);

  const handleAdjustTime = (delta: number) => {
    const newTime = Math.max(15, customTime + delta);
    setCustomTime(newTime);
    if (!isResting) {
      reset(newTime);
    }
  };

  const progress = isResting ? (remainingTime / customTime) * 100 : 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-6">
      {/* Timer circle */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#FEE2E2"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#DC2626"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{formattedTime}</span>
        </div>
      </div>

      {/* Time adjustment */}
      {!isResting && (
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleAdjustTime(-15)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-500 min-w-[60px] text-center">
            {customTime}s
          </span>
          <button
            onClick={() => handleAdjustTime(15)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isResting ? (
          <button
            onClick={() => startRest(customTime)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors touch-feedback shadow-lg shadow-primary-600/30"
          >
            <Play className="w-5 h-5" fill="white" />
            Iniciar Descanso
          </button>
        ) : (
          <>
            <button
              onClick={isRunning ? pause : start}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors touch-feedback shadow-lg shadow-primary-600/30"
            >
              {isRunning ? (
                <Pause className="w-5 h-5" fill="white" />
              ) : (
                <Play className="w-5 h-5" fill="white" />
              )}
            </button>
            <button
              onClick={() => reset(customTime)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={stopRest}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors touch-feedback"
            >
              Pular
            </button>
          </>
        )}
      </div>

      {/* Next exercise hint */}
      {nextExercise && isResting && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Próximo exercício:</p>
          <p className="text-base font-semibold text-gray-800">{nextExercise}</p>
        </div>
      )}
    </div>
  );
}

interface WorkoutDurationProps {
  formattedTime: string;
  isRunning: boolean;
}

export function WorkoutDuration({ formattedTime, isRunning }: WorkoutDurationProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
      <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-primary-500 animate-pulse' : 'bg-gray-400'}`} />
      <span className="text-sm font-medium text-primary-700">{formattedTime}</span>
    </div>
  );
}

export default RestTimer;
