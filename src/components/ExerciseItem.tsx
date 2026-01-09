import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Repeat,
  ArrowUpDown,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { Exercise, SetLog, ExerciseLog } from '../types';
import Modal from './Modal';
import RestTimer from './Timer';

interface ExerciseItemProps {
  exercise: Exercise;
  exerciseIndex: number;
  exerciseLog: ExerciseLog;
  lastWeight: number | null;
  onSetComplete: (setIndex: number, set: SetLog) => void;
  onUseLastWeight: () => void;
  onUseSubstitute: (use: boolean) => void;
  nextExerciseName?: string;
  isLastExercise?: boolean;
}

const muscleGroupLabels = {
  superior: 'Superior',
  inferior: 'Inferior',
  abdomen: 'Abdômen'
};

const muscleGroupColors = {
  superior: 'bg-blue-100 text-blue-700',
  inferior: 'bg-green-100 text-green-700',
  abdomen: 'bg-purple-100 text-purple-700'
};

export function ExerciseItem({
  exercise,
  exerciseIndex,
  exerciseLog,
  lastWeight,
  onSetComplete,
  onUseLastWeight,
  onUseSubstitute,
  nextExerciseName,
  isLastExercise = false
}: ExerciseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [tempWeight, setTempWeight] = useState<string>('');
  const [tempReps, setTempReps] = useState<string>(exercise.defaultReps.split('-')[0]);

  const completedSets = exerciseLog.sets.filter(s => s.completed).length;
  const totalSets = exercise.defaultSets;
  const isComplete = completedSets === totalSets;
  const displayName = exerciseLog.usedSubstitute
    ? exercise.easySubstitute.name
    : exercise.name;

  const handleCompleteSet = () => {
    const weight = parseFloat(tempWeight) || 0;
    const reps = parseInt(tempReps) || 12;

    const newSet: SetLog = {
      weight,
      reps,
      completed: true,
      timestamp: new Date().toISOString()
    };

    onSetComplete(currentSetIndex, newSet);

    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setShowRestTimer(true);
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
  };

  const handleWeightAdjust = (delta: number) => {
    const current = parseFloat(tempWeight) || 0;
    const newWeight = Math.max(0, current + delta);
    setTempWeight(newWeight.toString());
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
          isComplete
            ? 'border-green-200 bg-green-50/50'
            : 'border-gray-100'
        }`}
      >
        {/* Header */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            {/* Exercise number */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isComplete
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-100 text-primary-700'
              }`}
            >
              {isComplete ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-bold">{exerciseIndex + 1}</span>
              )}
            </div>

            {/* Exercise info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    muscleGroupColors[exercise.muscleGroup]
                  }`}
                >
                  {muscleGroupLabels[exercise.muscleGroup]}
                </span>
                {exerciseLog.usedSubstitute && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Substituto
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">
                {displayName}
              </h3>
              <p className="text-sm text-gray-500">
                {completedSets}/{totalSets} séries • {exercise.defaultReps} reps
              </p>
            </div>

            {/* Expand button */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(true);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Info className="w-4 h-4 text-gray-600" />
              </button>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isComplete ? 'bg-green-500' : 'bg-primary-500'
              }`}
              style={{ width: `${(completedSets / totalSets) * 100}%` }}
            />
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && !isComplete && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="border-t border-gray-100 pt-4">
              {/* Current set indicator */}
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500">
                  Série {currentSetIndex + 1} de {totalSets}
                </span>
              </div>

              {/* Weight input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWeightAdjust(-2.5)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback text-xl font-bold text-gray-600"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value)}
                    placeholder="0"
                    className="flex-1 h-12 text-center text-2xl font-bold text-gray-900 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={() => handleWeightAdjust(2.5)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback text-xl font-bold text-gray-600"
                  >
                    +
                  </button>
                </div>
                {lastWeight && (
                  <button
                    onClick={() => {
                      setTempWeight(lastWeight.toString());
                      onUseLastWeight();
                    }}
                    className="mt-2 w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1"
                  >
                    <Repeat className="w-4 h-4" />
                    Usar peso anterior: {lastWeight} kg
                  </button>
                )}
              </div>

              {/* Reps input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repetições
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setTempReps(
                        Math.max(1, parseInt(tempReps) - 1).toString()
                      )
                    }
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback text-xl font-bold text-gray-600"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={tempReps}
                    onChange={(e) => setTempReps(e.target.value)}
                    className="flex-1 h-12 text-center text-2xl font-bold text-gray-900 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={() =>
                      setTempReps((parseInt(tempReps) + 1).toString())
                    }
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback text-xl font-bold text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Complete set button */}
              <button
                onClick={handleCompleteSet}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-colors touch-feedback shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Completar Série
              </button>

              {/* Weight tips */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleWeightAdjust(-5)}
                  className="flex-1 py-2 px-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Muito pesado?
                </button>
                <button
                  onClick={() => handleWeightAdjust(5)}
                  className="flex-1 py-2 px-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Muito leve?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed state */}
        {isComplete && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Exercício completo!</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Modal */}
      <Modal isOpen={showInfo} onClose={() => setShowInfo(false)} title={displayName}>
        <div className="p-4 space-y-4">
          {/* Instructions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary-500" />
              Como fazer
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {exerciseLog.usedSubstitute
                ? exercise.easySubstitute.instructions
                : exercise.instructions}
            </p>
          </div>

          {/* Tips */}
          {!exerciseLog.usedSubstitute && exercise.tips.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Dicas
              </h4>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipment */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-500">Equipamento: </span>
            <span className="font-medium text-gray-900">
              {exercise.equipment}
            </span>
          </div>

          {/* Suggested start weight */}
          {exercise.suggestedStartWeight !== undefined &&
            exercise.suggestedStartWeight > 0 && (
              <div className="p-3 bg-primary-50 rounded-xl">
                <span className="text-sm text-primary-600">
                  Peso sugerido para iniciantes:{' '}
                </span>
                <span className="font-bold text-primary-700">
                  {exercise.suggestedStartWeight} kg
                </span>
              </div>
            )}

          {/* Substitute option */}
          {!exerciseLog.usedSubstitute ? (
            <button
              onClick={() => {
                onUseSubstitute(true);
                setShowInfo(false);
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Usar exercício mais fácil
            </button>
          ) : (
            <button
              onClick={() => {
                onUseSubstitute(false);
                setShowInfo(false);
              }}
              className="w-full py-3 bg-primary-100 text-primary-700 rounded-xl font-medium hover:bg-primary-200 transition-colors"
            >
              Voltar ao exercício original
            </button>
          )}
        </div>
      </Modal>

      {/* Rest Timer Modal */}
      <Modal
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        title="Tempo de Descanso"
      >
        <RestTimer
          defaultTime={60}
          autoStart={true}
          onComplete={handleRestComplete}
          nextExercise={
            currentSetIndex < totalSets - 1
              ? `${displayName} - Série ${currentSetIndex + 2}`
              : nextExerciseName
          }
        />
      </Modal>
    </>
  );
}

export default ExerciseItem;
