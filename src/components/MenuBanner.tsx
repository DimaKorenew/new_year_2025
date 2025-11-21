import React, { useRef, useEffect, useState } from 'react';
import { Button } from './Button';

export const MenuBanner: React.FC = () => {
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
      ref={ref}
      className={`py-16 px-4 ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              📋 ГОТОВОЕ НОВОГОДНЕЕ МЕНЮ
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Мы составили сбалансированное меню на 8 персон
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Список всех блюд</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Автоматический список покупок</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>План приготовления по дням</span>
              </li>
            </ul>
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100">
              🎯 Посмотреть готовое меню
            </Button>
          </div>
          <div className="text-8xl">📋</div>
        </div>
      </div>
    </section>
  );
};


