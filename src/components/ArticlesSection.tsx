import React, { useRef, useEffect, useState } from 'react';
import { Article } from '../types';

interface ArticlesSectionProps {
  articles: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
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
      id="articles"
      ref={ref}
      className={`py-16 px-4 bg-gray-50 ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          💡 Советы и идеи для идеального праздника
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
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

        <div className="flex justify-center mt-12">
          <a
            href="https://www.edimdoma.ru/news/posts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg inline-block"
          >
            Ещё
          </a>
        </div>
      </div>
    </section>
  );
};


