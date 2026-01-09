/**
 * AI Service for Meal Analysis using server-side API
 *
 * This service provides bulletproof meal analysis by:
 * 1. Using Gemini's vision capabilities to analyze food photos via server-side API
 * 2. Leveraging web search for accurate nutritional data
 * 3. Matching against existing meal items database
 * 4. Creating new items when needed with verified nutritional info
 */

import { MealItem, MealType, Macros } from '../types';
import { MEAL_TYPE_NAMES } from '../data/mealItems';

// Response types from AI
export interface AIAnalyzedComponent {
  name: string;
  quantity: number;
  servingUnit: string;
  servingSizeGrams: number;
  macros: Macros;
  existingItemId?: string;
  needsNewItem: boolean;
  confidence: number;
  reasoning: string;
}

export interface AIMealAnalysis {
  success: boolean;
  components: AIAnalyzedComponent[];
  totalMacros: Macros;
  explanation: string;
  suggestions: string[];
  error?: string;
}

export interface AINewItemResult {
  success: boolean;
  item?: MealItem;
  error?: string;
}

// Get the API base URL for development vs production
function getApiBaseUrl(): string {
  // In development, use relative URL (Vite proxy will handle it)
  // In production, use the full URL
  if (import.meta.env.DEV) {
    return '/api';
  }
  return '/api';
}

/**
 * Analyze a meal photo with description using server-side Gemini Vision API
 */
export async function analyzeMealPhoto(
  photoBase64: string,
  description: string,
  mealType: MealType,
  existingItems: MealItem[]
): Promise<AIMealAnalysis> {
  // Build context about existing items for the AI
  const existingItemsList = existingItems
    .map(i => `- ${i.name} (${i.servingSize}${i.servingUnit}): ${i.macrosPerServing.calories}kcal, ${i.macrosPerServing.protein}g prot, ${i.macrosPerServing.carbs}g carb, ${i.macrosPerServing.fat}g gord`)
    .join('\n');

  try {
    const response = await fetch(`${getApiBaseUrl()}/analyze-meal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photoBase64,
        description,
        mealType,
        mealTypeName: MEAL_TYPE_NAMES[mealType],
        existingItemsList
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        components: [],
        totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        explanation: '',
        suggestions: [],
        error: result.error || `Erro na análise: ${response.status}`
      };
    }

    return {
      success: true,
      components: result.components || [],
      totalMacros: result.totalMacros,
      explanation: result.explanation || 'Análise concluída.',
      suggestions: result.suggestions || []
    };

  } catch (error) {
    console.error('Error analyzing meal:', error);
    return {
      success: false,
      components: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      explanation: '',
      suggestions: [],
      error: error instanceof Error ? error.message : 'Erro ao analisar refeição. Tente novamente.'
    };
  }
}

/**
 * Create a new meal item using AI with verified nutritional data
 * Note: This function is currently not supported without user API key
 * It can be implemented server-side if needed
 */
export async function createMealItemWithAI(
  itemName: string,
  description?: string
): Promise<AINewItemResult> {
  // For now, return an error as this would need a separate server endpoint
  // The meal analysis already handles creating new items inline
  return {
    success: false,
    error: 'Criação manual de alimentos com IA não disponível. Use a análise de foto para adicionar novos alimentos.'
  };
}

/**
 * Get personalized meal suggestions based on remaining daily macros
 * Note: This function is currently not supported without user API key
 * It can be implemented server-side if needed
 */
export async function getMealSuggestions(
  remainingCalories: number,
  remainingProtein: number,
  mealType: MealType,
  existingItems: MealItem[]
): Promise<string[]> {
  // For now, return empty array as this would need a separate server endpoint
  return [];
}
