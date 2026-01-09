// User types
export interface User {
  name: string;
  startDate: string;
  photo?: string;
  goals?: string[];
}

// Muscle group type
export type MuscleGroup = 'superior' | 'inferior' | 'abdomen';

// Exercise definition
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  instructions: string;
  tips: string[];
  easySubstitute: {
    name: string;
    instructions: string;
  };
  defaultSets: number;
  defaultReps: string;
  suggestedStartWeight?: number;
}

// Workout plan
export interface WorkoutPlan {
  id: string;
  name: string;
  shortName: string;
  dayOfWeek: string;
  exercises: Exercise[];
  isOptional: boolean;
  description: string;
}

// Set log for each exercise
export interface SetLog {
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: string;
}

// Exercise log within a workout
export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  usedSubstitute: boolean;
  notes?: string;
}

// Complete workout log
export interface WorkoutLog {
  id: string;
  date: string;
  workoutPlanId: string;
  workoutName: string;
  startTime: string;
  endTime?: string;
  exercises: ExerciseLog[];
  totalVolume: number;
  feeling?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  completed: boolean;
}

// Personal record
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

// Overall stats
export interface Stats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  totalVolumeAllTime: number;
  personalRecords: PersonalRecord[];
  lastWorkoutDate?: string;
}

// App storage structure
export interface AppStorage {
  user: User;
  workoutLogs: WorkoutLog[];
  stats: Stats;
  settings: AppSettings;
  currentWorkout?: WorkoutLog;
}

// App settings
export interface AppSettings {
  defaultRestTime: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showTips: boolean;
}

// Page navigation
export type Page = 'home' | 'workout' | 'history' | 'progress' | 'profile';

// Motivational quotes
export interface Quote {
  text: string;
  emoji: string;
}

// AI Chat types
export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIContext {
  exerciseName?: string;
  workoutName?: string;
  userStats?: {
    totalWorkouts: number;
    currentStreak: number;
  };
}
