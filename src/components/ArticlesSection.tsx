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
            <article
              key={article.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
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
                <p className="text-gray-600 mb-4">{article.description}</p>
                <p className="text-primary font-semibold">
                  Читать {article.readTime} →
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};


