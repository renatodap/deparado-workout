import { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Flame,
  Beef,
  ChevronRight,
  X,
  Star
} from 'lucide-react';
import { Modal } from './Modal';
import { MealTemplate, MealType, MealEntry } from '../types';
import { MEAL_TYPE_NAMES, MEAL_TYPE_ICONS } from '../data/mealItems';

interface MealTemplatesProps {
  templates: MealTemplate[];
  onUseTemplate: (template: MealTemplate) => void;
  onCreateTemplate: (entry: MealEntry, name: string) => void;
  onDeleteTemplate: (id: string) => void;
  recentEntries: MealEntry[];
}

export function MealTemplates({
  templates,
  onUseTemplate,
  onCreateTemplate,
  onDeleteTemplate,
  recentEntries
}: MealTemplatesProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MealEntry | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreateTemplate = () => {
    if (selectedEntry && templateName.trim()) {
      onCreateTemplate(selectedEntry, templateName.trim());
      setShowCreateModal(false);
      setSelectedEntry(null);
      setTemplateName('');
    }
  };

  const handleSelectEntryForTemplate = (entry: MealEntry) => {
    setSelectedEntry(entry);
    setTemplateName(`${MEAL_TYPE_NAMES[entry.mealType]} - ${entry.description.slice(0, 30)}`);
  };

  // Sort templates by usage count
  const sortedTemplates = [...templates].sort((a, b) => b.usageCount - a.usageCount);

  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          Meus Templates
        </h2>
        {recentEntries.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-primary-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar
          </button>
        )}
      </div>

      {/* Templates list */}
      {sortedTemplates.length > 0 ? (
        <div className="space-y-2">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => onUseTemplate(template)}
                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{MEAL_TYPE_ICONS[template.mealType]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{template.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-primary-600 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {template.totalMacros.calories} kcal
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Beef className="w-3 h-3" />
                      {Math.round(template.totalMacros.protein)}g prot
                    </span>
                  </div>
                  {template.usageCount > 0 && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Usado {template.usageCount}x
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <div className="px-4 pb-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(template.id);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Nenhum template criado</p>
          <p className="text-sm text-gray-400 mt-1">
            Crie templates a partir das suas refeições para registrar rapidamente
          </p>
        </div>
      )}

      {/* Create template modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedEntry(null);
          setTemplateName('');
        }}
        title="Criar Template"
        size="lg"
      >
        <div className="p-4 space-y-4">
          {/* Entry selection */}
          {!selectedEntry ? (
            <>
              <p className="text-sm text-gray-600">
                Selecione uma refeição recente para criar um template:
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleSelectEntryForTemplate(entry)}
                    className="w-full p-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={entry.photoBase64}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{entry.description}</p>
                      <p className="text-xs text-gray-500">
                        {MEAL_TYPE_NAMES[entry.mealType]} · {entry.totalMacros.calories} kcal
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Selected entry preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={selectedEntry.photoBase64}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{selectedEntry.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedEntry.totalMacros.calories} kcal · {Math.round(selectedEntry.totalMacros.protein)}g prot
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Template name input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do template
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Ex: Meu café da manhã padrão"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedEntry(null);
                    setTemplateName('');
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={!templateName.trim()}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    templateName.trim()
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Criar Template
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        title="Excluir Template?"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Este template será excluído permanentemente.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (showDeleteConfirm) {
                  onDeleteTemplate(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }
              }}
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

export default MealTemplates;
