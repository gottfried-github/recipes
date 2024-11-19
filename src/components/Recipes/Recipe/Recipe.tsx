import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import { Recipe as TypeRecipe } from '../../../types/types'

interface Props {
  recipe: TypeRecipe
  handleAddToSelected: (recipe: TypeRecipe) => void
}

const Recipe = ({ recipe, handleAddToSelected }: Props) => {
  // const handleAddToSelectedClick = () => {
  //   handleAddToSelected(recipe)
  // }

  return (
    <Card>
      <RecipeLink to={`/recipes/${recipe.idMeal}`}>
        <RecipeContent>
          <RecipeThumb src={recipe.strMealThumb} alt={recipe.strMeal} />
          <div>
            <Typography variant="h4">{recipe.strMeal}</Typography>
            <Typography variant="body1">category: {recipe.strCategory}</Typography>
            <Typography variant="body1">area: {recipe.strArea}</Typography>
            {/* <div>
            <button disabled={recipe.selected} onClick={handleAddToSelectedClick}>
              Add to Selected
            </button>
          </div> */}
          </div>
        </RecipeContent>
      </RecipeLink>
    </Card>
  )
}

export default Recipe

const RecipeLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const RecipeContent = styled(CardContent)`
  display: flex;
  column-gap: 16px;
`

const RecipeThumb = styled.img`
  width: 350px;
  height: 350px;
  object-fit: cover;
`
