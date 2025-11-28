import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onAddIngredient?: (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>, ingredient: string) => void;
  onAddAllIngredients?: (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>) => void;
  onShowToast?: (message: string) => void;
}

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  original: string;
}

const parseIngredient = (ingredient: string): ParsedIngredient => {
  const match = ingredient.match(/^(.+?)\s+([\d.]+)\s+(.+?)(?:\.)?$/);
  
  if (match) {
    const [, name, quantityStr, unit] = match;
    const quantity = parseFloat(quantityStr);
    if (!isNaN(quantity) && quantity > 0) {
      return {
        name: name.trim(),
        quantity,
        unit: unit.trim(),
        original: ingredient,
      };
    }
  }
  
  return {
    name: ingredient,
    quantity: 0,
    unit: '',
    original: ingredient,
  };
};

const formatQuantity = (quantity: number): string => {
  if (quantity % 1 === 0) {
    return quantity.toString();
  }
  // Format to 1 decimal place, remove trailing zeros
  return quantity.toFixed(1).replace(/\.?0+$/, '');
};

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onAddIngredient,
  onAddAllIngredients,
  onShowToast,
}) => {
  const defaultServings = recipe.servings || 8;
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [servings, setServings] = useState(defaultServings);

  const parsedIngredients = useMemo(() => {
    if (!recipe.ingredients) return [];
    return recipe.ingredients.map(parseIngredient);
  }, [recipe.ingredients]);

  const adjustedIngredients = useMemo(() => {
    return parsedIngredients.map((ingredient) => {
      if (ingredient.quantity === 0 || !ingredient.unit) {
        return ingredient.original;
      }
      const adjustedQuantity = (ingredient.quantity / defaultServings) * servings;
      return `${ingredient.name} ${formatQuantity(adjustedQuantity)} ${ingredient.unit}`;
    });
  }, [parsedIngredients, servings, defaultServings]);

  const adjustedNutrition = useMemo(() => {
    if (!recipe.nutrition) return null;
    const ratio = servings / defaultServings;
    return {
      proteins: recipe.nutrition.proteins * ratio,
      fats: recipe.nutrition.fats * ratio,
      carbs: recipe.nutrition.carbs * ratio,
      calories: recipe.nutrition.calories * ratio,
    };
  }, [recipe.nutrition, servings, defaultServings]);

  const handleIngredientsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIngredientsOpen(!isIngredientsOpen);
  };

  const handleDecreaseServings = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (servings > 1) {
      setServings(servings - 1);
    }
  };

  const handleIncreaseServings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setServings(servings + 1);
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
      // Create a recipe object with adjusted ingredients
      const adjustedRecipe = {
        ...recipe,
        ingredients: adjustedIngredients,
      };
      onAddAllIngredients(adjustedRecipe);
      if (onShowToast) {
        onShowToast(`✓ Все ингредиенты добавлены`);
      }
    }
  };

  const handleCardClick = () => {
    if (recipe.url) {
      window.open(recipe.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      className={`group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 ${recipe.url ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
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
            {isIngredientsOpen && (
              <div>
                {recipe.servings && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm text-gray-600">на</span>
                    <button
                      onClick={handleDecreaseServings}
                      className="text-sm font-bold text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed px-1"
                      disabled={servings <= 1}
                      type="button"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold min-w-[1.5rem] text-center">{servings}</span>
                    <button
                      onClick={handleIncreaseServings}
                      className="text-sm font-bold text-gray-600 hover:text-gray-800 px-1"
                      type="button"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600">порций</span>
                  </div>
                )}
                <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc mb-3">
                  {adjustedIngredients.map((ingredient, index) => (
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm mb-3"
                    type="button"
                  >
                    <span>➕</span>
                    <span>Добавить все ингредиенты в список</span>
                  </button>
                )}
                {recipe.nutrition && adjustedNutrition && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Пищевая ценность:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Белки:</span>
                        <span className="font-medium text-gray-800">{formatQuantity(adjustedNutrition.proteins)}г</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Жиры:</span>
                        <span className="font-medium text-gray-800">{formatQuantity(adjustedNutrition.fats)}г</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Углеводы:</span>
                        <span className="font-medium text-gray-800">{formatQuantity(adjustedNutrition.carbs)}г</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Калории:</span>
                        <span className="font-medium text-gray-800">{formatQuantity(adjustedNutrition.calories)}кКал</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
