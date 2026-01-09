import { useState, useEffect, useCallback } from 'react';
import { AppStorage, User, WorkoutLog, Stats, AppSettings, PersonalRecord } from '../types';

const STORAGE_KEY = 'dani-fitness-data';

const defaultUser: User = {
  name: 'Daniela',
  startDate: new Date().toISOString().split('T')[0],
  goals: ['Ganhar força', 'Melhorar a saúde', 'Manter consistência']
};

const defaultSettings: AppSettings = {
  defaultRestTime: 60,
  soundEnabled: true,
  vibrationEnabled: true,
  showTips: true
};

const defaultStats: Stats = {
  totalWorkouts: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalVolumeAllTime: 0,
  personalRecords: []
};

const defaultStorage: AppStorage = {
  user: defaultUser,
  workoutLogs: [],
  stats: defaultStats,
  settings: defaultSettings
};

export function useStorage() {
  const [data, setData] = useState<AppStorage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultStorage, ...parsed };
      }
    } catch (error) {
      console.error('Error loading storage:', error);
    }
    return defaultStorage;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving storage:', error);
    }
  }, [data]);

  // User methods
  const updateUser = useCallback((user: Partial<User>) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, ...user }
    }));
  }, []);

  // Workout log methods
  const addWorkoutLog = useCallback((log: WorkoutLog) => {
    setData(prev => {
      const newLogs = [...prev.workoutLogs, log];
      const newStats = calculateStats(newLogs, prev.stats);
      return {
        ...prev,
        workoutLogs: newLogs,
        stats: newStats,
        currentWorkout: undefined
      };
    });
  }, []);

  const updateWorkoutLog = useCallback((id: string, updates: Partial<WorkoutLog>) => {
    setData(prev => ({
      ...prev,
      workoutLogs: prev.workoutLogs.map(log =>
        log.id === id ? { ...log, ...updates } : log
      )
    }));
  }, []);

  const deleteWorkoutLog = useCallback((id: string) => {
    setData(prev => {
      const newLogs = prev.workoutLogs.filter(log => log.id !== id);
      const newStats = calculateStats(newLogs, prev.stats);
      return {
        ...prev,
        workoutLogs: newLogs,
        stats: newStats
      };
    });
  }, []);

  // Current workout (in progress)
  const setCurrentWorkout = useCallback((workout: WorkoutLog | undefined) => {
    setData(prev => ({
      ...prev,
      currentWorkout: workout
    }));
  }, []);

  const updateCurrentWorkout = useCallback((updates: Partial<WorkoutLog>) => {
    setData(prev => ({
      ...prev,
      currentWorkout: prev.currentWorkout
        ? { ...prev.currentWorkout, ...updates }
        : undefined
    }));
  }, []);

  // Settings methods
  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  }, []);

  // Get last weight for an exercise
  const getLastWeight = useCallback((exerciseId: string): number | null => {
    for (let i = data.workoutLogs.length - 1; i >= 0; i--) {
      const log = data.workoutLogs[i];
      const exerciseLog = log.exercises.find(e => e.exerciseId === exerciseId);
      if (exerciseLog && exerciseLog.sets.length > 0) {
        const lastSet = exerciseLog.sets.find(s => s.weight > 0);
        if (lastSet) return lastSet.weight;
      }
    }
    return null;
  }, [data.workoutLogs]);

  // Get personal record for an exercise
  const getPersonalRecord = useCallback((exerciseId: string): PersonalRecord | null => {
    return data.stats.personalRecords.find(pr => pr.exerciseId === exerciseId) || null;
  }, [data.stats.personalRecords]);

  // Get workouts for a specific week
  const getWeekWorkouts = useCallback((date: Date = new Date()): WorkoutLog[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return data.workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek && logDate < endOfWeek && log.completed;
    });
  }, [data.workoutLogs]);

  // Get week stats
  const getWeekStats = useCallback(() => {
    const weekWorkouts = getWeekWorkouts();
    const totalVolume = weekWorkouts.reduce((sum, log) => sum + log.totalVolume, 0);
    return {
      workoutsCompleted: weekWorkouts.length,
      totalVolume,
      workoutsPlanned: 3 // Terça, Quinta, Sábado
    };
  }, [getWeekWorkouts]);

  // Get month workouts
  const getMonthWorkouts = useCallback((year: number, month: number): WorkoutLog[] => {
    return data.workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === year && logDate.getMonth() === month && log.completed;
    });
  }, [data.workoutLogs]);

  // Reset all data
  const resetData = useCallback(() => {
    setData(defaultStorage);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // Data
    user: data.user,
    workoutLogs: data.workoutLogs,
    stats: data.stats,
    settings: data.settings,
    currentWorkout: data.currentWorkout,

    // User methods
    updateUser,

    // Workout methods
    addWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
    setCurrentWorkout,
    updateCurrentWorkout,

    // Settings methods
    updateSettings,

    // Helper methods
    getLastWeight,
    getPersonalRecord,
    getWeekWorkouts,
    getWeekStats,
    getMonthWorkouts,
    resetData
  };
}

