export type RecipeCategory = 'hot' | 'salad' | 'dessert' | 'drink' | 'snack';

export type SaladFilter = 'all' | 'classic' | 'modern' | 'light' | 'hearty';

export type DrinkCategory = 'alcoholic' | 'non-alcoholic' | 'hot';

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: RecipeCategory;
  time: string;
  image: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  emoji: string;
  description: string;
  readTime: string;
  image: string;
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
  date: string;
  tasks: TimelineTask[];
}

export interface DrinkRecipe extends Recipe {
  drinkCategory: DrinkCategory;
}

