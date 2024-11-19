import { Link } from 'react-router-dom'

const Recipe = ({ recipe, handleAddToSelected }) => {
  const handleAddToSelectedClick = () => {
    handleAddToSelected(recipe)
  }

  return (
    <div>
      <div>
        <Link to={`/recipes/${recipe.idMeal}`}>{recipe.strMeal}</Link>
      </div>
      <div>category: {recipe.strCategory}</div>
      <div>
        <button disabled={recipe.selected} onClick={handleAddToSelectedClick}>
          Add to Selected
        </button>
      </div>
    </div>
  )
}

export default Recipe
