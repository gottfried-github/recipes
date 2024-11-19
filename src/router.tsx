import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { loaderRecipes } from './loaders' //, loaderSelectedRecipes, loaderRecipe
import Recipes from './components/Recipes/Recipes'
// import RecipesSelected from './components/RecipesSelected/RecipesSelected'
// import Recipe from './components/Recipe/Recipe'

const routes = [
  {
    path: '/',
    loader: loaderRecipes,
    element: <Recipes />,
  },
  // {
  //   path: '/selected',
  //   loader: loaderSelectedRecipes,
  //   element: <RecipesSelected />,
  // },
  // {
  //   path: '/recipes/:id',
  //   loader: loaderRecipe,
  //   element: <Recipe />,
  // },
]

const router = createBrowserRouter(routes)

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
