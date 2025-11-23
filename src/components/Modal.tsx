import React, { useEffect } from 'react';
import { Recipe } from '../types';

interface ModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onAddIngredient?: (recipe: Recipe, ingredient: string) => void;
  onAddAllIngredients?: (recipe: Recipe) => void;
  onShowToast?: (message: string) => void;
}

export const Modal: React.FC<ModalProps> = ({
  recipe,
  onClose,
  onAddIngredient,
  onAddAllIngredients,
  onShowToast,
}) => {
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

  const handleAddIngredient = (ingredient: string) => {
    if (onAddIngredient && recipe) {
      onAddIngredient(recipe, ingredient);
      // Extract ingredient name for toast (simple version)
      const ingredientName = ingredient.split(/\s+/).slice(1).join(' ') || ingredient;
      if (onShowToast) {
        onShowToast(`✓ ${ingredientName} добавлено`);
      }
    }
  };

  const handleAddAll = () => {
    if (onAddAllIngredients && recipe && recipe.ingredients) {
      onAddAllIngredients(recipe);
      if (onShowToast) {
        onShowToast(`✓ Все ингредиенты добавлены`);
      }
    }
  };

  const hasIngredients = recipe.ingredients && recipe.ingredients.length > 0;

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

          {hasIngredients && recipe.ingredients && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Ингредиенты:</h3>
              <ul className="space-y-2 mb-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="text-gray-700 flex-1">{ingredient}</span>
                    {onAddIngredient && (
                      <button
                        onClick={() => handleAddIngredient(ingredient)}
                        className="ml-3 bg-primary hover:bg-primary-dark text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold text-lg"
                        aria-label={`Добавить ${ingredient}`}
                      >
                        +
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {onAddAllIngredients && (
                <button
                  onClick={handleAddAll}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>➕</span>
                  <span>Добавить все ингредиенты в список</span>
                </button>
              )}
            </div>
          )}

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


