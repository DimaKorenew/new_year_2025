import React from 'react';

interface ShoppingListFABProps {
  itemsCount: number;
  onClick: () => void;
}

export const ShoppingListFAB: React.FC<ShoppingListFABProps> = ({ itemsCount, onClick }) => {
  if (itemsCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:right-6 z-50">
      <button
        onClick={onClick}
        className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-3 h-[60px] md:h-auto"
        aria-label="Открыть список покупок"
      >
        <span className="text-xl">🛒</span>
        <span className="hidden md:inline">Список покупок</span>
        <span className="bg-white text-primary rounded-full px-3 py-1 text-sm font-bold min-w-[2rem] flex items-center justify-center">
          {itemsCount}
        </span>
      </button>
    </div>
  );
};

