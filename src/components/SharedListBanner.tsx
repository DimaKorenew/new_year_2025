import React from 'react';

interface SharedListBannerProps {
  onSave: () => void;
  onDismiss?: () => void;
}

export const SharedListBanner: React.FC<SharedListBannerProps> = ({ onSave, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 md:p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl md:text-3xl flex-shrink-0">🎁</span>
          <p className="text-sm md:text-base font-medium">
            Вам поделились списком покупок для Нового года
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onSave}
            className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>💾</span>
            <span>Сохранить к себе</span>
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 transition-colors"
              aria-label="Закрыть"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};











