import { createBrowserRouter, LoaderFunctionArgs, RouterProvider } from 'react-router-dom'
import { RecipesData, Recipe as TypeRecipe } from './types/types'
import { queryClient } from './queryClient'
import Recipes from './components/Recipes/Recipes'
import RecipesSelected from './components/RecipesSelected/RecipesSelected'
import Recipe from './components/Recipe/Recipe'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const queryRecipes = () => ({
  queryKey: ['recipes'],
  queryFn: async () => {
    const recipesByLetterPromises = []

    for (const letter of ALPHABET) {
      recipesByLetterPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
            )
            const data: RecipesData = await res.json()

            resolve(data.meals)
          } catch (e) {
            reject(e)
          }
        })
      )
    }

    const recipesByLetterResults = (await Promise.all(recipesByLetterPromises)) as TypeRecipe[][]

    const recipes = recipesByLetterResults
      .reduce((recipes, recipesByLetter) => {
        return recipesByLetter ? [...recipes, ...recipesByLetter] : recipes
      }, [])
      .map(recipe => ({ ...recipe, selected: false }))

    return recipes
  },
})

const queryRecipe = (id: string) => ({
  queryKey: ['recipe', id],
  queryFn: async () => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await res.json()

    return data.meals?.[0] || null
  },
})

const routes = [
  {
    path: '/',
    loader: async () => {
      const query = queryRecipes()

      // return data or fetch it (https://tkdodo.eu/blog/react-query-meets-react-router#querifying-the-example)
      return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
    },
    element: <Recipes />,
  },
  {
    path: '/selected',
    loader: async () => {
      const query = queryRecipes()

      return (
        (queryClient.getQueryData(query.queryKey) ??
          (await queryClient.fetchQuery(query))) as TypeRecipe[]
      ).filter(recipe => recipe.selected)
    },
    element: <RecipesSelected />,
  },
  {
    path: '/recipes/:id',
    loader: async ({ params }: LoaderFunctionArgs) => {
      if (!params.id) return null

      const query = queryRecipe(params.id)

      return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
    },
    element: <Recipe />,
  },
]

const router = createBrowserRouter(routes)

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
