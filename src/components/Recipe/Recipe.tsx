import { useLoaderData } from 'react-router-dom'
import { Recipe as TypeRecipe } from '../../types/types'

const Recipe = () => {
  const recipe = useLoaderData() as TypeRecipe

  return <div>{recipe.strInstructions}</div>
}

export default Recipe
