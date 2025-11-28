import React, { useRef, useEffect, useState } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface FeaturedRecipesProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

export const FeaturedRecipes: React.FC<FeaturedRecipesProps> = ({ recipes, onRecipeClick }) => {
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

  return (
    <section
      id="hot"
      ref={ref}
      className={`py-16 px-4 bg-gray-50 ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          🔥 Главные звезды новогоднего стола
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};


