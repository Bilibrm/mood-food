export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  instructions?: string;
  extendedIngredients?: {
    original: string;
    amount: number;
    unit: string;
  }[];
}

export interface UserPreferences {
  mood: string;
  ingredients: string[];
  dietary: string[];
}