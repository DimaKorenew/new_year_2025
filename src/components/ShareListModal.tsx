import React, { useState, useEffect } from 'react';
import { ShoppingList } from '../types';

interface ShareListModalProps {
  list: ShoppingList | null;
  shareId: string | null;
  shareUrl: string | null;
  onClose: () => void;
  onCopyUrl: () => void;
  onShare: () => void;
  onGenerateShare: () => Promise<void>;
  onShowToast?: (message: string) => void;
}

export const ShareListModal: React.FC<ShareListModalProps> = ({
  list,
  shareId,
  shareUrl,
  onClose,
  onCopyUrl,
  onShare,
  onGenerateShare,
  onShowToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(shareUrl || '');

  useEffect(() => {
    if (shareUrl) {
      setDisplayUrl(shareUrl);
    }
  }, [shareUrl]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleGenerate = async () => {
    if (shareId) {
      // Already shared, just copy
      onCopyUrl();
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateShare();
      if (onShowToast) {
        onShowToast('✓ Ссылка создана!');
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
      if (onShowToast) {
        onShowToast('❌ Не удалось создать ссылку');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    onCopyUrl();
    if (onShowToast) {
      onShowToast('✓ Ссылка скопирована в буфер обмена');
    }
  };

  const handleWhatsAppShare = () => {
    if (shareUrl) {
      const text = encodeURIComponent('Мой список продуктов на Новый год 🎄');
      window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(shareUrl)}`, '_blank');
    }
  };

  const handleTelegramShare = () => {
    if (shareUrl) {
      const text = encodeURIComponent('Мой список продуктов на Новый год 🎄');
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
    }
  };

  if (!list || list.items.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🎁 Поделиться списком</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Все, у кого есть ссылка, смогут видеть и редактировать список
        </p>

        {!shareId ? (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Создание ссылки...</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>Создать ссылку для шаринга</span>
              </>
            )}
          </button>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ссылка для шаринга:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={displayUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleCopy}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <span>📋</span>
                  <span className="hidden sm:inline">Копировать</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onShare}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>📱</span>
                <span>Поделиться</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
                <button
                  onClick={handleTelegramShare}
                  className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>✈️</span>
                  <span className="hidden sm:inline">Telegram</span>
                </button>
              </div>
            </div>
          </>
        )}

        <p className="text-sm text-gray-500 mt-6 flex items-center gap-2">
          <span>💡</span>
          <span>Список обновляется автоматически для всех участников</span>
        </p>
      </div>
    </div>
  );
};























