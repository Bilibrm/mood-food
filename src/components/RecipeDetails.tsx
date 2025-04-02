import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, Users, ChefHat, Utensils } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeStore } from '../store';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { savedRecipes, addRecipe, removeRecipe } = useRecipeStore();
  const isSaved = savedRecipes.some((r) => r.id === Number(id));

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/recipes/${id}/information?apiKey=${
            import.meta.env.VITE_SPOONACULAR_API_KEY
          }`
        );
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Recipes
          </Link>
          <button
            onClick={() => (isSaved ? removeRecipe(recipe.id) : addRecipe(recipe))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
              isSaved
                ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save Recipe'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <h1 className="absolute bottom-0 left-0 right-0 text-3xl font-bold text-white p-6">
              {recipe.title}
            </h1>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{recipe.readyInMinutes} minutes</span>
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{recipe.servings} servings</span>
              </span>
            </div>

            <div className="prose max-w-none">
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <ChefHat className="w-6 h-6 text-indigo-600" />
                  Ingredients
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-gray-700"
                    >
                      <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      {ingredient.original}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <Utensils className="w-6 h-6 text-indigo-600" />
                  Instructions
                </h2>
                <div
                  className="text-gray-700 space-y-4"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions || '' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;