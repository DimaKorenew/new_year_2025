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
  saladFilter?: SaladFilter;
  drinkCategory?: DrinkCategory;
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


