import { useLoaderData } from 'react-router-dom'
import { Recipe as TypeRecipe } from '../../types/types'
import Recipe from '../Recipes/Recipe/Recipe'

const RecipesSelected = () => {
  const recipes = useLoaderData() as TypeRecipe[]

  return (
    <div>
      {recipes.map(recipe => (
        <Recipe recipe={recipe} />
      ))}
    </div>
  )
}

export default RecipesSelected
