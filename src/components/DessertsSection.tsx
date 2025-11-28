import React, { useRef, useEffect, useState } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface DessertsSectionProps {
  recipes: Recipe[];
}

export const DessertsSection: React.FC<DessertsSectionProps> = ({ recipes }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="desserts"
      ref={sectionRef}
      className={`py-16 px-4 bg-gray-50 ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          🍰 Сладкая точка праздника
        </h2>
        
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Прокрутить влево"
            type="button"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Прокрутить вправо"
            type="button"
          >
            →
          </button>
          
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recipes.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-80">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

