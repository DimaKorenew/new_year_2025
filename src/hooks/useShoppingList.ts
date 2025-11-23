import { useState, useEffect, useCallback } from 'react';
import { ShoppingList, ShoppingItem, Recipe } from '../types';
import {
  createShoppingList,
  getShoppingList,
  updateShoppingList,
  saveToLocalStorage,
  loadFromLocalStorage,
} from '../services/shoppingListApi';
import { track } from '../utils/analytics';

export const useShoppingList = () => {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromLocalStorage();
    if (stored) {
      setList(stored);
    }
  }, []);

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
        updatedList = await updateShoppingList(list.id, updatedItems);
      }

      setList(updatedList);
      saveToLocalStorage(updatedList);
      track('ingredient_added', { recipeId: recipe.id, ingredientName: name });
    } catch (error) {
      console.error('Failed to add ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list]);

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
      } else {
        const updatedItems = [...list.items, ...newItems];
        updatedList = await updateShoppingList(list.id, updatedItems);
      }

      setList(updatedList);
      saveToLocalStorage(updatedList);
      track('recipe_ingredients_added', { recipeId: recipe.id, count: newItems.length });
    } catch (error) {
      console.error('Failed to add ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list]);

  // Toggle item checked state
  const toggleItem = useCallback(async (itemId: string) => {
    if (!list) return;

    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    setIsLoading(true);
    try {
      const updatedList = await updateShoppingList(list.id, updatedItems);
      setList(updatedList);
      saveToLocalStorage(updatedList);

      const item = updatedItems.find((i) => i.id === itemId);
      if (item) {
        track('item_checked', { recipeId: item.recipeId, ingredientName: item.ingredientName });
      }
    } catch (error) {
      console.error('Failed to toggle item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list]);

  // Remove item
  const removeItem = useCallback(async (itemId: string) => {
    if (!list) return;

    const updatedItems = list.items.filter((item) => item.id !== itemId);

    setIsLoading(true);
    try {
      const updatedList = await updateShoppingList(list.id, updatedItems);
      setList(updatedList);
      saveToLocalStorage(updatedList);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list]);

  // Clear all items
  const clearList = useCallback(async () => {
    if (!list) return;

    setIsLoading(true);
    try {
      const updatedList = await updateShoppingList(list.id, []);
      setList(updatedList);
      saveToLocalStorage(updatedList);
    } catch (error) {
      console.error('Failed to clear list:', error);
    } finally {
      setIsLoading(false);
    }
  }, [list]);

  // Load shared list
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
    addIngredient,
    addAllIngredients,
    toggleItem,
    removeItem,
    clearList,
    loadSharedList,
  };
};

