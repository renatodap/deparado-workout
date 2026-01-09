import { useState } from 'react';
import {
  User,
  Calendar,
  Target,
  Settings,
  Bell,
  Volume2,
  Vibrate,
  Lightbulb,
  Clock,
  Trash2,
  Download,
  ChevronRight,
  Info,
  Heart,
  Utensils,
  Flame,
  Beef
} from 'lucide-react';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { NutritionSettings } from '../components/NutritionSettings';
import { User as UserType, Stats, AppSettings, Page, NutritionGoals, AISettings } from '../types';

interface ProfileProps {
  user: UserType;
  stats: Stats;
  settings: AppSettings;
  nutritionGoals?: NutritionGoals;
  aiSettings?: AISettings;
  onUpdateUser: (user: Partial<UserType>) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onUpdateNutritionGoals?: (goals: Partial<NutritionGoals>) => void;
  onUpdateAISettings?: (settings: Partial<AISettings>) => void;
  onResetData: () => void;
  onNavigate: (page: Page) => void;
}

export function Profile({
  user,
  stats,
  settings,
  nutritionGoals,
  aiSettings,
  onUpdateUser,
  onUpdateSettings,
  onUpdateNutritionGoals,
  onUpdateAISettings,
  onResetData,
  onNavigate
}: ProfileProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [showNutritionSettings, setShowNutritionSettings] = useState(false);

  const startDate = new Date(user.startDate);
  const daysSinceStart = Math.floor(
    (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateUser({ name: tempName.trim() });
    }
    setEditingName(false);
  };

  const handleExportData = () => {
    const data = {
      user,
      stats,
      settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dani-fitness-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Meu Perfil" />

      <main className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-primary-600" />
          </div>

          {editingName ? (
            <div className="flex items-center gap-2 justify-center mb-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-xl font-bold text-center bg-gray-50 rounded-lg px-3 py-1 border-2 border-primary-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-medium"
              >
                Salvar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-xl font-bold text-gray-900 mb-1 hover:text-primary-600 transition-colors"
            >
              {user.name}
            </button>
          )}

          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <Calendar className="w-4 h-4" />
            Membro há {daysSinceStart} dias
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary-600">{stats.totalWorkouts}</p>
              <p className="text-xs text-gray-500">Treinos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500">{stats.longestStreak}</p>
              <p className="text-xs text-gray-500">Maior Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {(stats.totalVolumeAllTime / 1000).toFixed(1)}t
              </p>
              <p className="text-xs text-gray-500">Volume Total</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            Meus Objetivos
          </h3>
          <div className="space-y-2">
            {(user.goals || ['Ganhar força', 'Melhorar a saúde', 'Manter consistência']).map(
              (goal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-primary-50 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-sm text-gray-700">{goal}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Nutrition Settings */}
        {nutritionGoals && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-green-500" />
              Metas Nutricionais
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-700">Calorias diárias</span>
                </div>
                <span className="font-bold text-orange-600">{nutritionGoals.dailyCalories} kcal</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Beef className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-700">Proteína diária</span>
                </div>
                <span className="font-bold text-red-600">{nutritionGoals.dailyProtein}g</span>
              </div>
              <button
                onClick={() => setShowNutritionSettings(true)}
                className="w-full py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors"
              >
                Configurar metas e IA
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <h3 className="font-semibold text-gray-900 p-4 pb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Configurações
          </h3>

          {/* Rest time */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Tempo de descanso</span>
            </div>
            <select
              value={settings.defaultRestTime}
              onChange={(e) => onUpdateSettings({ defaultRestTime: parseInt(e.target.value) })}
              className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700"
            >
              <option value={30}>30s</option>
              <option value={45}>45s</option>
              <option value={60}>60s</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
            </select>
          </div>

          {/* Sound */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Som</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-7 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Vibration */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Vibrate className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Vibração</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
              className={`w-12 h-7 rounded-full transition-colors ${
                settings.vibrationEnabled ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Tips */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Mostrar dicas</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ showTips: !settings.showTips })}
              className={`w-12 h-7 rounded-full transition-colors ${
                settings.showTips ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.showTips ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Exportar dados</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Sobre o app</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 text-left hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-red-600">Resetar todos os dados</span>
            </div>
          </button>
        </div>

        {/* App version */}
        <p className="text-center text-sm text-gray-400">
          Dani Fitness v1.0.0
        </p>
      </main>

      {/* Reset confirmation */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Resetar Dados?"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Isso irá apagar todo o seu histórico de treinos, estatísticas e recordes pessoais.
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onResetData();
                setShowResetConfirm(false);
              }}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Resetar
            </button>
          </div>
        </div>
      </Modal>

      {/* About modal */}
      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="Sobre o App"
      >
        <div className="p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Dani Fitness</h3>
          <p className="text-gray-600 mb-4">
            Seu app de treino e nutrição personalizado
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Criado especialmente para Daniela Dansieri</p>
            <p>Academia: Clube Paulistano</p>
            <p>Versão 2.0.0</p>
          </div>
          <div className="mt-6 p-4 bg-primary-50 rounded-xl">
            <p className="text-sm text-primary-700">
              "Cada treino te deixa mais forte!" 💪
            </p>
          </div>
        </div>
      </Modal>

      {/* Nutrition settings modal */}
      {nutritionGoals && aiSettings && onUpdateNutritionGoals && onUpdateAISettings && (
        <Modal
          isOpen={showNutritionSettings}
          onClose={() => setShowNutritionSettings(false)}
          title="Configurações de Nutrição"
          size="lg"
        >
          <NutritionSettings
            nutritionGoals={nutritionGoals}
            aiSettings={aiSettings}
            onUpdateGoals={onUpdateNutritionGoals}
            onUpdateAISettings={onUpdateAISettings}
            onClose={() => setShowNutritionSettings(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default Profile;
