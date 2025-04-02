import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Search, BookmarkCheck, UtensilsCrossed } from 'lucide-react';
import { PreferencesForm } from './components/PreferencesForm';
import { RecipeCard } from './components/RecipeCard';
import { useRecipeStore } from './store';
import { Recipe } from './types';

// Lazy load the RecipeDetails component
const RecipeDetails = lazy(() => import('./components/RecipeDetails'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}

function Home() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [showSaved, setShowSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { preferences, savedRecipes } = useRecipeStore();

  const searchRecipes = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
        number: '6',
        addRecipeInformation: 'true',
      });

      if (preferences.ingredients.length > 0) {
        params.append('includeIngredients', preferences.ingredients.join(','));
      }

      if (preferences.dietary.length > 0) {
        params.append('diet', preferences.dietary.join(','));
      }

      if (preferences.mood) {
        switch (preferences.mood.toLowerCase()) {
          case 'happy':
            params.append('cuisine', 'mediterranean');
            break;
          case 'energetic':
            params.append('type', 'main course');
            break;
          case 'cozy':
            params.append('type', 'soup');
            break;
          case 'stressed':
            params.append('type', 'snack');
            break;
          case 'relaxed':
            params.append('cuisine', 'italian');
            break;
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/recipes/complexSearch?${params.toString()}`
      );
      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Mood Food
            </h1>
          </div>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
              showSaved
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            <BookmarkCheck className="w-5 h-5" />
            Saved Recipes
          </button>
        </div>

        {!showSaved && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all hover:shadow-xl">
              <PreferencesForm />
              <button
                onClick={searchRecipes}
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Recipes
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  saved={savedRecipes.some((r) => r.id === recipe.id)}
                />
              ))}
            </div>
          </>
        )}

        {showSaved && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Your Saved Recipes</h2>
              <p className="text-gray-600 mt-2">
                {savedRecipes.length === 0
                  ? "You haven't saved any recipes yet"
                  : `You have ${savedRecipes.length} saved recipe${
                      savedRecipes.length === 1 ? '' : 's'
                    }`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} saved={true} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;