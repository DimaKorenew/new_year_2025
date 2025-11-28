import React, { useState, useRef, useEffect } from 'react';
import { Recipe, DrinkCategory } from '../types';
import { RecipeCard } from './RecipeCard';

interface DrinksSectionProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

const categories: { value: DrinkCategory; label: string; emoji: string }[] = [
  { value: 'alcoholic', label: 'АЛКОГОЛЬНЫЕ', emoji: '🍾' },
  { value: 'non-alcoholic', label: 'БЕЗАЛКОГОЛЬНЫЕ', emoji: '🥤' },
  { value: 'hot', label: 'ГОРЯЧИЕ', emoji: '☕' },
];

export const DrinksSection: React.FC<DrinksSectionProps> = ({ recipes, onRecipeClick }) => {
  const [expandedCategory, setExpandedCategory] = useState<DrinkCategory | null>(null);
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

  const toggleCategory = (category: DrinkCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <section
      id="drinks"
      ref={ref}
      className={`py-16 px-4 bg-white ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          🍹 За Новый год!
        </h2>
        
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryRecipes = recipes.filter(
              (r) => r.drinkCategory === category.value
            );
            const isExpanded = expandedCategory === category.value;

            return (
              <div key={category.value} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.value)}
                  className="w-full p-6 bg-gradient-to-r from-secondary to-secondary-dark text-white text-left flex items-center justify-between hover:opacity-90 transition-opacity"
                  type="button"
                  aria-expanded={isExpanded}
                >
                  <span className="text-2xl font-bold">
                    {category.emoji} {category.label}
                  </span>
                  <span className="text-2xl">{isExpanded ? '−' : '+'}</span>
                </button>
                
                {isExpanded && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

