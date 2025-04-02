import { create } from 'zustand';
import { Recipe, UserPreferences } from './types';

interface RecipeStore {
  savedRecipes: Recipe[];
  preferences: UserPreferences;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: number) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  savedRecipes: [],
  preferences: {
    mood: '',
    ingredients: [],
    dietary: [],
  },
  addRecipe: (recipe) =>
    set((state) => ({
      savedRecipes: [...state.savedRecipes, recipe],
    })),
  removeRecipe: (id) =>
    set((state) => ({
      savedRecipes: state.savedRecipes.filter((recipe) => recipe.id !== id),
    })),
  updatePreferences: (newPreferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    })),
}));