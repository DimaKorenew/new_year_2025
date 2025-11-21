import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onOpen?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onOpen }) => {
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
        <p className="text-gray-600 mb-4 flex items-center gap-2">
          <span>⏱️</span>
          <span>{recipe.time}</span>
        </p>
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
