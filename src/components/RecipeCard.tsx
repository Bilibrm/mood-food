import React from 'react';
import { Heart, Clock, Users, ChevronRight } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeStore } from '../store';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
  saved?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, saved = false }) => {
  const { addRecipe, removeRecipe } = useRecipeStore();

  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {recipe.title}
          </h3>
          <button
            onClick={() => (saved ? removeRecipe(recipe.id) : addRecipe(recipe))}
            className={`flex-shrink-0 p-2 rounded-full transition-all ${
              saved
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-indigo-500" />
            {recipe.readyInMinutes}min
          </span>
          <span className="flex items-center gap-1 text-sm">
            <Users className="w-4 h-4 text-indigo-500" />
            {recipe.servings}
          </span>
        </div>

        <Link
          to={`/recipe/${recipe.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group-hover:gap-2"
        >
          View Recipe
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hover overlay for touch devices */}
      <div className="absolute inset-0 bg-black/0 pointer-events-none transition-colors group-hover:bg-black/5" />
    </div>
  );
};