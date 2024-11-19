import { useState, useMemo, ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLoaderData, useSubmit, Link } from 'react-router-dom'
import styled from '@emotion/styled'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { Recipe as TypeRecipe, Category } from '../../types/types'
import Recipe from './Recipe/Recipe'

/*
export default function RadioButtonsGroup() {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
  )
}
*/

const Recipes = () => {
  const queryClient = useQueryClient()
  const submit = useSubmit()

  const [currentCategory, setCurrentCategory] = useState<string>('')

  const { recipes, categories } = useLoaderData() as {
    recipes: TypeRecipe[]
    categories: Category[]
  }

  const recipesByCategory = useMemo(() => {
    if (currentCategory === '') return recipes

    return recipes.filter(recipe => recipe.strCategory === currentCategory)
  }, [recipes, currentCategory])

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

  const handleCategoryChange = (ev: ChangeEvent, v: string) => {
    setCurrentCategory(v)
  }

  return (
    <PageContainer>
      <CategoriesContainer>
        <CategoriesFormControl>
          <FormLabel id="demo-radio-buttons-group-label">Categories</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue=""
            name="radio-buttons-group"
            onChange={handleCategoryChange}
          >
            <FormControlLabel value="" control={<Radio />} label="All Categories" />
            {categories.map(category => (
              <FormControlLabel
                key={category.idCategory}
                value={category.strCategory}
                control={<Radio />}
                label={category.strCategory}
              />
            ))}
          </RadioGroup>
        </CategoriesFormControl>
      </CategoriesContainer>
      <RecipesContainer>
        <div>
          {recipesByCategory.map(recipe => (
            <Recipe key={recipe.idMeal} recipe={recipe} handleAddToSelected={handleSelectRecipe} />
          ))}
        </div>
        <Link to="/selected">Selected Recipes</Link>
      </RecipesContainer>
    </PageContainer>
  )
}

export default Recipes

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 450px 1fr;
`

const RecipesContainer = styled.div`
  grid-column: 2;
`

const CategoriesContainer = styled.div`
  position: fixed;
  width: 450px;
  height: 100vh;
  overflow-y: scroll;
`

const CategoriesFormControl = styled(FormControl)`
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
`
