import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLoaderData, useSubmit, Link } from 'react-router-dom'
import { Recipe as TypeRecipe } from '../../types/types'
import Recipe from './Recipe/Recipe'

const Recipes = () => {
  const queryClient = useQueryClient()
  const submit = useSubmit()

  // const [currentCategory, setCurrentCategory] = useState<null | string>(null)

  const recipes = useLoaderData() as TypeRecipe[]

  console.log('Recipes - recipes: ', recipes)

  // const recipesByCategory = useMemo(() => {
  //   // filter by category
  // }, [recipes, currentCategory])

  // const pages = useMemo(() => {
  //   // paginate recipes
  // }, [recipesByCategory])

  const handleSelectRecipe = (recipe: TypeRecipe) => {
    queryClient.setQueryData(['recipes'], (recipes: TypeRecipe[]) => {
      return recipes.map(_recipe => {
        if (_recipe.idMeal !== recipe.idMeal) return _recipe

        return { ..._recipe, selected: true }
      })
    })

    submit('')
  }

  return (
    <div>
      <div>
        {recipes.map(recipe => (
          <Recipe key={recipe.idMeal} recipe={recipe} handleAddToSelected={handleSelectRecipe} />
        ))}
      </div>
      <Link to="/selected">Selected Recipes</Link>
    </div>
  )
}

export default Recipes
