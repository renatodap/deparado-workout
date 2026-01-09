import { useState, useEffect } from 'react';
import {
  X,
  Check,
  AlertCircle,
  Loader,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Trash2,
  Save,
  Sparkles,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Lightbulb
} from 'lucide-react';
import { MealType, MealItem, MealComponent, Macros, MealEntry } from '../types';
import { MEAL_TYPE_NAMES, MEAL_TYPE_ICONS, sumMacros, calculateMacrosForQuantity } from '../data/mealItems';
import { analyzeMealPhoto, AIMealAnalysis, AIAnalyzedComponent } from '../services/aiService';

interface MealVerificationProps {
  mealType: MealType;
  photoBase64: string;
  description: string;
  existingItems: MealItem[];
  onConfirm: (entry: Omit<MealEntry, 'id' | 'date' | 'timestamp' | 'verified'>) => void;
  onCancel: () => void;
  onAddItem: (item: MealItem) => void;
}

interface EditableComponent {
  id: string;
  name: string;
  quantity: number;
  servingUnit: string;
  macros: Macros;
  existingItemId?: string;
  confidence: number;
}

export function MealVerification({
  mealType,
  photoBase64,
  description,
  existingItems,
  onConfirm,
  onCancel,
  onAddItem
}: MealVerificationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIMealAnalysis | null>(null);
  const [components, setComponents] = useState<EditableComponent[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState('');

  // Run AI analysis on mount
  useEffect(() => {
    async function runAnalysis() {
      setIsLoading(true);
      setError(null);

      const result = await analyzeMealPhoto(
        photoBase64,
        description,
        mealType,
        existingItems
      );

      if (result.success) {
        setAnalysis(result);
        // Convert AI components to editable format
        const editableComponents: EditableComponent[] = result.components.map((comp, index) => ({
          id: `comp_${index}_${Date.now()}`,
          name: comp.name,
          quantity: comp.quantity,
          servingUnit: comp.servingUnit,
          macros: comp.macros,
          existingItemId: comp.existingItemId,
          confidence: comp.confidence
        }));
        setComponents(editableComponents);
      } else {
        setError(result.error || 'Erro ao analisar a refeição.');
      }

      setIsLoading(false);
    }

    runAnalysis();
  }, [photoBase64, description, mealType, existingItems]);

  // Calculate current totals from editable components
  const currentTotals = sumMacros(components.map(c => c.macros));

  // Handle quantity change for a component
  const handleQuantityChange = (componentId: string, delta: number) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id !== componentId) return comp;

      const newQuantity = Math.max(0.5, comp.quantity + delta);
      const ratio = newQuantity / comp.quantity;

      return {
        ...comp,
        quantity: newQuantity,
        macros: {
          calories: Math.round(comp.macros.calories * ratio),
          protein: Math.round(comp.macros.protein * ratio * 10) / 10,
          carbs: Math.round(comp.macros.carbs * ratio * 10) / 10,
          fat: Math.round(comp.macros.fat * ratio * 10) / 10,
          fiber: comp.macros.fiber ? Math.round(comp.macros.fiber * ratio * 10) / 10 : undefined
        }
      };
    }));
  };

  // Remove a component
  const handleRemoveComponent = (componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (components.length === 0) {
      setError('Adicione pelo menos um item à refeição.');
      return;
    }

    const mealComponents: MealComponent[] = components.map(c => ({
      itemId: c.existingItemId || `temp_${c.id}`,
      itemName: c.name,
      quantity: c.quantity,
      macros: c.macros
    }));

    onConfirm({
      mealType,
      photoBase64,
      description,
      components: mealComponents,
      totalMacros: currentTotals,
      aiAnalysis: analysis?.explanation,
      notes: notes.trim() || undefined
    });
  };

  // Confidence indicator color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>{MEAL_TYPE_ICONS[mealType]}</span>
            {MEAL_TYPE_NAMES[mealType]}
          </p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={isLoading || components.length === 0}
          className={`p-2 rounded-full transition-colors ${
            isLoading || components.length === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-primary-600 hover:bg-primary-50'
          }`}
        >
          <Check className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Photo preview */}
        <div className="relative h-48 bg-gray-900">
          <img
            src={photoBase64}
            alt="Refeição"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
            <p className="text-gray-900 font-medium">Analisando sua refeição...</p>
            <p className="text-sm text-gray-500 mt-1">
              Usando IA para identificar alimentos e calcular nutrientes
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="p-6">
            <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Erro na análise</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis results */}
        {!isLoading && !error && analysis && (
          <div className="p-4 space-y-4">
            {/* Summary card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-gray-900">Resumo Nutricional</h3>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                  <p className="text-lg font-bold text-orange-600">{currentTotals.calories}</p>
                  <p className="text-xs text-orange-600">kcal</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <Beef className="w-5 h-5 mx-auto mb-1 text-red-500" />
                  <p className="text-lg font-bold text-red-600">{currentTotals.protein}g</p>
                  <p className="text-xs text-red-600">proteína</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <Wheat className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                  <p className="text-lg font-bold text-amber-600">{currentTotals.carbs}g</p>
                  <p className="text-xs text-amber-600">carbs</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <Droplet className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-lg font-bold text-blue-600">{currentTotals.fat}g</p>
                  <p className="text-xs text-blue-600">gordura</p>
                </div>
              </div>

              {/* AI Explanation */}
              {analysis.explanation && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  {analysis.explanation}
                </p>
              )}
            </div>

            {/* Components list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">
                  Alimentos identificados ({components.length})
                </span>
                {showDetails ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showDetails && (
                <div className="border-t border-gray-100">
                  {components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{comp.name}</p>
                          <p className="text-sm text-gray-500">
                            {comp.quantity} {comp.servingUnit} · {comp.macros.calories} kcal
                          </p>
                          <p className={`text-xs ${getConfidenceColor(comp.confidence)}`}>
                            Confiança: {Math.round(comp.confidence * 100)}%
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveComponent(comp.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(comp.id, -0.5)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                          {comp.quantity} {comp.servingUnit}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(comp.id, 0.5)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h4 className="font-medium text-amber-800">Dicas para você</h4>
                </div>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre esta refeição..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      {!isLoading && !error && (
        <div className="p-4 bg-white border-t border-gray-200 safe-area-bottom">
          <button
            onClick={handleConfirm}
            disabled={components.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              components.length > 0
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-6 h-6" />
            CONFIRMAR E REGISTRAR
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Ao confirmar, você valida que os valores estão corretos
          </p>
        </div>
      )}
    </div>
  );
}

export default MealVerification;
