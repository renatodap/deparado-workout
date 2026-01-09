import { useState, useCallback } from 'react';
import {
  Target,
  Flame,
  Beef,
  AlertCircle
} from 'lucide-react';
import { NutritionGoals } from '../types';
import { DEFAULT_NUTRITION_GOALS } from '../data/mealItems';

interface NutritionSettingsProps {
  nutritionGoals: NutritionGoals;
  onUpdateGoals: (goals: Partial<NutritionGoals>) => void;
  onClose: () => void;
}

export function NutritionSettings({
  nutritionGoals,
  onUpdateGoals,
  onClose
}: NutritionSettingsProps) {
  const [localGoals, setLocalGoals] = useState(nutritionGoals);

  const handleSaveGoals = useCallback(() => {
    onUpdateGoals(localGoals);
    onClose();
  }, [localGoals, onUpdateGoals, onClose]);

  const handleResetGoals = useCallback(() => {
    setLocalGoals(DEFAULT_NUTRITION_GOALS);
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Nutrition Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-900">Metas Diárias</h3>
          </div>
          <button
            onClick={handleResetGoals}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Restaurar padrões
          </button>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p>
              Suas metas são fixas e não mudam com exercício. Para uma mulher de 50 anos,
              recomendamos:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• <strong>1500-1700 kcal/dia</strong> para manutenção</li>
              <li>• <strong>1.0-1.2g de proteína por kg</strong> de peso corporal</li>
            </ul>
          </div>
        </div>

        {/* Calories goal */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Flame className="w-4 h-4 text-orange-500" />
            Meta de Calorias (kcal/dia)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1200}
              max={2500}
              step={50}
              value={localGoals.dailyCalories}
              onChange={(e) => setLocalGoals(prev => ({
                ...prev,
                dailyCalories: parseInt(e.target.value)
              }))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <span className="w-16 text-center font-bold text-orange-600">
              {localGoals.dailyCalories}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>1200</span>
            <span>2500</span>
          </div>
        </div>

        {/* Protein goal */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Beef className="w-4 h-4 text-red-500" />
            Meta de Proteína (g/dia)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={40}
              max={150}
              step={5}
              value={localGoals.dailyProtein}
              onChange={(e) => setLocalGoals(prev => ({
                ...prev,
                dailyProtein: parseInt(e.target.value)
              }))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <span className="w-16 text-center font-bold text-red-600">
              {localGoals.dailyProtein}g
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>40g</span>
            <span>150g</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveGoals}
          className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export default NutritionSettings;
