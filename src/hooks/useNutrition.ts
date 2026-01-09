import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MealItem,
  MealEntry,
  MealTemplate,
  NutritionGoals,
  Macros,
  MealType,
  MealComponent,
  AISettings
} from '../types';
import { SEED_MEAL_ITEMS, DEFAULT_NUTRITION_GOALS, sumMacros } from '../data/mealItems';

const NUTRITION_STORAGE_KEY = 'dani-nutrition-data';

// Storage structure for nutrition data
interface NutritionStorage {
  mealItems: MealItem[];
  mealEntries: MealEntry[];
  mealTemplates: MealTemplate[];
  nutritionGoals: NutritionGoals;
  aiSettings: AISettings;
  lastSync: string;
}

// Default values
const defaultAISettings: AISettings = {
  enableWebSearch: true
};

const defaultStorage: NutritionStorage = {
  mealItems: SEED_MEAL_ITEMS,
  mealEntries: [],
  mealTemplates: [],
  nutritionGoals: DEFAULT_NUTRITION_GOALS,
  aiSettings: defaultAISettings,
  lastSync: new Date().toISOString()
};

export function useNutrition() {
  const [data, setData] = useState<NutritionStorage>(() => {
    try {
      const stored = localStorage.getItem(NUTRITION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure new fields are present
        // Also merge seed items that might be new
        const mergedItems = [...SEED_MEAL_ITEMS];
        const seedIds = new Set(SEED_MEAL_ITEMS.map(i => i.id));

        // Add any custom items from storage
        if (parsed.mealItems) {
          for (const item of parsed.mealItems) {
            if (!seedIds.has(item.id)) {
              mergedItems.push(item);
            }
          }
        }

        return {
          ...defaultStorage,
          ...parsed,
          mealItems: mergedItems,
          nutritionGoals: { ...DEFAULT_NUTRITION_GOALS, ...parsed.nutritionGoals },
          aiSettings: { ...defaultAISettings, ...parsed.aiSettings }
        };
      }
    } catch (error) {
      console.error('Error loading nutrition storage:', error);
    }
    return defaultStorage;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      // Only save custom items (not seeds) to reduce storage size
      const customItems = data.mealItems.filter(i => i.isCustom);
      const toStore = {
        ...data,
        mealItems: customItems,
        lastSync: new Date().toISOString()
      };
      localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving nutrition storage:', error);
    }
  }, [data]);

  // ==========================================
  // MEAL ITEMS
  // ==========================================

  const addMealItem = useCallback((item: MealItem) => {
    setData(prev => ({
      ...prev,
      mealItems: [...prev.mealItems, item]
    }));
  }, []);

  const updateMealItem = useCallback((id: string, updates: Partial<MealItem>) => {
    setData(prev => ({
      ...prev,
      mealItems: prev.mealItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const deleteMealItem = useCallback((id: string) => {
    // Only allow deleting custom items
    setData(prev => ({
      ...prev,
      mealItems: prev.mealItems.filter(item => item.id !== id || !item.isCustom)
    }));
  }, []);

  const getMealItem = useCallback((id: string): MealItem | undefined => {
    return data.mealItems.find(item => item.id === id);
  }, [data.mealItems]);

  const searchItems = useCallback((query: string): MealItem[] => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return data.mealItems;

    return data.mealItems.filter(item =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.category.includes(normalizedQuery)
    );
  }, [data.mealItems]);

  // ==========================================
  // MEAL ENTRIES
  // ==========================================

  const addMealEntry = useCallback((entry: MealEntry) => {
    setData(prev => ({
      ...prev,
      mealEntries: [...prev.mealEntries, entry]
    }));
  }, []);

  const updateMealEntry = useCallback((id: string, updates: Partial<MealEntry>) => {
    setData(prev => ({
      ...prev,
      mealEntries: prev.mealEntries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    }));
  }, []);

  const deleteMealEntry = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      mealEntries: prev.mealEntries.filter(entry => entry.id !== id)
    }));
  }, []);

  const getMealEntriesForDate = useCallback((date: string): MealEntry[] => {
    return data.mealEntries
      .filter(entry => entry.date === date)
      .sort((a, b) => {
        const order: MealType[] = ['cafe_manha', 'lanche_manha', 'almoco', 'lanche_tarde', 'jantar', 'ceia'];
        return order.indexOf(a.mealType) - order.indexOf(b.mealType);
      });
  }, [data.mealEntries]);

  const getTodayEntries = useCallback((): MealEntry[] => {
    const today = new Date().toISOString().split('T')[0];
    return getMealEntriesForDate(today);
  }, [getMealEntriesForDate]);

  // ==========================================
  // DAILY TOTALS & PROGRESS
  // ==========================================

  const getDailyTotals = useCallback((date: string): Macros => {
    const entries = getMealEntriesForDate(date);
    if (entries.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }
    return sumMacros(entries.map(e => e.totalMacros));
  }, [getMealEntriesForDate]);

  const getTodayTotals = useCallback((): Macros => {
    const today = new Date().toISOString().split('T')[0];
    return getDailyTotals(today);
  }, [getDailyTotals]);

  const getDailyProgress = useCallback((date: string) => {
    const totals = getDailyTotals(date);
    const { nutritionGoals } = data;

    return {
      calories: {
        consumed: totals.calories,
        goal: nutritionGoals.dailyCalories,
        remaining: Math.max(0, nutritionGoals.dailyCalories - totals.calories),
        percent: Math.min(100, Math.round((totals.calories / nutritionGoals.dailyCalories) * 100))
      },
      protein: {
        consumed: totals.protein,
        goal: nutritionGoals.dailyProtein,
        remaining: Math.max(0, nutritionGoals.dailyProtein - totals.protein),
        percent: Math.min(100, Math.round((totals.protein / nutritionGoals.dailyProtein) * 100))
      },
      carbs: {
        consumed: totals.carbs,
        goal: nutritionGoals.dailyCarbs || 180,
        remaining: Math.max(0, (nutritionGoals.dailyCarbs || 180) - totals.carbs),
        percent: Math.min(100, Math.round((totals.carbs / (nutritionGoals.dailyCarbs || 180)) * 100))
      },
      fat: {
        consumed: totals.fat,
        goal: nutritionGoals.dailyFat || 55,
        remaining: Math.max(0, (nutritionGoals.dailyFat || 55) - totals.fat),
        percent: Math.min(100, Math.round((totals.fat / (nutritionGoals.dailyFat || 55)) * 100))
      }
    };
  }, [getDailyTotals, data.nutritionGoals]);

  const getTodayProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return getDailyProgress(today);
  }, [getDailyProgress]);

  // ==========================================
  // MEAL TEMPLATES
  // ==========================================

  const addMealTemplate = useCallback((template: MealTemplate) => {
    setData(prev => ({
      ...prev,
      mealTemplates: [...prev.mealTemplates, template]
    }));
  }, []);

  const updateMealTemplate = useCallback((id: string, updates: Partial<MealTemplate>) => {
    setData(prev => ({
      ...prev,
      mealTemplates: prev.mealTemplates.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  }, []);

  const deleteMealTemplate = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      mealTemplates: prev.mealTemplates.filter(t => t.id !== id)
    }));
  }, []);

  const useTemplate = useCallback((templateId: string) => {
    // Increment usage count and update lastUsed
    setData(prev => ({
      ...prev,
      mealTemplates: prev.mealTemplates.map(t =>
        t.id === templateId
          ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date().toISOString() }
          : t
      )
    }));
  }, []);

  const getTemplatesForMealType = useCallback((mealType: MealType): MealTemplate[] => {
    return data.mealTemplates
      .filter(t => t.mealType === mealType)
      .sort((a, b) => b.usageCount - a.usageCount);
  }, [data.mealTemplates]);

  // ==========================================
  // NUTRITION GOALS
  // ==========================================

  const updateNutritionGoals = useCallback((goals: Partial<NutritionGoals>) => {
    setData(prev => ({
      ...prev,
      nutritionGoals: { ...prev.nutritionGoals, ...goals }
    }));
  }, []);

  // ==========================================
  // AI SETTINGS
  // ==========================================

  const updateAISettings = useCallback((settings: Partial<AISettings>) => {
    setData(prev => ({
      ...prev,
      aiSettings: { ...prev.aiSettings, ...settings }
    }));
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const getWeekStats = useCallback(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const weekEntries = data.mealEntries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= weekAgo && entryDate <= today;
    });

    const daysWithEntries = new Set(weekEntries.map(e => e.date)).size;
    const avgCalories = daysWithEntries > 0
      ? Math.round(sumMacros(weekEntries.map(e => e.totalMacros)).calories / daysWithEntries)
      : 0;
    const avgProtein = daysWithEntries > 0
      ? Math.round(sumMacros(weekEntries.map(e => e.totalMacros)).protein / daysWithEntries)
      : 0;

    return {
      totalMeals: weekEntries.length,
      daysLogged: daysWithEntries,
      avgDailyCalories: avgCalories,
      avgDailyProtein: avgProtein,
      streakDays: calculateStreak(data.mealEntries)
    };
  }, [data.mealEntries]);

  const getMonthHistory = useCallback((year: number, month: number) => {
    return data.mealEntries.filter(e => {
      const date = new Date(e.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [data.mealEntries]);

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  const createMealEntry = useCallback((
    mealType: MealType,
    photoBase64: string,
    description: string,
    components: MealComponent[],
    aiAnalysis?: string
  ): MealEntry => {
    const totalMacros = sumMacros(components.map(c => c.macros));
    const today = new Date().toISOString().split('T')[0];

    return {
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: today,
      mealType,
      timestamp: new Date().toISOString(),
      photoBase64,
      description,
      components,
      totalMacros,
      aiAnalysis,
      verified: false
    };
  }, []);

  const createTemplateFromEntry = useCallback((entry: MealEntry, name: string): MealTemplate => {
    return {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      mealType: entry.mealType,
      components: entry.components,
      totalMacros: entry.totalMacros,
      isDefault: false,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
  }, []);

  // Reset all nutrition data
  const resetNutritionData = useCallback(() => {
    setData(defaultStorage);
    localStorage.removeItem(NUTRITION_STORAGE_KEY);
  }, []);

  return {
    // Data
    mealItems: data.mealItems,
    mealEntries: data.mealEntries,
    mealTemplates: data.mealTemplates,
    nutritionGoals: data.nutritionGoals,
    aiSettings: data.aiSettings,

    // Meal Items
    addMealItem,
    updateMealItem,
    deleteMealItem,
    getMealItem,
    searchItems,

    // Meal Entries
    addMealEntry,
    updateMealEntry,
    deleteMealEntry,
    getMealEntriesForDate,
    getTodayEntries,

    // Daily Tracking
    getDailyTotals,
    getTodayTotals,
    getDailyProgress,
    getTodayProgress,

    // Templates
    addMealTemplate,
    updateMealTemplate,
    deleteMealTemplate,
    useTemplate,
    getTemplatesForMealType,

    // Goals & Settings
    updateNutritionGoals,
    updateAISettings,

    // Stats
    getWeekStats,
    getMonthHistory,

    // Utilities
    createMealEntry,
    createTemplateFromEntry,
    resetNutritionData
  };
}

// Helper function to calculate streak
function calculateStreak(entries: MealEntry[]): number {
  if (entries.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = Array.from(new Set(entries.map(e => e.date))).sort().reverse();

  let streak = 0;
  let currentDate = new Date(today);

  for (const dateStr of uniqueDates) {
    const entryDate = new Date(dateStr);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  return streak;
}

export default useNutrition;
