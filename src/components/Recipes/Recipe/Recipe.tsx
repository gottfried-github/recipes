import { Link } from 'react-router-dom'

const Recipe = ({ recipe, handleAddToSelected }) => {
  const handleAddToSelectedClick = () => {
    handleAddToSelected(recipe)
  }

  return (
    <div>
      <Link to={`/recipes/${recipe.idMeal}`}>{recipe.strMeal}</Link>
      <button disabled={recipe.selected} onClick={handleAddToSelectedClick}>
        Add to Selected
      </button>
    </div>
  )
}

export default Recipe
