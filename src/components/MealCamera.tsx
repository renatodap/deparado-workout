import { useState, useRef, useCallback } from 'react';
import { Camera, Image, X, Check, RotateCcw, Utensils } from 'lucide-react';
import { MealType } from '../types';
import { MEAL_TYPE_NAMES, MEAL_TYPE_ICONS } from '../data/mealItems';

interface MealCameraProps {
  mealType: MealType;
  onCapture: (photoBase64: string, description: string) => void;
  onCancel: () => void;
}

const MAX_IMAGE_SIZE = 800; // Max width/height for compression
const JPEG_QUALITY = 0.8;

export function MealCamera({ mealType, onCapture, onCancel }: MealCameraProps) {
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress image to reduce storage size
  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_IMAGE_SIZE) {
              height = Math.round((height * MAX_IMAGE_SIZE) / width);
              width = MAX_IMAGE_SIZE;
            }
          } else {
            if (height > MAX_IMAGE_SIZE) {
              width = Math.round((width * MAX_IMAGE_SIZE) / height);
              height = MAX_IMAGE_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          resolve(base64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem é muito grande. Máximo 10MB.');
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const compressed = await compressImage(file);
      setPhotoBase64(compressed);
    } catch (err) {
      setError('Erro ao processar a imagem. Tente novamente.');
      console.error('Image compression error:', err);
    } finally {
      setIsCapturing(false);
    }
  }, [compressImage]);

  const handleCapture = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleGallery = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRetake = useCallback(() => {
    setPhotoBase64(null);
    setDescription('');
    setError(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!photoBase64) {
      setError('Tire uma foto da sua refeição.');
      return;
    }
    if (!description.trim()) {
      setError('Descreva brevemente o que você está comendo.');
      return;
    }
    onCapture(photoBase64, description.trim());
  }, [photoBase64, description, onCapture]);

  const canConfirm = photoBase64 && description.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <p className="text-lg font-semibold text-white flex items-center gap-2">
            <span>{MEAL_TYPE_ICONS[mealType]}</span>
            {MEAL_TYPE_NAMES[mealType]}
          </p>
          <p className="text-sm text-gray-400">Registrar refeição</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Photo area */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {photoBase64 ? (
            <img
              src={photoBase64}
              alt="Foto da refeição"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Utensils className="w-12 h-12 text-gray-500" />
              </div>
              <p className="text-gray-400 mb-2">Tire uma foto da sua refeição</p>
              <p className="text-sm text-gray-500">
                A foto é obrigatória para análise nutricional
              </p>
            </div>
          )}

          {isCapturing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Description input */}
        <div className="bg-gray-800 p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descreva sua refeição *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Arroz, feijão, frango grelhado e salada de alface com tomate"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={2}
          />
          <p className="text-xs text-gray-400 mt-1">
            Quanto mais detalhes, melhor a análise nutricional
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 py-2 bg-red-900/50">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 safe-area-bottom">
          {photoBase64 ? (
            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Nova Foto
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                  canConfirm
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-5 h-5" />
                Analisar
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleGallery}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <Image className="w-5 h-5" />
                Galeria
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Câmera
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export default MealCamera;
