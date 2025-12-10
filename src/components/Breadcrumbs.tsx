import React from 'react';

export const Breadcrumbs: React.FC = () => {
  return (
    <nav className="py-6 px-4 bg-gray-50" aria-label="Хлебные крошки">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a
              href="https://www.edimdoma.ru"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              ЕдимДома
            </a>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <a
              href="https://www.edimdoma.ru/news/posts"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Новости
            </a>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <a
              href="https://www.edimdoma.ru/jivem_doma/posts"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Статьи
            </a>
          </li>
        </ol>
      </div>
    </nav>
  );
};

