import type { FC } from 'react';

export const Hero: FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[45vh] md:min-h-[55vh] flex items-center justify-center text-center px-4 py-2 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1920&h=1080&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto fade-in w-full">
        <div className="relative flex justify-center items-center mb-4 md:mb-5">
          {/* Новогодние украшения вокруг логотипа */}
          <div className="absolute left-2 md:left-4 top-0 text-xl md:text-3xl animate-pulse">❄️</div>
          <div className="absolute right-2 md:right-4 top-0 text-xl md:text-3xl animate-pulse delay-300">⭐</div>
          <div className="absolute left-2 md:left-4 bottom-0 text-lg md:text-2xl animate-bounce">🎄</div>
          <div className="absolute right-2 md:right-4 bottom-0 text-lg md:text-2xl animate-bounce delay-150">🎁</div>
          
          {/* Логотип Еду Дома */}
          <div className="relative">
            <img 
              src="/edu-doma-logo.png" 
              alt="Еду Дома" 
              className="w-auto h-32 md:h-52 max-w-[90vw] md:max-w-full drop-shadow-2xl"
            />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight px-2">
          🎅 НОВОГОДНЕЕ ЗАСТОЛЬЕ 2026 🎄
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-white/90 px-2">
          Все рецепты, идеи и советы для идеального Нового года в одном месте
        </p>
      </div>
    </section>
  );
};
