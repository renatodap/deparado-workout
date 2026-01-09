export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  exerciseName?: string;
  workoutName?: string;
  userStats?: {
    totalWorkouts: number;
    currentStreak: number;
  };
}

export interface ChatResponse {
  message: string;
  model?: string;
}

export interface AIError {
  error: string;
  details?: string;
}

const API_URL = '/api/chat';

export async function sendMessage(
  messages: ChatMessage[],
  context?: ChatContext
): Promise<ChatResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages, context })
  });

  if (!response.ok) {
    const error: AIError = await response.json().catch(() => ({
      error: 'Erro de conexão'
    }));
    throw new Error(error.details || error.error || 'Erro ao enviar mensagem');
  }

  return response.json();
}

export async function getExerciseTip(
  exerciseName: string,
  context?: ChatContext
): Promise<string> {
  const response = await sendMessage(
    [{ role: 'user', content: `Me dá uma dica rápida para executar o exercício "${exerciseName}" com boa forma.` }],
    { ...context, exerciseName }
  );
  return response.message;
}

export async function getMotivation(context?: ChatContext): Promise<string> {
  const response = await sendMessage(
    [{ role: 'user', content: 'Me motiva para o treino de hoje!' }],
    context
  );
  return response.message;
}

export async function askQuestion(
  question: string,
  context?: ChatContext
): Promise<string> {
  const response = await sendMessage(
    [{ role: 'user', content: question }],
    context
  );
  return response.message;
}
