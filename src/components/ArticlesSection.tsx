import React, { useRef, useEffect, useState } from 'react';
import { Article } from '../types';

interface ArticlesSectionProps {
  articles: Article[];
}

interface Tag {
  id: string;
  label: string;
  emoji: string;
  href: string;
}

const articleTags: Tag[] = [
  {
    id: '1',
    label: 'Новый 2026 год',
    emoji: '🎄',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/145215-novyy-2026-god',
  },
  {
    id: '2',
    label: 'Новогодний стол',
    emoji: '🍽️',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/4818-novogodniy-stol',
  },
  {
    id: '3',
    label: 'Рецепты от шеф-повара',
    emoji: '👨‍🍳',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/144382-retsepty-ot-shef-povara',
  },
  {
    id: '4',
    label: 'Неделя на вкус',
    emoji: '📅',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/145216-nedelya-na-vkus',
  },
  {
    id: '5',
    label: 'Рестораны',
    emoji: '🏪',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/8000-restorany',
  },
  {
    id: '6',
    label: 'Лайфхаки',
    emoji: '💡',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/6158-layfhaki',
  },
  {
    id: '7',
    label: 'Секреты приготовления',
    emoji: '🔍',
    href: 'https://www.edimdoma.ru/jivem_doma/posts/tags/847-sekrety-prigotovleniya',
  },
];

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
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

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const handleTagClick = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section
      id="articles"
      ref={ref}
      className={`py-16 px-4 bg-gray-50 ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          💡 Советы и идеи для идеального праздника
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleArticles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer block"
            >
              <article>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {article.emoji} {article.title}
                  </h3>
                  <p className="text-gray-600">
                    {article.description}
                  </p>
                </div>
              </article>
            </a>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg"
            >
              Ещё
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12">
          {articleTags.map((tag) => (
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


