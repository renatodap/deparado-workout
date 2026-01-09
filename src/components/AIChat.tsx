import { useState } from 'react';
import { Send, X, Bot, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { ChatContext } from '../services/ai';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  context?: ChatContext;
  initialMessage?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat({ isOpen, onClose, context, initialMessage }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { loading, error, sendChat, clearError } = useAI();

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    const response = await sendChat(
      updatedMessages.map(m => ({ role: m.role, content: m.content })),
      context
    );

    if (response) {
      setMessages([...updatedMessages, { role: 'assistant', content: response }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { icon: Lightbulb, text: 'Me dá uma dica de forma', prompt: 'Me dá uma dica de forma para o exercício atual' },
    { icon: Sparkles, text: 'Me motiva!', prompt: 'Me dá uma motivação para continuar o treino!' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-fade-in">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Personal AI</h3>
              <p className="text-xs text-gray-500">Sua assistente de treino</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Olá, Dani!</h4>
              <p className="text-sm text-gray-500 mb-6">
                Sou sua personal trainer virtual. Posso te ajudar com dicas de exercícios, motivação e muito mais!
              </p>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((qp, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(qp.prompt)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    <qp.icon className="w-4 h-4" />
                    {qp.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                <span className="text-sm text-gray-500">Pensando...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 text-red-600 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
                <span>{error}</span>
                <button onClick={clearError} className="underline">Tentar novamente</button>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte algo..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
