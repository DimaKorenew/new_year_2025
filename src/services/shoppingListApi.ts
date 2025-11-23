import { ShoppingList, ShoppingItem } from '../types';

const API_BASE_URL = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || '/api';

// Create a new shopping list
export const createShoppingList = async (items: ShoppingItem[]): Promise<ShoppingList> => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Failed to create shopping list');
    }

    return await response.json();
  } catch (error) {
    // Fallback: return mock data if API is not available
    console.warn('API not available, using mock data:', error);
    return {
      id: `mock-${Date.now()}`,
      items,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
};

// Get shopping list by ID
export const getShoppingList = async (id: string): Promise<ShoppingList | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to get shopping list');
    }

    return await response.json();
  } catch (error) {
    console.warn('API not available:', error);
    return null;
  }
};

// Update shopping list
export const updateShoppingList = async (id: string, items: ShoppingItem[]): Promise<ShoppingList> => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Failed to update shopping list');
    }

    return await response.json();
  } catch (error) {
    // Fallback: return updated mock data
    console.warn('API not available, using mock data:', error);
    const existing = loadFromLocalStorage();
    return {
      id: existing?.id || id,
      items,
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
  }
};

// LocalStorage helpers
const STORAGE_KEY = 'shopping-list';
const STORAGE_ID_KEY = 'shopping-list-id';

export const saveToLocalStorage = (list: ShoppingList) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.items));
    localStorage.setItem(STORAGE_ID_KEY, list.id);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): ShoppingList | null => {
  try {
    const itemsJson = localStorage.getItem(STORAGE_KEY);
    const id = localStorage.getItem(STORAGE_ID_KEY);
    
    if (!itemsJson || !id) {
      return null;
    }

    const items = JSON.parse(itemsJson);
    return {
      id,
      items,
      createdAt: Date.now(), // We don't store this in localStorage
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// Clear localStorage (exported for potential future use)
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_ID_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

