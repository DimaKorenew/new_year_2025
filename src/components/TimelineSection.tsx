import React, { useState, useRef, useEffect } from 'react';
import { TimelineStage } from '../types';

interface TimelineSectionProps {
  stages: TimelineStage[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ stages }) => {
  const [localStages, setLocalStages] = useState<TimelineStage[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('timeline-tasks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return stages;
        }
      }
    }
    return stages;
  });
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('timeline-tasks', JSON.stringify(localStages));
    }
  }, [localStages]);

  const toggleTask = (stageId: string, taskId: string) => {
    setLocalStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: stage.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : stage
      )
    );
  };

  return (
    <section
      id="timeline"
      ref={ref}
      className={`py-16 px-4 bg-white ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ⏰ ТАЙМЛАЙН ПОДГОТОВКИ К НОВОМУ ГОДУ
        </h2>
        
        <div className="space-y-8">
          {localStages.map((stage, index) => (
            <div key={stage.id} className="relative">
              {index < localStages.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-300" />
              )}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl">
                    {stage.emoji}
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    {stage.emoji} {stage.title}
                  </h3>
                  <ul className="space-y-3">
                    {stage.tasks.map((task) => (
                      <li key={task.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(stage.id, task.id)}
                          className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <span
                          className={`flex-1 ${
                            task.completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


