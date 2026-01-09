import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    exerciseName?: string;
    workoutName?: string;
    userStats?: {
      totalWorkouts: number;
      currentStreak: number;
    };
  };
}

const SYSTEM_PROMPT = `Você é a personal trainer virtual da Dani, uma assistente de treino amigável e motivadora para o app Dani Fitness.

Seu papel:
- Dar dicas de execução de exercícios de forma clara e segura
- Motivar e encorajar durante os treinos
- Responder perguntas sobre forma, técnica e progressão
- Ser concisa nas respostas (máximo 2-3 frases)
- Usar linguagem informal e amigável em português brasileiro
- Sempre priorizar a segurança e forma correta

Contexto: Dani treina no Clube Paulistano, fazendo treinos A (terça), B (quinta) e opcionalmente C (sábado).`;

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
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    const { messages, context } = req.body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Build context-aware system message
    let systemMessage = SYSTEM_PROMPT;
    if (context) {
      if (context.exerciseName) {
        systemMessage += `\n\nExercício atual: ${context.exerciseName}`;
      }
      if (context.workoutName) {
        systemMessage += `\nTreino atual: ${context.workoutName}`;
      }
      if (context.userStats) {
        systemMessage += `\nEstatísticas da Dani: ${context.userStats.totalWorkouts} treinos completos, sequência atual de ${context.userStats.currentStreak} dias.`;
      }
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://dani-fitness.vercel.app',
        'X-Title': 'Dani Fitness'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'AI service error',
        details: response.status === 401 ? 'Invalid API key' : 'Service unavailable'
      });
    }

    const data = await response.json();

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.',
      model: data.model
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
