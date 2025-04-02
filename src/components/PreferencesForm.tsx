import React, { useState } from 'react';
import { Smile, Apple, UtensilsCrossed } from 'lucide-react';
import { useRecipeStore } from '../store';

const moods = ['Happy', 'Energetic', 'Cozy', 'Stressed', 'Relaxed'];
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto'];

export const PreferencesForm: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const { preferences, updatePreferences } = useRecipeStore();

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      updatePreferences({
        ingredients: [...preferences.ingredients, ingredient.trim()],
      });
      setIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    updatePreferences({
      ingredients: preferences.ingredients.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-lg font-medium mb-2">
          <Smile className="w-5 h-5" />
          How are you feeling today?
        </label>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => updatePreferences({ mood })}
              className={`px-4 py-2 rounded-full transition-colors ${
                preferences.mood === mood
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-lg font-medium mb-2">
          <Apple className="w-5 h-5" />
          Ingredients at home
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Add ingredient..."
          />
          <button
            onClick={handleAddIngredient}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {preferences.ingredients.map((ing, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
            >
              {ing}
              <button
                onClick={() => removeIngredient(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-lg font-medium mb-2">
          <UtensilsCrossed className="w-5 h-5" />
          Dietary Restrictions
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                updatePreferences({
                  dietary: preferences.dietary.includes(option)
                    ? preferences.dietary.filter((d) => d !== option)
                    : [...preferences.dietary, option],
                })
              }
              className={`px-4 py-2 rounded-full transition-colors ${
                preferences.dietary.includes(option)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};