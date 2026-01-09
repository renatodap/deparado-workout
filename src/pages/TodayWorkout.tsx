import { useState, useEffect, useMemo } from 'react';
import { X, Check, Clock, Award, MessageSquare } from 'lucide-react';
import { Header } from '../components/Header';
import { ExerciseItem } from '../components/ExerciseItem';
import { WorkoutDuration } from '../components/Timer';
import { Confetti } from '../components/Confetti';
import { Modal } from '../components/Modal';
import { WorkoutPlan, WorkoutLog, ExerciseLog, SetLog, Page } from '../types';
import { workoutPlans, getRandomCompletionMessage } from '../data/workouts';
import { useWorkoutTimer } from '../hooks/useTimer';

interface TodayWorkoutProps {
  workoutPlan?: WorkoutPlan;
  currentWorkout?: WorkoutLog;
  onNavigate: (page: Page) => void;
  onStartWorkout: (workoutPlanId: string) => WorkoutLog;
  onUpdateWorkout: (updates: Partial<WorkoutLog>) => void;
  onCompleteWorkout: (workout: WorkoutLog) => void;
  getLastWeight: (exerciseId: string) => number | null;
}

export function TodayWorkout({
  workoutPlan,
  currentWorkout,
  onNavigate,
  onStartWorkout,
  onUpdateWorkout,
  onCompleteWorkout,
  getLastWeight
}: TodayWorkoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(workoutPlan || null);
  const [workout, setWorkout] = useState<WorkoutLog | undefined>(currentWorkout);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [feeling, setFeeling] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const workoutTimer = useWorkoutTimer();

  // Start workout when plan is selected
  useEffect(() => {
    if (selectedPlan && !workout) {
      const newWorkout = onStartWorkout(selectedPlan.id);
      setWorkout(newWorkout);
      workoutTimer.startWorkout();
    }
  }, [selectedPlan]);

  // Sync local workout with props
  useEffect(() => {
    if (currentWorkout) {
      setWorkout(currentWorkout);
    }
  }, [currentWorkout]);

  const completedExercises = useMemo(() => {
    if (!workout || !selectedPlan) return 0;
    return workout.exercises.filter((ex, i) => {
      const planExercise = selectedPlan.exercises[i];
      const completedSets = ex.sets.filter(s => s.completed).length;
      return completedSets >= planExercise.defaultSets;
    }).length;
  }, [workout, selectedPlan]);

  const totalVolume = useMemo(() => {
    if (!workout) return 0;
    return workout.exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((setTotal, set) => {
        return setTotal + (set.completed ? set.weight * set.reps : 0);
      }, 0);
    }, 0);
  }, [workout]);

  const isWorkoutComplete = selectedPlan && completedExercises === selectedPlan.exercises.length;

  const handleSetComplete = (exerciseIndex: number, setIndex: number, set: SetLog) => {
    if (!workout) return;

    const updatedExercises = [...workout.exercises];
    const exercise = { ...updatedExercises[exerciseIndex] };
    const sets = [...exercise.sets];
    sets[setIndex] = set;
    exercise.sets = sets;
    updatedExercises[exerciseIndex] = exercise;

    const newTotalVolume = updatedExercises.reduce((total, ex) => {
      return total + ex.sets.reduce((setTotal, s) => {
        return setTotal + (s.completed ? s.weight * s.reps : 0);
      }, 0);
    }, 0);

    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises,
      totalVolume: newTotalVolume
    };

    setWorkout(updatedWorkout);
    onUpdateWorkout(updatedWorkout);

    // Check if exercise is complete
    const planExercise = selectedPlan?.exercises[exerciseIndex];
    if (planExercise) {
      const completedSets = sets.filter(s => s.completed).length;
      if (completedSets === planExercise.defaultSets) {
        // Exercise complete!
        if (exerciseIndex === (selectedPlan?.exercises.length || 0) - 1) {
          // Last exercise - show completion
          handleWorkoutComplete();
        }
      }
    }
  };

  const handleUseSubstitute = (exerciseIndex: number, use: boolean) => {
    if (!workout) return;

    const updatedExercises = [...workout.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      usedSubstitute: use
    };

    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises
    };

    setWorkout(updatedWorkout);
    onUpdateWorkout(updatedWorkout);
  };

  const handleWorkoutComplete = () => {
    setShowConfetti(true);
    setShowCompletionModal(true);
    workoutTimer.pause();
  };

  const handleFinishWorkout = () => {
    if (!workout) return;

    const { endTime } = workoutTimer.endWorkout();

    const completedWorkout: WorkoutLog = {
      ...workout,
      endTime,
      totalVolume,
      feeling,
      notes: notes || undefined,
      completed: true
    };

    onCompleteWorkout(completedWorkout);
    setShowCompletionModal(false);
    onNavigate('home');
  };

  const handleExitWorkout = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    onNavigate('home');
  };

  // Plan selection view
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header
          title="Escolher Treino"
          showBack
          onBack={() => onNavigate('home')}
        />

        <main className="px-4 py-6 space-y-4">
          <p className="text-gray-600">Qual treino você quer fazer hoje?</p>

          {workoutPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all touch-feedback"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
                {plan.isOptional && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                    OPCIONAL
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{plan.description}</p>
              <p className="text-sm text-primary-600 font-medium">
                {plan.exercises.length} exercícios • {plan.dayOfWeek}
              </p>
            </button>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Confetti active={showConfetti} />

      <Header
        title={selectedPlan.shortName}
        subtitle={`${completedExercises}/${selectedPlan.exercises.length} exercícios`}
        showBack
        onBack={handleExitWorkout}
        rightElement={
          <WorkoutDuration
            formattedTime={workoutTimer.formattedDuration}
            isRunning={workoutTimer.isRunning}
          />
        }
      />

      {/* Progress bar */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-lg px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progresso</span>
          <span className="text-sm font-bold text-primary-600">
            {Math.round((completedExercises / selectedPlan.exercises.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${(completedExercises / selectedPlan.exercises.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Volume: {totalVolume.toLocaleString('pt-BR')} kg</span>
          <span>{workoutTimer.formattedDuration}</span>
        </div>
      </div>

      <main className="px-4 py-6 space-y-4">
        {workout &&
          selectedPlan.exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              exerciseIndex={index}
              exerciseLog={workout.exercises[index]}
              lastWeight={getLastWeight(exercise.id)}
              onSetComplete={(setIndex, set) => handleSetComplete(index, setIndex, set)}
              onUseLastWeight={() => {}}
              onUseSubstitute={(use) => handleUseSubstitute(index, use)}
              nextExerciseName={selectedPlan.exercises[index + 1]?.name}
              isLastExercise={index === selectedPlan.exercises.length - 1}
            />
          ))}

        {/* Complete workout button */}
        {isWorkoutComplete && !showCompletionModal && (
          <button
            onClick={handleWorkoutComplete}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all touch-feedback shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
          >
            <Check className="w-6 h-6" />
            FINALIZAR TREINO
          </button>
        )}
      </main>

      {/* Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => {}}
        showClose={false}
        size="lg"
      >
        <div className="p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getRandomCompletionMessage()}
          </h2>

          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <Clock className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {workoutTimer.formattedDuration}
              </p>
              <p className="text-sm text-gray-500">Duração</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {totalVolume.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">kg totais</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Como você se sentiu?
            </p>
            <div className="flex justify-center gap-3">
              {[
                { value: 1 as const, emoji: '😫' },
                { value: 2 as const, emoji: '😕' },
                { value: 3 as const, emoji: '😐' },
                { value: 4 as const, emoji: '😊' },
                { value: 5 as const, emoji: '🤩' }
              ].map(({ value, emoji }) => (
                <button
                  key={value}
                  onClick={() => setFeeling(value)}
                  className={`w-12 h-12 text-2xl rounded-full transition-all ${
                    feeling === value
                      ? 'bg-primary-100 ring-2 ring-primary-500 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Notas (opcional)
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi o treino?"
              className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none resize-none"
              rows={2}
            />
          </div>

          <button
            onClick={handleFinishWorkout}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all touch-feedback shadow-lg shadow-primary-600/30"
          >
            Concluir
          </button>
        </div>
      </Modal>

      {/* Exit confirmation modal */}
      <Modal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        title="Sair do Treino?"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Seu progresso será perdido. Tem certeza que deseja sair?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Continuar
            </button>
            <button
              onClick={confirmExit}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TodayWorkout;
