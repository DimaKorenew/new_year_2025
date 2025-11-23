import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onOpen?: (recipe: Recipe) => void;
  onAddIngredient?: (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>, ingredient: string) => void;
  onAddAllIngredients?: (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>) => void;
  onShowToast?: (message: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onOpen,
  onAddIngredient,
  onAddAllIngredients,
  onShowToast,
}) => {
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

  const handleIngredientsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIngredientsOpen(!isIngredientsOpen);
  };

  const handleAddIngredient = (e: React.MouseEvent, ingredient: string) => {
    e.stopPropagation();
    if (onAddIngredient) {
      onAddIngredient(recipe, ingredient);
      // Extract ingredient name for toast
      const ingredientName = ingredient.split(/\s+/).slice(1).join(' ') || ingredient;
      if (onShowToast) {
        onShowToast(`✓ ${ingredientName} добавлено`);
      }
    }
  };

  const handleAddAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddAllIngredients) {
      onAddAllIngredients(recipe);
      if (onShowToast) {
        onShowToast(`✓ Все ингредиенты добавлены`);
      }
    }
  };

  return (
    <article
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
      onClick={() => onOpen?.(recipe)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">
          {recipe.emoji} {recipe.name}
        </h3>
        
        {recipe.description && (
          <p className="text-sm text-gray-600 mb-2">
            {recipe.description}
          </p>
        )}
        
        {recipe.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg">⭐</span>
            ))}
          </div>
        )}
        
        <p className="text-gray-600 mb-4 flex items-center gap-2">
          <span>⏱️</span>
          <span>{recipe.time}</span>
        </p>
        
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleIngredientsClick}
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-2 mb-2"
              type="button"
            >
              <span>{isIngredientsOpen ? '▼' : '▶'}</span>
              <span>Ингредиенты</span>
            </button>
            {isIngredientsOpen && recipe.ingredients && (
              <div>
                <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc mb-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center justify-between pr-2">
                      <span className="flex-1">{ingredient}</span>
                      {onAddIngredient && (
                        <button
                          onClick={(e) => handleAddIngredient(e, ingredient)}
                          className="ml-2 bg-primary hover:bg-primary-dark text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors font-bold text-sm flex-shrink-0"
                          aria-label={`Добавить ${ingredient}`}
                          type="button"
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                    type="button"
                  >
                    <span>➕</span>
                    <span>Добавить все ингредиенты в список</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        <button
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(recipe);
          }}
          type="button"
          aria-label={`Открыть рецепт ${recipe.name}`}
        >
          Открыть рецепт
        </button>
      </div>
    </article>
  );
};
