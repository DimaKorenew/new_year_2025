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

// Share endpoints
export interface ShareListResponse {
  shareId: string;
  url: string;
  expiresAt: number;
}

// Generate short share ID (6-8 characters)
const generateShareId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// POST /api/lists/share - Create shared list (frontend-only, no backend)
export const createSharedList = async (list: ShoppingList): Promise<ShareListResponse> => {
  // Generate unique share ID locally
  const shareId = generateShareId();
  
  // Encode list data to base64
  const listData = {
    items: list.items,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
  const jsonString = JSON.stringify(listData);
  const base64Data = btoa(encodeURIComponent(jsonString));
  
  // Create URL with encoded data
  const basePath = window.location.pathname.replace(/\/$/, '') || '';
  const url = `${window.location.origin}${basePath}/s/${shareId}?data=${base64Data}`;
  const expiresAt = Date.now() + 90 * 24 * 60 * 60 * 1000; // 90 days

  // Save to localStorage for owner
  saveSharedListToLocalStorage(shareId, list, true);

  return {
    shareId,
    url,
    expiresAt,
  };
};

// GET /api/lists/share/:shareId - Get shared list (frontend-only, from URL or localStorage)
export const getSharedList = async (shareId: string): Promise<ShoppingList | null> => {
  // First, try to get data from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');
  
  if (encodedData) {
    try {
      // Decode from base64
      const jsonString = decodeURIComponent(atob(encodedData));
      const listData = JSON.parse(jsonString);
      
      return {
        id: shareId,
        items: listData.items || [],
        createdAt: listData.createdAt || Date.now(),
        updatedAt: listData.updatedAt || Date.now(),
      };
    } catch (error) {
      console.error('Failed to decode list from URL:', error);
      // Fall through to localStorage
    }
  }
  
  // Fallback: try to load from localStorage
  const stored = loadSharedListFromLocalStorage(shareId);
  if (stored) {
    return stored;
  }
  
  return null;
};

// PATCH /api/lists/share/:shareId - Update shared list (frontend-only, localStorage)
export const updateSharedList = async (
  shareId: string,
  items: ShoppingItem[]
): Promise<ShoppingList> => {
  // Since we don't have backend, we update localStorage and update URL if needed
  const existing = loadSharedListFromLocalStorage(shareId);
  const updatedList: ShoppingList = {
    id: shareId,
    items,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
  
  // Save to localStorage
  saveSharedListToLocalStorage(shareId, updatedList, isListOwner(shareId));
  
  // Update URL if we're on the shared list page
  if (window.location.pathname.includes(`/s/${shareId}`)) {
    try {
      const listData = {
        items: updatedList.items,
        createdAt: updatedList.createdAt,
        updatedAt: updatedList.updatedAt,
      };
      const jsonString = JSON.stringify(listData);
      const base64Data = btoa(encodeURIComponent(jsonString));
      
      // Update URL without reload
      const newUrl = `${window.location.pathname}?data=${base64Data}`;
      window.history.replaceState({}, '', newUrl);
    } catch (error) {
      console.error('Failed to update URL:', error);
    }
  }
  
  return updatedList;
};

// LocalStorage helpers for shared lists
const SHARED_STORAGE_PREFIX = 'shared-list-';
const SHARED_OWNER_PREFIX = 'list-owner-';

export const saveSharedListToLocalStorage = (
  shareId: string,
  list: ShoppingList,
  isOwner: boolean
) => {
  try {
    localStorage.setItem(`${SHARED_STORAGE_PREFIX}${shareId}`, JSON.stringify(list));
    if (isOwner) {
      localStorage.setItem(`${SHARED_OWNER_PREFIX}${shareId}`, 'true');
    }
  } catch (error) {
    console.error('Failed to save shared list to localStorage:', error);
  }
};

export const loadSharedListFromLocalStorage = (shareId: string): ShoppingList | null => {
  try {
    const stored = localStorage.getItem(`${SHARED_STORAGE_PREFIX}${shareId}`);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load shared list from localStorage:', error);
    return null;
  }
};

export const isListOwner = (shareId: string): boolean => {
  try {
    return localStorage.getItem(`${SHARED_OWNER_PREFIX}${shareId}`) === 'true';
  } catch (error) {
    return false;
  }
};

export const saveSharedListLocally = (shareId: string, list: ShoppingList) => {
  saveSharedListToLocalStorage(shareId, list, false);
};