// Calculate stats from workout logs
function calculateStats(logs: WorkoutLog[], prevStats: Stats): Stats {
  const completedLogs = logs.filter(l => l.completed);
  const totalWorkouts = completedLogs.length;
  const totalVolumeAllTime = completedLogs.reduce((sum, log) => sum + log.totalVolume, 0);

  // Calculate streak (consecutive weeks with at least one workout)
  const { currentStreak, longestStreak } = calculateStreaks(completedLogs);

  // Calculate personal records
  const personalRecords = calculatePersonalRecords(completedLogs, prevStats.personalRecords);

  const lastWorkoutDate = completedLogs.length > 0
    ? completedLogs[completedLogs.length - 1].date
    : undefined;

  return {
    totalWorkouts,
    currentStreak,
    longestStreak: Math.max(longestStreak, prevStats.longestStreak),
    totalVolumeAllTime,
    personalRecords,
    lastWorkoutDate
  };
}

function calculateStreaks(logs: WorkoutLog[]): { currentStreak: number; longestStreak: number } {
  if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Get unique weeks with workouts
  const weeksWithWorkouts = new Set<string>();
  logs.forEach(log => {
    const date = new Date(log.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weeksWithWorkouts.add(weekStart.toISOString().split('T')[0]);
  });

  const sortedWeeks = Array.from(weeksWithWorkouts).sort();
  if (sortedWeeks.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < sortedWeeks.length; i++) {
    const prevWeek = new Date(sortedWeeks[i - 1]);
    const currWeek = new Date(sortedWeeks[i]);
    const diffDays = Math.round((currWeek.getTime() - prevWeek.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 7) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Check if current streak is still active (last workout was this week or last week)
  const lastWeek = new Date(sortedWeeks[sortedWeeks.length - 1]);
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const diffFromCurrent = Math.round((currentWeekStart.getTime() - lastWeek.getTime()) / (1000 * 60 * 60 * 24));

  if (diffFromCurrent <= 7) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
}

function calculatePersonalRecords(logs: WorkoutLog[], prevRecords: PersonalRecord[]): PersonalRecord[] {
  const records = new Map<string, PersonalRecord>();

  // Initialize with previous records
  prevRecords.forEach(pr => {
    records.set(pr.exerciseId, pr);
  });

  // Check all logs for new records
  logs.forEach(log => {
    log.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed && set.weight > 0) {
          const existingRecord = records.get(exercise.exerciseId);
          if (!existingRecord || set.weight > existingRecord.weight) {
            records.set(exercise.exerciseId, {
              exerciseId: exercise.exerciseId,
              exerciseName: exercise.exerciseName,
              weight: set.weight,
              reps: set.reps,
              date: log.date
            });
          }
        }
      });
    });
  });

  return Array.from(records.values());
}

export default useStorage;
