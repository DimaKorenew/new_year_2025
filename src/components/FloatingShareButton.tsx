import React from 'react';

interface FloatingShareButtonProps {
  onClick: () => void;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ onClick }) => {

  return (
    <div className="fixed bottom-6 left-4 md:left-1/2 md:transform md:-translate-x-1/2 z-50">
      <button
        onClick={onClick}
        className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 flex items-center gap-2"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V9"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3V12"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 6L12 3L15 6"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Поделиться
      </button>
    </div>
  );
};

