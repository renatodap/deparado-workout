import { useState, useCallback, useMemo } from 'react';
import {
  Camera,
  Plus,
  ChevronRight,
  Flame,
  Beef,
  Target,
  Calendar,
  Clock,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { MealCamera } from '../components/MealCamera';
import { MealVerification } from '../components/MealVerification';
import { MealType, MealEntry, MealItem, Page } from '../types';
import { MEAL_TYPE_NAMES, MEAL_TYPE_ICONS, MEAL_TYPE_ORDER } from '../data/mealItems';

interface NutritionProps {
  // From useNutrition hook
  mealItems: MealItem[];
  mealEntries: MealEntry[];
  nutritionGoals: { dailyCalories: number; dailyProtein: number };
  // Methods
  addMealEntry: (entry: MealEntry) => void;
  deleteMealEntry: (id: string) => void;
  addMealItem: (item: MealItem) => void;
  getTodayProgress: () => {
    calories: { consumed: number; goal: number; remaining: number; percent: number };
    protein: { consumed: number; goal: number; remaining: number; percent: number };
  };
  getMealEntriesForDate: (date: string) => MealEntry[];
  onNavigate: (page: Page) => void;
}

type FlowState = 'idle' | 'camera' | 'verification';

export function Nutrition({
  mealItems,
  mealEntries,
  nutritionGoals,
  addMealEntry,
  deleteMealEntry,
  addMealItem,
  getTodayProgress,
  getMealEntriesForDate,
  onNavigate
}: NutritionProps) {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('almoco');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedDescription, setCapturedDescription] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().split('T')[0]
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const progress = getTodayProgress();
  const dayEntries = getMealEntriesForDate(selectedDate);

  // Group entries by meal type
  const entriesByMealType = useMemo(() => {
    const grouped: Partial<Record<MealType, MealEntry[]>> = {};
    for (const entry of dayEntries) {
      if (!grouped[entry.mealType]) {
        grouped[entry.mealType] = [];
      }
      grouped[entry.mealType]!.push(entry);
    }
    return grouped;
  }, [dayEntries]);

  // Calculate day totals
  const dayTotals = useMemo(() => {
    return dayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.totalMacros.calories,
        protein: acc.protein + entry.totalMacros.protein,
        carbs: acc.carbs + entry.totalMacros.carbs,
        fat: acc.fat + entry.totalMacros.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [dayEntries]);

  // Start meal logging flow
  const handleStartMealLog = useCallback((mealType: MealType) => {
    setSelectedMealType(mealType);
    setShowMealTypeSelector(false);
    setFlowState('camera');
  }, []);

  // Handle photo capture
  const handlePhotoCapture = useCallback((photo: string, description: string) => {
    setCapturedPhoto(photo);
    setCapturedDescription(description);
    setFlowState('verification');
  }, []);

  // Handle meal confirmation
  const handleMealConfirm = useCallback((entryData: Omit<MealEntry, 'id' | 'date' | 'timestamp' | 'verified'>) => {
    const newEntry: MealEntry = {
      ...entryData,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: selectedDate,
      timestamp: new Date().toISOString(),
      verified: true
    };

    addMealEntry(newEntry);
    setCapturedPhoto(null);
    setCapturedDescription('');
    setFlowState('idle');
  }, [addMealEntry, selectedDate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setCapturedPhoto(null);
    setCapturedDescription('');
    setFlowState('idle');
  }, []);

  // Handle delete
  const handleDeleteEntry = useCallback((id: string) => {
    deleteMealEntry(id);
    setShowDeleteConfirm(null);
  }, [deleteMealEntry]);

  // Navigate date
  const handleDateChange = useCallback((direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    // Don't allow future dates
    if (date <= new Date()) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    if (isToday) return 'Hoje';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Render the camera flow
  if (flowState === 'camera') {
    return (
      <MealCamera
        mealType={selectedMealType}
        onCapture={handlePhotoCapture}
        onCancel={handleCancel}
      />
    );
  }

  // Render the verification flow
  if (flowState === 'verification' && capturedPhoto) {
    return (
      <MealVerification
        mealType={selectedMealType}
        photoBase64={capturedPhoto}
        description={capturedDescription}
        existingItems={mealItems}
        onConfirm={handleMealConfirm}
        onCancel={handleCancel}
        onAddItem={addMealItem}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header
        title="Nutrição"
        subtitle="Acompanhe sua alimentação"
      />

      <main className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Date selector */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <button
            onClick={() => handleDateChange('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              {formatDate(selectedDate)}
            </p>
          </div>
          <button
            onClick={() => handleDateChange('next')}
            disabled={isToday}
            className={`p-2 rounded-full transition-colors ${
              isToday ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Daily progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            {isToday ? 'Progresso de Hoje' : 'Resumo do Dia'}
          </h2>

          {/* Calories */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Calorias</span>
              </div>
              <span className="text-sm text-gray-600">
                {isToday ? (
                  <>
                    <span className="font-bold text-gray-900">{progress.calories.consumed}</span>
                    {' / '}{progress.calories.goal} kcal
                  </>
                ) : (
                  <span className="font-bold text-gray-900">{dayTotals.calories} kcal</span>
                )}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  (isToday ? progress.calories.percent : (dayTotals.calories / nutritionGoals.dailyCalories) * 100) > 100
                    ? 'bg-red-500'
                    : 'bg-gradient-to-r from-orange-400 to-orange-500'
                }`}
                style={{ width: `${Math.min(100, isToday ? progress.calories.percent : (dayTotals.calories / nutritionGoals.dailyCalories) * 100)}%` }}
              />
            </div>
            {isToday && progress.calories.remaining > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Restam {progress.calories.remaining} kcal
              </p>
            )}
          </div>

          {/* Protein */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Beef className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Proteína</span>
              </div>
              <span className="text-sm text-gray-600">
                {isToday ? (
                  <>
                    <span className="font-bold text-gray-900">{Math.round(progress.protein.consumed)}</span>
                    {' / '}{progress.protein.goal}g
                  </>
                ) : (
                  <span className="font-bold text-gray-900">{Math.round(dayTotals.protein)}g</span>
                )}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, isToday ? progress.protein.percent : (dayTotals.protein / nutritionGoals.dailyProtein) * 100)}%` }}
              />
            </div>
            {isToday && progress.protein.remaining > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Restam {Math.round(progress.protein.remaining)}g de proteína
              </p>
            )}
          </div>
        </div>

        {/* Quick add button */}
        {isToday && (
          <button
            onClick={() => setShowMealTypeSelector(true)}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all touch-feedback shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2"
          >
            <Camera className="w-6 h-6" />
            REGISTRAR REFEIÇÃO
          </button>
        )}

        {/* Meal timeline */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Refeições</h2>

          {MEAL_TYPE_ORDER.map((mealType) => {
            const entries = entriesByMealType[mealType] || [];
            const mealTotal = entries.reduce((sum, e) => sum + e.totalMacros.calories, 0);

            return (
              <div
                key={mealType}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Meal type header */}
                <div className="p-4 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{MEAL_TYPE_ICONS[mealType]}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{MEAL_TYPE_NAMES[mealType]}</p>
                        {entries.length > 0 && (
                          <p className="text-sm text-gray-500">{mealTotal} kcal</p>
                        )}
                      </div>
                    </div>
                    {isToday && (
                      <button
                        onClick={() => handleStartMealLog(mealType)}
                        className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Entries */}
                {entries.length > 0 ? (
                  <div>
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                      >
                        {/* Photo thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={entry.photoBase64}
                            alt={entry.description}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 line-clamp-1">{entry.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-semibold text-primary-600">
                              {entry.totalMacros.calories} kcal
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(entry.totalMacros.protein)}g prot
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => setShowDeleteConfirm(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400">
                    Nenhuma refeição registrada
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {dayEntries.length === 0 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Nenhuma refeição registrada</p>
            <p className="text-sm text-gray-400 mt-1">
              {isToday ? 'Tire uma foto para começar' : 'Não há registros para este dia'}
            </p>
          </div>
        )}
      </main>

      {/* Meal type selector modal */}
      <Modal
        isOpen={showMealTypeSelector}
        onClose={() => setShowMealTypeSelector(false)}
        title="Qual refeição?"
      >
        <div className="p-4 space-y-2">
          {MEAL_TYPE_ORDER.map((mealType) => (
            <button
              key={mealType}
              onClick={() => handleStartMealLog(mealType)}
              className="w-full p-4 flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <span className="text-2xl">{MEAL_TYPE_ICONS[mealType]}</span>
              <span className="font-medium text-gray-900">{MEAL_TYPE_NAMES[mealType]}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
          ))}
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        title="Excluir refeição?"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Esta refeição será removida permanentemente do seu registro.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => showDeleteConfirm && handleDeleteEntry(showDeleteConfirm)}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Nutrition;
