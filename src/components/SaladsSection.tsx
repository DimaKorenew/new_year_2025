import React, { useState, useRef, useEffect } from 'react';
import { Recipe, SaladFilter } from '../types';
import { RecipeCard } from './RecipeCard';

interface SaladsSectionProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

const filters: { value: SaladFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'classic', label: 'Классические' },
  { value: 'modern', label: 'Современные' },
  { value: 'light', label: 'Лёгкие' },
  { value: 'hearty', label: 'Сытные' },
];

export const SaladsSection: React.FC<SaladsSectionProps> = ({ recipes, onRecipeClick }) => {
  const [activeFilter, setActiveFilter] = useState<SaladFilter>('all');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredRecipes = recipes.filter(
    (recipe) => activeFilter === 'all' || recipe.saladFilter === activeFilter
  );

  return (
    <section
      id="salads"
      ref={ref}
      className={`py-16 px-4 bg-white ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🥗 Новогоднее меню: от классики до экспериментов
        </h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              type="button"
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={onRecipeClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

