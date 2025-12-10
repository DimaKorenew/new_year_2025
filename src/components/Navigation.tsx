import React, { useState, useEffect } from 'react';

const navItems = [
  { id: 'salads', label: '🥗 Рецепты', href: '/new-year-2025/#salads' },
  { id: 'articles', label: '📰 Идеи и советы', href: '/new-year-2025/#articles' },
  { id: 'video', label: '🎬 Видео', href: '/new-year-2025/#video' },
  { id: 'timeline', label: '⏰ План', href: '/new-year-2025/#timeline' },
];

export const Navigation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex overflow-x-auto gap-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="whitespace-nowrap px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex-shrink-0 hidden md:block">
            <img 
              src="https://new-year-2025-lilac.vercel.app/edu-doma-logo.png" 
              alt="Еду Дома" 
              className="h-12 w-auto"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
