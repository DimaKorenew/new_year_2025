import React, { useRef, useEffect, useState } from 'react';

interface Tag {
  id: string;
  label: string;
  emoji: string;
  href: string;
}

const tags: Tag[] = [
  {
    id: '1',
    label: 'Горячее',
    emoji: '🍖',
    href: 'https://www.edimdoma.ru/retsepty/tags/41161-goryachie-blyuda-na-novyy-god-uzhin',
  },
  {
    id: '2',
    label: 'Салаты',
    emoji: '🥗',
    href: 'https://www.edimdoma.ru/retsepty/tags/5273-legkie-salaty',
  },
  {
    id: '3',
    label: 'Закуски',
    emoji: '🥪',
    href: 'https://www.edimdoma.ru/retsepty/tags/145-zakuski',
  },
  {
    id: '4',
    label: 'Десерты',
    emoji: '🍰',
    href: 'https://www.edimdoma.ru/retsepty/tags/189-deserty',
  },
  {
    id: '5',
    label: 'Выпечка',
    emoji: '🥐',
    href: 'https://www.edimdoma.ru/retsepty/tags/183-vypechka',
  },
  {
    id: '6',
    label: 'Гарниры',
    emoji: '🥔',
    href: 'https://www.edimdoma.ru/retsepty/tags/41250-v-duhovke-garniry',
  },
  {
    id: '7',
    label: 'Соусы-дипы',
    emoji: '🥣',
    href: 'https://www.edimdoma.ru/retsepty/tags/256-sousy-dipy',
  },
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
    window.open(href, '_blank', 'noopener,noreferrer');
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

