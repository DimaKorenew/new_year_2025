import React, { useEffect } from 'react';
import { Recipe } from '../types';

interface ModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ recipe, onClose }) => {
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [recipe]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!recipe) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">
            {recipe.emoji} {recipe.name}
          </h2>
          <p className="text-gray-600 mb-4 flex items-center gap-2">
            <span>⏱️</span>
            <span>{recipe.time}</span>
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-700">
              Здесь будет подробный рецепт приготовления {recipe.name.toLowerCase()}.
              В реальном приложении здесь будет полная инструкция с ингредиентами и пошаговыми действиями.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


