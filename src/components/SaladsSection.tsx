import React, { useState, useRef, useEffect } from 'react';
import { Recipe, SaladFilter } from '../types';
import { RecipeCard } from './RecipeCard';

interface SaladsSectionProps {
  recipes: Recipe[];
  onAddIngredient?: (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>, ingredient: string) => void;
  onAddAllIngredients?: (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>) => void;
  onShowToast?: (message: string) => void;
}

const filters: { value: SaladFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'hot', label: 'Горячее' },
  { value: 'salad', label: 'Салаты' },
  { value: 'dessert', label: 'Десерты' },
  { value: 'snack', label: 'Закуски' },
  { value: 'sauce', label: 'Соусы и заправки' },
];

export const SaladsSection: React.FC<SaladsSectionProps> = ({
  recipes,
  onAddIngredient,
  onAddAllIngredients,
  onShowToast,
}) => {
  const [activeFilter, setActiveFilter] = useState<SaladFilter>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
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

  // Сброс счетчика при смене фильтра
  useEffect(() => {
    setVisibleCount(4);
  }, [activeFilter]);

  const filteredRecipes = recipes.filter(
    (recipe) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'sauce') {
        // Фильтруем соусы и заправки по названию
        const nameLower = recipe.name.toLowerCase();
        return nameLower.includes('соус') || 
               nameLower.includes('заправка') ||
               nameLower.includes('дип') ||
               nameLower.includes('майонез') ||
               nameLower.includes('крем');
      }
      if (activeFilter === 'salad') {
        // В категории "Салаты" только конкретные 4 рецепта
        const allowedSalads = [
          'Салат с курицей, ананасами и орехами',
          'Хрустящий салат с авокадо, креветками и помидорами черри',
          'Салат «Нежный»',
          'Сельдь под шубой (рулет)'
        ];
        return recipe.category === 'salad' && allowedSalads.includes(recipe.name);
      }
      return recipe.category === activeFilter;
    }
  );

  // Для категории "Все" показываем только часть рецептов
  const displayedRecipes = activeFilter === 'all' 
    ? filteredRecipes.slice(0, visibleCount)
    : filteredRecipes;

  const hasMore = activeFilter === 'all' && visibleCount < filteredRecipes.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  // Ссылки для кнопок "ещё" в разных категориях
  const getMoreLink = (): string | null => {
    switch (activeFilter) {
      case 'hot':
        return 'https://www.edimdoma.ru/retsepty/tags/41161-goryachie-blyuda-na-novyy-god-uzhin';
      case 'salad':
        return 'https://www.edimdoma.ru/retsepty/tags/5273-legkie-salaty';
      case 'snack':
        return 'https://www.edimdoma.ru/retsepty/tags/145-zakuski';
      case 'sauce':
        return 'https://www.edimdoma.ru/retsepty/tags/143-sousy-i-zapravki';
      default:
        return null;
    }
  };

  const moreLink = getMoreLink();

  return (
    <section
      id="salads"
      ref={ref}
      className={`pt-4 pb-16 md:pt-4 px-4 bg-white ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🥗 Меню и рецепты на Новый год 2026
        </h1>
        
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
          {displayedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onAddIngredient={onAddIngredient}
              onAddAllIngredients={onAddAllIngredients}
              onShowToast={onShowToast}
            />
          ))}
        </div>
        
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg"
              type="button"
            >
              Ещё
            </button>
          </div>
        )}

        {moreLink && (
          <div className="flex justify-center mt-8">
            <a
              href={moreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg inline-block"
            >
              Ещё
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

