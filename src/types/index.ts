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
export type Page = 'home' | 'workout' | 'history' | 'progress' | 'profile' | 'nutrition';

// Motivational quotes
export interface Quote {
  text: string;
  emoji: string;
}

// ==========================================
// MEAL TRACKING TYPES
// ==========================================

// Meal type for daily structure
export type MealType = 'cafe_manha' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia';

// Macronutrients breakdown
export interface Macros {
  calories: number;       // kcal
  protein: number;        // grams
  carbs: number;          // grams
  fat: number;            // grams
  fiber?: number;         // grams (optional)
}

// Individual food/ingredient item (from database or AI-created)
export interface MealItem {
  id: string;
  name: string;                    // Portuguese name
  category: MealItemCategory;
  servingSize: number;             // in grams (standard serving)
  servingUnit: string;             // "g", "ml", "unidade", "fatia", "colher de sopa"
  macrosPerServing: Macros;
  isCustom: boolean;               // true if created by user/AI
  createdAt: string;
  source?: 'seed' | 'ai' | 'user'; // Where this item came from
  description?: string;            // Optional description for context
}

// Categories for meal items
export type MealItemCategory =
  | 'proteinas'      // Proteins (meats, eggs, dairy)
  | 'carboidratos'   // Carbs (rice, bread, pasta)
  | 'vegetais'       // Vegetables
  | 'frutas'         // Fruits
  | 'laticinios'     // Dairy
  | 'gorduras'       // Fats (oils, nuts)
  | 'bebidas'        // Beverages
  | 'doces'          // Sweets/desserts
  | 'refeicoes'      // Complete meals/recipes
  | 'outros';        // Other

// A component of a meal entry (item + quantity)
export interface MealComponent {
  itemId: string;
  itemName: string;
  quantity: number;          // Number of servings
  macros: Macros;            // Calculated for this quantity
}

// A logged meal entry
export interface MealEntry {
  id: string;
  date: string;              // ISO date YYYY-MM-DD
  mealType: MealType;
  timestamp: string;         // ISO datetime
  photoBase64: string;       // Required - base64 encoded image
  description: string;       // Required - user's description
  components: MealComponent[];
  totalMacros: Macros;
  aiAnalysis?: string;       // AI's explanation/notes
  verified: boolean;         // User confirmed the analysis
  notes?: string;            // Optional user notes after verification
}

// A meal template (pre-defined meal for quick logging)
export interface MealTemplate {
  id: string;
  name: string;              // e.g., "Meu café da manhã padrão"
  mealType: MealType;
  components: MealComponent[];
  totalMacros: Macros;
  isDefault: boolean;        // Seeded templates vs user-created
  usageCount: number;        // How many times used
  lastUsed?: string;
  createdAt: string;
}

// Nutritional goals for Dani
export interface NutritionGoals {
  dailyCalories: number;     // Default: 1600 kcal for 50yo woman
  dailyProtein: number;      // Default: 70g (1.0-1.2g per kg)
  dailyCarbs?: number;       // Optional
  dailyFat?: number;         // Optional
}

// Daily nutrition summary
export interface DailyNutrition {
  date: string;
  meals: MealEntry[];
  totals: Macros;
  goalProgress: {
    caloriesPercent: number;
    proteinPercent: number;
  };
}

// Nutrition statistics
export interface NutritionStats {
  totalMealsLogged: number;
  streakDays: number;
  avgDailyCalories: number;
  avgDailyProtein: number;
  mostUsedTemplates: string[];
}

// AI Analysis request/response types
export interface AIAnalysisRequest {
  photoBase64: string;
  description: string;
  existingItems: MealItem[];  // For context
  mealType: MealType;
}

export interface AIAnalysisResponse {
  components: Array<{
    name: string;
    quantity: number;
    servingUnit: string;
    macros: Macros;
    existingItemId?: string;  // If found in database
    needsNewItem: boolean;    // If AI needs to create this item
    confidence: number;       // 0-1 confidence score
  }>;
  totalMacros: Macros;
  explanation: string;        // AI's reasoning
  suggestions?: string[];     // Tips for the user
}

// OpenRouter API key storage
export interface AISettings {
  openRouterApiKey?: string;
  enableWebSearch: boolean;
}
