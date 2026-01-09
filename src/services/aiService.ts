/**
 * AI Service for Meal Analysis using OpenRouter + Gemini 2.5 Flash
 *
 * This service provides bulletproof meal analysis by:
 * 1. Using Gemini's vision capabilities to analyze food photos
 * 2. Leveraging web search for accurate nutritional data
 * 3. Matching against existing meal items database
 * 4. Creating new items when needed with verified nutritional info
 */

import { MealItem, MealType, Macros, MealComponent } from '../types';
import { MEAL_TYPE_NAMES, SEED_MEAL_ITEMS } from '../data/mealItems';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash-preview'; // Gemini 2.5 Flash with vision

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

/**
 * Analyze a meal photo with description using Gemini Vision
 */
export async function analyzeMealPhoto(
  apiKey: string,
  photoBase64: string,
  description: string,
  mealType: MealType,
  existingItems: MealItem[]
): Promise<AIMealAnalysis> {
  if (!apiKey) {
    return {
      success: false,
      components: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      explanation: '',
      suggestions: [],
      error: 'Chave da API não configurada. Configure nas configurações.'
    };
  }

  // Build context about existing items for the AI
  const existingItemsList = existingItems
    .map(i => `- ${i.name} (${i.servingSize}${i.servingUnit}): ${i.macrosPerServing.calories}kcal, ${i.macrosPerServing.protein}g prot, ${i.macrosPerServing.carbs}g carb, ${i.macrosPerServing.fat}g gord`)
    .join('\n');

  const systemPrompt = `Você é um nutricionista especializado em análise de refeições brasileiras. Sua função é analisar fotos de refeições e fornecer informações nutricionais PRECISAS e VERIFICÁVEIS.

REGRAS CRÍTICAS:
1. SEMPRE use dados nutricionais da TBCA (Tabela Brasileira de Composição de Alimentos) quando possível
2. Seja CONSERVADOR nas estimativas - é melhor subestimar do que superestimar calorias
3. Para porções, use referências visuais comuns (colher de sopa = 15g, concha = 80g, prato raso = 200-300g de arroz)
4. Se não tiver certeza absoluta de um alimento, indique baixa confiança
5. NUNCA invente valores - use apenas dados verificáveis
6. Para alimentos compostos (como estrogonofe), decomponha em ingredientes quando possível

CONTEXTO DA USUÁRIA:
- Mulher brasileira de 50 anos
- Treina regularmente na academia
- Meta: manter peso saudável com proteína adequada
- Foco em refeições caseiras brasileiras típicas

ALIMENTOS JÁ CADASTRADOS NO SISTEMA (prefira usar estes quando compatíveis):
${existingItemsList}

FORMATO DE RESPOSTA (JSON ESTRITO):
{
  "components": [
    {
      "name": "Nome do alimento em português",
      "quantity": 1.0,
      "servingUnit": "porção/g/colher de sopa/fatia/unidade",
      "servingSizeGrams": 100,
      "macros": {
        "calories": 150,
        "protein": 10,
        "carbs": 20,
        "fat": 5,
        "fiber": 2
      },
      "existingItemId": "id_do_item_se_existir_ou_null",
      "needsNewItem": false,
      "confidence": 0.95,
      "reasoning": "Explicação breve de como chegou aos valores"
    }
  ],
  "totalMacros": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0
  },
  "explanation": "Explicação geral da análise para a usuária em português",
  "suggestions": ["Dica 1 para a usuária", "Dica 2"]
}`;

  const userPrompt = `Analise esta refeição de ${MEAL_TYPE_NAMES[mealType]}:

DESCRIÇÃO DA USUÁRIA: "${description}"

Forneça a análise nutricional completa em formato JSON. Lembre-se:
- Identifique cada componente visível da refeição
- Estime porções com base no tamanho relativo dos itens
- Use os alimentos já cadastrados quando possível (forneça o existingItemId)
- Se um alimento não existe no sistema, marque needsNewItem como true
- Seja preciso com as calorias - verifique os cálculos
- Inclua sugestões personalizadas para uma mulher de 50 anos focada em saúde

RESPONDA APENAS COM JSON VÁLIDO, SEM TEXTO ADICIONAL.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Dani Fitness - Nutrição'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: photoBase64.startsWith('data:') ? photoBase64 : `data:image/jpeg;base64,${photoBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3 // Lower temperature for more consistent nutritional data
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return {
        success: false,
        components: [],
        totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        explanation: '',
        suggestions: [],
        error: `Erro na API: ${response.status}. Verifique sua chave da API.`
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        components: [],
        totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        explanation: '',
        suggestions: [],
        error: 'Resposta vazia da IA. Tente novamente.'
      };
    }

    // Parse JSON response - handle potential markdown code blocks
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0];
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0];
    }

    const analysis = JSON.parse(jsonContent.trim());

    // Validate and recalculate totals for accuracy
    let calculatedTotal: Macros = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    for (const comp of analysis.components) {
      calculatedTotal.calories += comp.macros.calories || 0;
      calculatedTotal.protein += comp.macros.protein || 0;
      calculatedTotal.carbs += comp.macros.carbs || 0;
      calculatedTotal.fat += comp.macros.fat || 0;
      calculatedTotal.fiber = (calculatedTotal.fiber || 0) + (comp.macros.fiber || 0);
    }

    // Round values
    calculatedTotal = {
      calories: Math.round(calculatedTotal.calories),
      protein: Math.round(calculatedTotal.protein * 10) / 10,
      carbs: Math.round(calculatedTotal.carbs * 10) / 10,
      fat: Math.round(calculatedTotal.fat * 10) / 10,
      fiber: Math.round((calculatedTotal.fiber || 0) * 10) / 10
    };

    return {
      success: true,
      components: analysis.components || [],
      totalMacros: calculatedTotal,
      explanation: analysis.explanation || 'Análise concluída.',
      suggestions: analysis.suggestions || []
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
 */
export async function createMealItemWithAI(
  apiKey: string,
  itemName: string,
  description?: string
): Promise<AINewItemResult> {
  if (!apiKey) {
    return {
      success: false,
      error: 'Chave da API não configurada.'
    };
  }

  const prompt = `Você precisa criar um item alimentar para um banco de dados nutricional brasileiro.

ALIMENTO: "${itemName}"
${description ? `DESCRIÇÃO ADICIONAL: "${description}"` : ''}

REGRAS:
1. Use APENAS dados da TBCA (Tabela Brasileira de Composição de Alimentos) ou fontes científicas confiáveis
2. Se não encontrar dados exatos, use alimento similar mais próximo
3. Defina uma porção padrão razoável (ex: 1 unidade, 100g, 1 fatia, 1 colher de sopa)
4. Todos os valores devem ser para UMA porção padrão

RESPONDA EM JSON:
{
  "name": "Nome em português",
  "category": "proteinas|carboidratos|vegetais|frutas|laticinios|gorduras|bebidas|doces|refeicoes|outros",
  "servingSize": 100,
  "servingUnit": "g|ml|unidade|fatia|colher de sopa|porção",
  "macros": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0
  },
  "description": "Descrição breve do alimento",
  "confidence": 0.9,
  "source": "TBCA ou outra fonte"
}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Dani Fitness - Criar Alimento'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: 'Resposta vazia da IA.'
      };
    }

    // Parse JSON
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0];
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0];
    }

    const itemData = JSON.parse(jsonContent.trim());

    // Create the MealItem
    const newItem: MealItem = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: itemData.name,
      category: itemData.category,
      servingSize: itemData.servingSize,
      servingUnit: itemData.servingUnit,
      macrosPerServing: {
        calories: Math.round(itemData.macros.calories),
        protein: Math.round(itemData.macros.protein * 10) / 10,
        carbs: Math.round(itemData.macros.carbs * 10) / 10,
        fat: Math.round(itemData.macros.fat * 10) / 10,
        fiber: itemData.macros.fiber ? Math.round(itemData.macros.fiber * 10) / 10 : undefined
      },
      isCustom: true,
      createdAt: new Date().toISOString(),
      source: 'ai',
      description: itemData.description
    };

    return {
      success: true,
      item: newItem
    };

  } catch (error) {
    console.error('Error creating meal item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar alimento.'
    };
  }
}

/**
 * Get personalized meal suggestions based on remaining daily macros
 */
export async function getMealSuggestions(
  apiKey: string,
  remainingCalories: number,
  remainingProtein: number,
  mealType: MealType,
  existingItems: MealItem[]
): Promise<string[]> {
  if (!apiKey || remainingCalories <= 0) {
    return [];
  }

  const availableItems = existingItems
    .filter(i => i.macrosPerServing.calories <= remainingCalories)
    .slice(0, 30)
    .map(i => i.name)
    .join(', ');

  const prompt = `Sugira 3 opções de ${MEAL_TYPE_NAMES[mealType]} para uma mulher brasileira de 50 anos.

RESTRIÇÕES:
- Máximo ${remainingCalories} calorias
- Precisa de pelo menos ${Math.max(0, remainingProtein)}g de proteína
- Preferência por comidas caseiras brasileiras
- Foco em saúde e praticidade

ALIMENTOS DISPONÍVEIS: ${availableItems}

Responda com 3 sugestões curtas e práticas, uma por linha, sem numeração.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Dani Fitness - Sugestões'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return content
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 3);

  } catch {
    return [];
  }
}

/**
 * Validate API key by making a simple request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.length < 10) return false;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Dani Fitness - Validação'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
        max_tokens: 5
      })
    });

    return response.ok;
  } catch {
    return false;
  }
}
