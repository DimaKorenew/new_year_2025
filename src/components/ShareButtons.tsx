import React, { useEffect } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  onClose: () => void;
  onCopySuccess?: () => void;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
  imageUrl = '',
  onClose,
  onCopySuccess,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const shareToVK = () => {
    const shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}${imageUrl ? `&image=${encodeURIComponent(imageUrl)}` : ''}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToPinterest = () => {
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description || title)}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToTelegram = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareToOK = () => {
    const shareUrl = `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${encodeURIComponent(url)}&st.title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      if (onCopySuccess) {
        onCopySuccess();
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const socialButtons = [
    {
      name: 'VK',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.785 16.241s.287-.027.435-.164c.135-.125.131-.358.131-.358s-.02-2.52 1.12-2.893c1.14-.38 2.61 2.54 4.16 3.662.595.436 1.045.34 1.045.34l4.15-.052s2.17-.126 1.14-1.85c-.085-.14-.605-1.26-3.11-3.57-2.63-2.44-2.28-2.04.85-6.26.585-.785 1.31-1.64.585-1.9l-3.84-.18s-.28-.02-.49.09c-.21.11-.34.36-.34.36s-.61 1.62-1.42 3c-1.71 2.99-2.4 3.15-2.68 2.97-.64-.4-.48-1.61-.48-2.47 0-2.69.41-3.81-.8-4.1-.4-.1-.69-.17-1.71-.18-1.31-.02-2.42 0-3.05.32-.42.21-.74.68-.55.7.24.03.78.15 1.07.54.38.5.37 1.62.37 1.62s.22 3.25-.52 3.65c-.51.28-1.21-.29-2.72-3.05-.77-1.35-1.35-2.84-1.35-2.84s-.11-.28-.31-.43c-.24-.18-.58-.24-.58-.24l-3.66.02s-.55.02-.75.25c-.18.21-.01.65-.01.65s2.73 6.38 5.82 9.61c2.83 2.98 6.06 2.78 6.06 2.78h1.48z"/>
        </svg>
      ),
      onClick: shareToVK,
    },
    {
      name: 'OK',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" fontFamily="Arial, sans-serif">OK</text>
        </svg>
      ),
      onClick: shareToOK,
    },
    {
      name: 'Telegram',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.37.74-.56 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      onClick: shareToTelegram,
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      onClick: shareToWhatsApp,
    },
    {
      name: 'Pinterest',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.01 8.97 7.26 10.63-.1-.94-.19-2.39.04-3.43.21-.91 1.38-5.75 1.38-5.75s-.35-.7-.35-1.74c0-1.63.95-2.85 2.13-2.85 1 0 1.49.75 1.49 1.65 0 1.01-.64 2.51-.97 3.9-.28 1.18.59 2.15 1.75 2.15 2.1 0 3.71-2.21 3.71-5.41 0-2.83-2.04-4.81-4.95-4.81-3.37 0-5.35 2.53-5.35 5.14 0 1.01.39 2.1.88 2.69.1.12.11.22.08.34-.08.33-.26 1.04-.3 1.19-.05.2-.16.24-.37.15-1.4-.65-2.27-2.69-2.27-4.33 0-3.53 2.57-6.77 7.41-6.77 3.89 0 6.92 2.83 6.92 5.59 0 3.86-2.44 6.96-5.83 6.96-1.14 0-2.21-.59-2.58-1.69l-.7 2.67c-.25.98-.93 2.2-1.38 2.95 1.04.32 2.14.49 3.29.49 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      ),
      onClick: shareToPinterest,
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Закрыть"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h2 className="text-3xl font-serif font-bold mb-6 text-center text-black">Поделиться</h2>
          
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            {socialButtons.map((button) => (
              <button
                key={button.name}
                onClick={button.onClick}
                className="w-14 h-14 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-black hover:bg-gray-50 transition-colors"
                aria-label={`Поделиться в ${button.name}`}
              >
                {button.icon}
              </button>
            ))}
          </div>
          
          <button
            onClick={copyLink}
            className="w-full py-3 px-4 rounded-lg border border-black bg-white text-black font-medium hover:bg-gray-50 transition-colors"
          >
            Копировать ссылку
          </button>
        </div>
      </div>
    </div>
  );
};

