import { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingList, ShoppingItem, Recipe } from '../types';
import {
  createShoppingList,
  getShoppingList,
  updateShoppingList,
  saveToLocalStorage,
  loadFromLocalStorage,
  createSharedList,
  getSharedList,
  updateSharedList,
  saveSharedListToLocalStorage,
  loadSharedListFromLocalStorage,
  isListOwner,
  saveSharedListLocally,
} from '../services/shoppingListApi';
import { track } from '../utils/analytics';

export const useShoppingList = (shareId?: string | null) => {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shareIdState, setShareIdState] = useState<string | null>(shareId || null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number>(0);
  
  const syncTimeoutRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const pendingUpdateRef = useRef<ShoppingItem[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (shareId) {
      // Loading shared list
      loadSharedListFromUrl(shareId);
    } else {
      const stored = loadFromLocalStorage();
      if (stored) {
        setList(stored);
      }
    }
  }, [shareId]);

  // Load shared list from URL
  const loadSharedListFromUrl = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const sharedList = await getSharedList(id);
      if (sharedList) {
        setList(sharedList);
        setShareIdState(id);
        setIsShared(true);
        setIsOwner(isListOwner(id));
        saveSharedListLocally(id, sharedList);
        setLastSyncTimestamp(sharedList.updatedAt);
        track('shared_list_opened', { shareId: id });
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'EXPIRED') {
        throw new Error('EXPIRED');
      }
      console.error('Failed to load shared list:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced sync for shared lists
  const debouncedSync = useCallback((items: ShoppingItem[]) => {
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }
    
    pendingUpdateRef.current = items;
    
    syncTimeoutRef.current = window.setTimeout(async () => {
      if (shareIdState && pendingUpdateRef.current) {
        try {
          const updatedList = await updateSharedList(shareIdState, pendingUpdateRef.current);
          setList(updatedList);
          setLastSyncTimestamp(updatedList.updatedAt);
          saveSharedListToLocalStorage(shareIdState, updatedList, isOwner);
          pendingUpdateRef.current = null;
        } catch (error) {
          console.error('Failed to sync shared list:', error);
        }
      }
    }, 1000); // 1 second debounce
  }, [shareIdState, isOwner]);

  // Parse ingredient string to extract name and amount
  const parseIngredient = (ingredient: string): { name: string; amount: string } => {
    const trimmed = ingredient.trim();
    
    // Try format: "Name - Amount" (e.g., "Крабовое мясо - 200г")
    const dashMatch = trimmed.match(/^(.+?)\s*-\s*(.+)$/);
    if (dashMatch) {
      return {
        name: dashMatch[1].trim(),
        amount: dashMatch[2].trim(),
      };
    }
    
    // Try to split by common patterns
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      // Assume format: "amount name" or "name amount"
      const lastPart = parts[parts.length - 1];
      // If last part looks like a unit (г, мл, шт, ч.л., ст.л., etc.)
      if (/^(г|кг|мл|л|шт|ч\.л\.|ст\.л\.|стакан|по вкусу)$/i.test(lastPart)) {
        const amount = parts.slice(0, -1).join(' ') + ' ' + lastPart;
        const name = parts.slice(0, -2).join(' ') || parts[0];
        return { name, amount };
      }
      // Otherwise, assume first part is amount
      const amount = parts[0];
      const name = parts.slice(1).join(' ');
      return { name, amount };
    }
    return { name: trimmed, amount: '' };
  };

  // Add single ingredient
  const addIngredient = useCallback(async (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>, ingredient: string) => {
    if (!recipe.ingredients?.includes(ingredient)) {
      return;
    }

    const { name, amount } = parseIngredient(ingredient);
    const newItem: ShoppingItem = {
      id: `${recipe.id}-${ingredient}-${Date.now()}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredientName: name,
      amount,
      checked: false,
    };

    setIsLoading(true);
    try {
      let updatedList: ShoppingList;

      if (!list) {
        // Create new list
        updatedList = await createShoppingList([newItem]);
      } else {
        // Add to existing list
        const updatedItems = [...list.items, newItem];
        
        // Update UI immediately
        updatedList = {
          ...list,
          items: updatedItems,
          updatedAt: Date.now(),
        };
        setList(updatedList);

        // Save locally
        if (isShared && shareIdState) {
          saveSharedListToLocalStorage(shareIdState, updatedList, isOwner);
          debouncedSync(updatedItems);
        } else {
          saveToLocalStorage(updatedList);
        }

        // Sync to server
        if (isShared && shareIdState) {
          await updateSharedList(shareIdState, updatedItems);
        } else {
          await updateShoppingList(list.id, updatedItems);
        }
      }

      track('ingredient_added', { recipeId: recipe.id, ingredientName: name });
    } catch (error) {
      console.error('Failed to add ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list, isShared, shareIdState, isOwner, debouncedSync]);

  // Add all ingredients from recipe
  const addAllIngredients = useCallback(async (recipe: Pick<Recipe, 'id' | 'name' | 'ingredients'>) => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const newItems: ShoppingItem[] = recipe.ingredients.map((ingredient) => {
        const { name, amount } = parseIngredient(ingredient);
        return {
          id: `${recipe.id}-${ingredient}-${Date.now()}-${Math.random()}`,
          recipeId: recipe.id,
          recipeName: recipe.name,
          ingredientName: name,
          amount,
          checked: false,
        };
      });

      let updatedList: ShoppingList;

      if (!list) {
        updatedList = await createShoppingList(newItems);
        setList(updatedList);
        saveToLocalStorage(updatedList);
      } else {
        const updatedItems = [...list.items, ...newItems];
        
        // Update UI immediately
        updatedList = {
          ...list,
          items: updatedItems,
          updatedAt: Date.now(),
        };
        setList(updatedList);

        // Save locally
        if (isShared && shareIdState) {
          saveSharedListToLocalStorage(shareIdState, updatedList, isOwner);
          debouncedSync(updatedItems);
        } else {
          saveToLocalStorage(updatedList);
        }

        // Sync to server
        if (isShared && shareIdState) {
          await updateSharedList(shareIdState, updatedItems);
        } else {
          await updateShoppingList(list.id, updatedItems);
        }
      }

      track('recipe_ingredients_added', { recipeId: recipe.id, count: newItems.length });
    } catch (error) {
      console.error('Failed to add ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list, isShared, shareIdState, isOwner, debouncedSync]);

  // Toggle item checked state
  const toggleItem = useCallback(async (itemId: string) => {
    if (!list) return;

    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    // Update UI immediately
    const updatedList: ShoppingList = {
      ...list,
      items: updatedItems,
      updatedAt: Date.now(),
    };
    setList(updatedList);

    // Save locally
    if (isShared && shareIdState) {
      saveSharedListToLocalStorage(shareIdState, updatedList, isOwner);
      debouncedSync(updatedItems);
    } else {
      saveToLocalStorage(updatedList);
    }

    setIsLoading(true);
    try {
      if (isShared && shareIdState) {
        await updateSharedList(shareIdState, updatedItems);
      } else {
        await updateShoppingList(list.id, updatedItems);
      }

      const item = updatedItems.find((i) => i.id === itemId);
      if (item) {
        track('item_checked', { recipeId: item.recipeId, ingredientName: item.ingredientName });
      }
    } catch (error) {
      console.error('Failed to toggle item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list, isShared, shareIdState, isOwner, debouncedSync]);

  // Remove item
  const removeItem = useCallback(async (itemId: string) => {
    if (!list) return;

    const updatedItems = list.items.filter((item) => item.id !== itemId);

    // Update UI immediately
    const updatedList: ShoppingList = {
      ...list,
      items: updatedItems,
      updatedAt: Date.now(),
    };
    setList(updatedList);

    // Save locally
    if (isShared && shareIdState) {
      saveSharedListToLocalStorage(shareIdState, updatedList, isOwner);
      debouncedSync(updatedItems);
    } else {
      saveToLocalStorage(updatedList);
    }

    setIsLoading(true);
    try {
      if (isShared && shareIdState) {
        await updateSharedList(shareIdState, updatedItems);
      } else {
        await updateShoppingList(list.id, updatedItems);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list, isShared, shareIdState, isOwner, debouncedSync]);

  // Clear all items
  const clearList = useCallback(async () => {
    if (!list) return;

    const updatedItems: ShoppingItem[] = [];
    
    // Update UI immediately
    const updatedList: ShoppingList = {
      ...list,
      items: updatedItems,
      updatedAt: Date.now(),
    };
    setList(updatedList);

    // Save locally
    if (isShared && shareIdState) {
      saveSharedListToLocalStorage(shareIdState, updatedList, isOwner);
      debouncedSync(updatedItems);
    } else {
      saveToLocalStorage(updatedList);
    }

    setIsLoading(true);
    try {
      if (isShared && shareIdState) {
        await updateSharedList(shareIdState, updatedItems);
      } else {
        await updateShoppingList(list.id, updatedItems);
      }
    } catch (error) {
      console.error('Failed to clear list:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list, isShared, shareIdState, isOwner, debouncedSync]);

  // Load shared list (legacy, for old ?list= parameter)
  const loadSharedList = useCallback(async (listId: string) => {
    setIsLoading(true);
    try {
      const sharedList = await getShoppingList(listId);
      if (sharedList) {
        setList(sharedList);
        saveToLocalStorage(sharedList);
        track('shared_list_opened', { listId });
      }
    } catch (error) {
      console.error('Failed to load shared list:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create share link
  const createShareLink = useCallback(async (): Promise<string> => {
    if (!list || list.items.length === 0) {
      throw new Error('List is empty');
    }

    setIsLoading(true);
    try {
      const shareResponse = await createSharedList(list);
      setShareIdState(shareResponse.shareId);
      setShareUrl(shareResponse.url);
      setIsShared(true);
      setIsOwner(true);
      
      // Save owner flag
      saveSharedListToLocalStorage(shareResponse.shareId, list, true);
      
      track('list_shared', { shareId: shareResponse.shareId, itemsCount: list.items.length });
      return shareResponse.url;
    } catch (error) {
      console.error('Failed to create share link:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [list]);

  // Polling for shared lists (every 5 seconds) - checks localStorage and URL
  // Note: Without backend, real-time sync between devices is not possible
  // This polling only works for same-browser updates
  useEffect(() => {
    if (!isShared || !shareIdState) {
      return;
    }

    const poll = async () => {
      try {
        // Check URL parameter first (for cross-device sharing)
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (encodedData) {
          try {
            const jsonString = decodeURIComponent(atob(encodedData));
            const listData = JSON.parse(jsonString);
            
            if (listData.updatedAt > lastSyncTimestamp) {
              const serverList: ShoppingList = {
                id: shareIdState,
                items: listData.items || [],
                createdAt: listData.createdAt || Date.now(),
                updatedAt: listData.updatedAt || Date.now(),
              };
              
              const itemsAdded = serverList.items.length - (list?.items.length || 0);
              setList(serverList);
              setLastSyncTimestamp(serverList.updatedAt);
              saveSharedListToLocalStorage(shareIdState, serverList, isOwner);
              
              if (itemsAdded > 0) {
                return { updated: true, itemsAdded };
              }
            }
          } catch (error) {
            // URL data invalid, fall through to localStorage
          }
        }
        
        // Check localStorage for updates
        const stored = loadSharedListFromLocalStorage(shareIdState);
        if (stored && stored.updatedAt > lastSyncTimestamp) {
          const itemsAdded = stored.items.length - (list?.items.length || 0);
          setList(stored);
          setLastSyncTimestamp(stored.updatedAt);
          
          if (itemsAdded > 0) {
            return { updated: true, itemsAdded };
          }
        }
      } catch (error) {
        console.error('Failed to poll shared list:', error);
      }
      return { updated: false };
    };

    pollIntervalRef.current = window.setInterval(poll, 5000);

    return () => {
      if (pollIntervalRef.current) {
        window.clearInterval(pollIntervalRef.current);
      }
    };
  }, [isShared, shareIdState, lastSyncTimestamp, list, isOwner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Get unique recipes count
  const getRecipesCount = useCallback(() => {
    if (!list || list.items.length === 0) return 0;
    const uniqueRecipes = new Set(list.items.map((item) => item.recipeId));
    return uniqueRecipes.size;
  }, [list]);

  // Get checked items count
  const getCheckedCount = useCallback(() => {
    if (!list) return 0;
    return list.items.filter((item) => item.checked).length;
  }, [list]);

  return {
    list,
    isLoading,
    itemsCount: list?.items.length || 0,
    recipesCount: getRecipesCount(),
    checkedCount: getCheckedCount(),
    shareId: shareIdState,
    shareUrl,
    isShared,
    isOwner,
    addIngredient,
    addAllIngredients,
    toggleItem,
    removeItem,
    clearList,
    loadSharedList,
    createShareLink,
    loadSharedListFromUrl,
  };
};

