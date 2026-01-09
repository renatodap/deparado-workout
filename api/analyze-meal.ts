import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash-preview';

interface MealAnalysisRequest {
  photoBase64: string;
  description: string;
  mealType: string;
  mealTypeName: string;
  existingItemsList: string;
}

const buildSystemPrompt = (existingItemsList: string) => `Você é um nutricionista especializado em análise de refeições brasileiras. Sua função é analisar fotos de refeições e fornecer informações nutricionais PRECISAS e VERIFICÁVEIS.

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return res.status(500).json({
      success: false,
      error: 'Serviço de IA não configurado. Contate o administrador.'
    });
  }

  try {
    const { photoBase64, description, mealTypeName, existingItemsList } = req.body as MealAnalysisRequest;

    if (!photoBase64 || !description) {
      return res.status(400).json({
        success: false,
        error: 'Foto e descrição são obrigatórios.'
      });
    }

    const systemPrompt = buildSystemPrompt(existingItemsList || '');

    const userPrompt = `Analise esta refeição de ${mealTypeName}:

DESCRIÇÃO DA USUÁRIA: "${description}"

Forneça a análise nutricional completa em formato JSON. Lembre-se:
- Identifique cada componente visível da refeição
- Estime porções com base no tamanho relativo dos itens
- Use os alimentos já cadastrados quando possível (forneça o existingItemId)
- Se um alimento não existe no sistema, marque needsNewItem como true
- Seja preciso com as calorias - verifique os cálculos
- Inclua sugestões personalizadas para uma mulher de 50 anos focada em saúde

RESPONDA APENAS COM JSON VÁLIDO, SEM TEXTO ADICIONAL.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://dani-fitness.vercel.app',
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
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return res.status(response.status).json({
        success: false,
        error: `Erro no serviço de IA: ${response.status}`
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        error: 'Resposta vazia da IA. Tente novamente.'
      });
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
    let calculatedTotal = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    for (const comp of analysis.components) {
      calculatedTotal.calories += comp.macros.calories || 0;
      calculatedTotal.protein += comp.macros.protein || 0;
      calculatedTotal.carbs += comp.macros.carbs || 0;
      calculatedTotal.fat += comp.macros.fat || 0;
      calculatedTotal.fiber += comp.macros.fiber || 0;
    }

    // Round values
    calculatedTotal = {
      calories: Math.round(calculatedTotal.calories),
      protein: Math.round(calculatedTotal.protein * 10) / 10,
      carbs: Math.round(calculatedTotal.carbs * 10) / 10,
      fat: Math.round(calculatedTotal.fat * 10) / 10,
      fiber: Math.round(calculatedTotal.fiber * 10) / 10
    };

    return res.status(200).json({
      success: true,
      components: analysis.components || [],
      totalMacros: calculatedTotal,
      explanation: analysis.explanation || 'Análise concluída.',
      suggestions: analysis.suggestions || []
    });

  } catch (error) {
    console.error('Meal analysis API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao analisar refeição. Tente novamente.'
    });
  }
}
