import { LoaderFunctionArgs } from 'react-router-dom'
import { RecipesData, CategoriesData, Recipe as TypeRecipe } from './types/types'
import { queryClient } from './queryClient'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const queryAllRecipes = () => {
  return {
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

              resolve(data.meals || [])
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

      const resCategories = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      const dataCategories: CategoriesData = await resCategories.json()

      return { recipes, categories: dataCategories.categories }
    },
  }
}

const querySearchRecipes = (searchValue: string) => {
  console.log('querySearchRecipes')
  return {
    queryKey: ['recipes'],
    queryFn: async () => {
      console.log('querySearchRecipes, queryFn')
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
      const data: RecipesData = await res.json()

      const resCategories = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      const dataCategories: CategoriesData = await resCategories.json()

      return {
        recipes: data.meals.map(recipe => ({ ...recipe, selected: false })) || [],
        categories: dataCategories.categories,
      }
    },
  }
}

const queryRecipe = (id: string) => ({
  queryKey: ['recipe', id],
  queryFn: async () => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await res.json()

    return data.meals?.[0] || null
  },
})

export const loaderRecipes = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchValue = url.searchParams.get('s')

  console.log('loaderRecipes, searchValue:', searchValue)

  // if (searchValue) queryClient.invalidateQueries()
  const query = searchValue ? querySearchRecipes(searchValue as string) : queryAllRecipes()

  // return queryClient.ensureQueryData({ ...query, revalidateIfStale: true })
  return queryClient.fetchQuery(query)
}

export const loaderSelectedRecipes = async () => {
  const query = queryAllRecipes()

  return (
    (queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))) as TypeRecipe[]
  ).filter(recipe => recipe.selected)
}

export const loaderRecipe = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) return null

  const query = queryRecipe(params.id)

  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
}
