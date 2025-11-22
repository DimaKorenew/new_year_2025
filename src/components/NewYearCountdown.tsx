import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const NewYearCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const newYearDate = new Date('2026-01-01T00:00:00');
      const now = new Date();
      const difference = newYearDate.getTime() - now.getTime();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const updateTimer = () => {
      const time = calculateTimeLeft();
      if (time) {
        setTimeLeft(time);
        setIsNewYear(false);
      } else {
        setIsNewYear(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isNewYear) {
    return (
      <div className="text-center mb-6">
        <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl shadow-2xl animate-pulse">
          <h2 className="text-2xl md:text-4xl font-bold">
            С Новым Годом! 🎉
          </h2>
        </div>
      </div>
    );
  }

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl px-3 md:px-4 py-2 md:py-3 min-w-[60px] md:min-w-[75px]">
        <div className="text-2xl md:text-4xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="mt-1.5 text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <div className="text-center mb-6 fade-in">
      <div className="inline-flex flex-col items-center gap-4">
        <p className="text-white/90 text-base md:text-lg lg:text-xl mb-2">
          До Нового Года осталось:
        </p>
        <div className="flex gap-1.5 md:gap-3 items-center">
          <TimeUnit value={timeLeft.days} label="Дней" />
          <span className="text-white text-xl md:text-3xl font-bold">:</span>
          <TimeUnit value={timeLeft.hours} label="Часов" />
          <span className="text-white text-xl md:text-3xl font-bold">:</span>
          <TimeUnit value={timeLeft.minutes} label="Минут" />
          <span className="text-white text-xl md:text-3xl font-bold">:</span>
          <TimeUnit value={timeLeft.seconds} label="Секунд" />
        </div>
      </div>
    </div>
  );
};

