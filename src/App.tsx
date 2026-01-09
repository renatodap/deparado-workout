import { useState, useCallback } from 'react';
import { Bot } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { AIChat } from './components/AIChat';
import { Home } from './pages/Home';
import { TodayWorkout } from './pages/TodayWorkout';
import { History } from './pages/History';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { Nutrition } from './pages/Nutrition';
import { useStorage } from './hooks/useStorage';
import { useNutrition } from './hooks/useNutrition';
import { Page, WorkoutLog, ExerciseLog } from './types';
import { getWorkoutPlanById, getTodayWorkout } from './data/workouts';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState<string | undefined>(undefined);
  const [showAIChat, setShowAIChat] = useState(false);

  // Workout storage hook
  const {
    user,
    workoutLogs,
    stats,
    settings,
    currentWorkout,
    updateUser,
    addWorkoutLog,
    setCurrentWorkout,
    updateCurrentWorkout,
    updateSettings,
    getLastWeight,
    getWeekStats,
    resetData
  } = useStorage();

  // Nutrition storage hook
  const {
    mealItems,
    mealEntries,
    nutritionGoals,
    addMealEntry,
    deleteMealEntry,
    addMealItem,
    updateNutritionGoals,
    getTodayProgress,
    getMealEntriesForDate
  } = useNutrition();

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    if (page !== 'workout') {
      setSelectedWorkoutPlan(undefined);
    }
  }, []);

  const handleStartWorkout = useCallback(() => {
    const todayWorkout = getTodayWorkout();
    if (todayWorkout) {
      setSelectedWorkoutPlan(todayWorkout.id);
    }
    setCurrentPage('workout');
  }, []);

  const handleStartWorkoutWithPlan = useCallback((workoutPlanId: string): WorkoutLog => {
    const plan = getWorkoutPlanById(workoutPlanId);
    if (!plan) throw new Error('Workout plan not found');

    const exercises: ExerciseLog[] = plan.exercises.map(ex => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: Array(ex.defaultSets).fill(null).map(() => ({
        weight: 0,
        reps: 0,
        completed: false,
        timestamp: ''
      })),
      usedSubstitute: false
    }));

    const newWorkout: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      workoutPlanId,
      workoutName: plan.shortName,
      startTime: new Date().toISOString(),
      exercises,
      totalVolume: 0,
      completed: false
    };

    setCurrentWorkout(newWorkout);
    return newWorkout;
  }, [setCurrentWorkout]);

  const handleUpdateWorkout = useCallback((updates: Partial<WorkoutLog>) => {
    updateCurrentWorkout(updates);
  }, [updateCurrentWorkout]);

  const handleCompleteWorkout = useCallback((workout: WorkoutLog) => {
    addWorkoutLog(workout);
    setCurrentWorkout(undefined);
    setSelectedWorkoutPlan(undefined);
  }, [addWorkoutLog, setCurrentWorkout]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            user={user}
            stats={stats}
            workoutLogs={workoutLogs}
            onNavigate={handleNavigate}
            onStartWorkout={handleStartWorkout}
            getWeekStats={getWeekStats}
          />
        );

      case 'workout':
        const workoutPlan = selectedWorkoutPlan
          ? getWorkoutPlanById(selectedWorkoutPlan)
          : undefined;
        return (
          <TodayWorkout
            workoutPlan={workoutPlan}
            currentWorkout={currentWorkout}
            onNavigate={handleNavigate}
            onStartWorkout={handleStartWorkoutWithPlan}
            onUpdateWorkout={handleUpdateWorkout}
            onCompleteWorkout={handleCompleteWorkout}
            getLastWeight={getLastWeight}
          />
        );

      case 'history':
        return (
          <History
            workoutLogs={workoutLogs}
            onNavigate={handleNavigate}
          />
        );

      case 'progress':
        return (
          <Progress
            stats={stats}
            workoutLogs={workoutLogs}
            onNavigate={handleNavigate}
            getWeekStats={getWeekStats}
          />
        );

      case 'nutrition':
        return (
          <Nutrition
            mealItems={mealItems}
            mealEntries={mealEntries}
            nutritionGoals={nutritionGoals}
            addMealEntry={addMealEntry}
            deleteMealEntry={deleteMealEntry}
            addMealItem={addMealItem}
            getTodayProgress={getTodayProgress}
            getMealEntriesForDate={getMealEntriesForDate}
            onNavigate={handleNavigate}
          />
        );

      case 'profile':
        return (
          <Profile
            user={user}
            stats={stats}
            settings={settings}
            nutritionGoals={nutritionGoals}
            onUpdateUser={updateUser}
            onUpdateSettings={updateSettings}
            onUpdateNutritionGoals={updateNutritionGoals}
            onResetData={resetData}
            onNavigate={handleNavigate}
          />
        );

      default:
        return null;
    }
  };

  const aiContext = {
    workoutName: selectedWorkoutPlan ? getWorkoutPlanById(selectedWorkoutPlan)?.shortName : undefined,
    userStats: {
      totalWorkouts: stats.totalWorkouts,
      currentStreak: stats.currentStreak
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      {currentPage !== 'workout' && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* AI Chat Button */}
      <button
        onClick={() => setShowAIChat(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-lg shadow-primary-500/40 flex items-center justify-center hover:scale-105 transition-transform z-40"
        aria-label="Abrir chat com IA"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* AI Chat Modal */}
      <AIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        context={aiContext}
      />
    </div>
  );
}

export default App;
