import React, { useRef, useEffect, useState } from 'react';

interface Tag {
  id: string;
  label: string;
  emoji: string;
  href: string;
}

const tags: Tag[] = [
  { id: '1', label: 'Горячее', emoji: '🍖', href: '/recipes?category=hot' },
  { id: '2', label: 'Салаты', emoji: '🥗', href: '/recipes?category=salad' },
  { id: '3', label: 'Десерты', emoji: '🍰', href: '/recipes?category=dessert' },
  { id: '4', label: 'Напитки', emoji: '🍹', href: '/recipes?category=drink' },
  { id: '5', label: 'Закуски', emoji: '🥪', href: '/recipes?category=snack' },
  { id: '6', label: 'Выпечка', emoji: '🥐', href: '/recipes?category=baking' },
  { id: '7', label: 'Супы', emoji: '🍲', href: '/recipes?category=soup' },
  { id: '8', label: 'Быстро', emoji: '⚡', href: '/recipes?time=fast' },
  { id: '9', label: 'Вегетарианское', emoji: '🥬', href: '/recipes?diet=vegetarian' },
  { id: '10', label: 'Классика', emoji: '⭐', href: '/recipes?filter=classic' },
  { id: '11', label: 'Новинки', emoji: '✨', href: '/recipes?filter=new' },
  { id: '12', label: 'Праздничное', emoji: '🎉', href: '/recipes?filter=holiday' },
  { id: '13', label: 'Для детей', emoji: '👶', href: '/recipes?audience=kids' },
  { id: '14', label: 'Здоровое', emoji: '💚', href: '/recipes?diet=healthy' },
];

export const TagsSection: React.FC = () => {
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

  const handleTagClick = (href: string) => {
    // В реальном приложении здесь будет навигация
    // Пока просто скроллим к соответствующей секции или показываем alert
    if (href.includes('category=salad')) {
      window.location.href = '#salads';
    } else if (href.includes('category=dessert')) {
      window.location.href = '#desserts';
    } else if (href.includes('category=drink')) {
      window.location.href = '#drinks';
    } else {
      // Для других тегов можно открыть модальное окно или перейти на страницу
      console.log('Navigate to:', href);
    }
  };

  return (
    <section
      ref={ref}
      className={`py-12 px-4 bg-white ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
          КАТАЛОГ РЕЦЕПТОВ
        </h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.href)}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-primary hover:text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              type="button"
            >
              <span className="text-xl md:text-2xl">{tag.emoji}</span>
              <span className="font-medium text-sm md:text-base whitespace-nowrap">
                {tag.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

