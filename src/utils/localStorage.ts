const STORAGE_KEY = 'new-year-timeline-tasks';

export interface StoredTasks {
  [taskId: string]: boolean;
}

export const saveTasksToStorage = (tasks: StoredTasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

export const loadTasksFromStorage = (): StoredTasks => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return {};
  }
};

