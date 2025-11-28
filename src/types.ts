export type RecipeCategory = 'hot' | 'salad' | 'dessert' | 'drink' | 'snack';

export type SaladFilter = 'all' | 'classic' | 'modern' | 'light' | 'hearty';

export type DrinkCategory = 'alcoholic' | 'non-alcoholic' | 'hot';

export interface RecipeStep {
  stepNumber: number;
  image: string;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: RecipeCategory;
  time: string;
  image: string;
  saladFilter?: SaladFilter;
  drinkCategory?: DrinkCategory;
  description?: string;
  rating?: number;
  ingredients?: string[];
  steps?: RecipeStep[];
  url?: string;
  servings?: number;
  nutrition?: {
    proteins: number; // in grams
    fats: number; // in grams
    carbs: number; // in grams
    calories: number; // in kcal
  };
}

export interface Article {
  id: string;
  title: string;
  emoji: string;
  description: string;
  image: string;
  readTime: string;
}

export interface TimelineTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TimelineStage {
  id: string;
  title: string;
  emoji: string;
  tasks: TimelineTask[];
}

export interface ShoppingItem {
  id: string;
  recipeId: string;
  recipeName: string;
  ingredientName: string;
  amount: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
}


