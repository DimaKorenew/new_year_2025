import React, { useState, useEffect } from 'react';
import { ShoppingList, ShoppingItem } from '../types';
import { track } from '../utils/analytics';

interface ShoppingListModalProps {
  list: ShoppingList | null;
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onClearList: () => void;
  onShowToast?: (message: string) => void;
  onShareClick?: () => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  list,
  onClose,
  onToggleItem,
  onRemoveItem,
  onClearList,
  onShareClick,
}) => {
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (list) {
      document.body.style.overflow = 'hidden';
      // Expand all recipes by default
      const recipeIds = new Set(list.items.map((item) => item.recipeId));
      setExpandedRecipes(recipeIds);
      track('shopping_list_opened', { itemsCount: list.items.length });
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [list]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!list || list.items.length === 0) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg max-w-md w-full p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Список покупок пуст</h2>
          <p className="text-gray-600 mb-6">
            Добавьте ингредиенты из рецептов, чтобы создать список покупок
          </p>
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  // Group items by recipe
  const itemsByRecipe = list.items.reduce((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = {
        recipeName: item.recipeName,
        items: [],
      };
    }
    acc[item.recipeId].items.push(item);
    return acc;
  }, {} as Record<string, { recipeName: string; items: ShoppingItem[] }>);

  const recipesCount = Object.keys(itemsByRecipe).length;
  const checkedCount = list.items.filter((item) => item.checked).length;
  const progress = list.items.length > 0 ? (checkedCount / list.items.length) * 100 : 0;

  const toggleRecipe = (recipeId: string) => {
    setExpandedRecipes((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-lg max-w-2xl w-full max-h-[80vh] md:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">🛒 Список покупок</h2>
            <p className="text-sm text-gray-600 mt-1">
              {list.items.length} товаров из {recipesCount} {recipesCount === 1 ? 'рецепта' : 'рецептов'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {Object.entries(itemsByRecipe).map(([recipeId, { recipeName, items }]) => {
            const isExpanded = expandedRecipes.has(recipeId);
            const recipeCheckedCount = items.filter((item) => item.checked).length;

            return (
              <div key={recipeId} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleRecipe(recipeId)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
                    <span className="font-semibold text-left">{recipeName}</span>
                    <span className="text-sm text-gray-500">
                      ({recipeCheckedCount}/{items.length})
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => onToggleItem(item.id)}
                          className="w-12 h-12 md:w-5 md:h-5 text-primary focus:ring-primary rounded cursor-pointer"
                        />
                        <label
                          className={`flex-1 cursor-pointer ${
                            item.checked ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                          onClick={() => onToggleItem(item.id)}
                        >
                          <span className="font-medium">{item.ingredientName}</span>
                          {item.amount && (
                            <span className="text-gray-500 ml-2">{item.amount}</span>
                          )}
                        </label>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
                          aria-label="Удалить"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Прогресс</span>
              <span>
                {checkedCount} / {list.items.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleShare}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>📤</span>
              <span>Поделиться списком</span>
            </button>
            <button
              onClick={onClearList}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>🗑</span>
              <span>Очистить список</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

