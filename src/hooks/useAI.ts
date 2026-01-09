import { useState, useCallback } from 'react';
import { sendMessage, getExerciseTip, getMotivation, askQuestion, ChatMessage, ChatContext } from '../services/ai';

interface UseAIReturn {
  loading: boolean;
  error: string | null;
  sendChat: (messages: ChatMessage[], context?: ChatContext) => Promise<string | null>;
  getTip: (exerciseName: string, context?: ChatContext) => Promise<string | null>;
  getMotivationalMessage: (context?: ChatContext) => Promise<string | null>;
  ask: (question: string, context?: ChatContext) => Promise<string | null>;
  clearError: () => void;
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(async <T>(request: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await request();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendChat = useCallback(async (messages: ChatMessage[], context?: ChatContext) => {
    return handleRequest(async () => {
      const response = await sendMessage(messages, context);
      return response.message;
    });
  }, [handleRequest]);

  const getTip = useCallback(async (exerciseName: string, context?: ChatContext) => {
    return handleRequest(() => getExerciseTip(exerciseName, context));
  }, [handleRequest]);

  const getMotivationalMessage = useCallback(async (context?: ChatContext) => {
    return handleRequest(() => getMotivation(context));
  }, [handleRequest]);

  const ask = useCallback(async (question: string, context?: ChatContext) => {
    return handleRequest(() => askQuestion(question, context));
  }, [handleRequest]);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    sendChat,
    getTip,
    getMotivationalMessage,
    ask,
    clearError
  };
}
