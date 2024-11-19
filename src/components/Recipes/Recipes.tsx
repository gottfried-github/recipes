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
import { debounce } from '../../utils'
import Recipe from './Recipe/Recipe'

const Recipes = () => {
  const queryClient = useQueryClient()
  const submit = useSubmit()

  const [currentCategory, setCurrentCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const { recipes, categories } = useLoaderData() as {
    recipes: TypeRecipe[]
    categories: Category[]
  }

  console.log('Recipes - recipes, correntCategory', recipes, currentCategory)

  const recipesByCategory = useMemo(() => {
    if (currentCategory === '') return recipes

    return recipes.filter(recipe => recipe.strCategory === currentCategory)
  }, [recipes, currentCategory])

  // paginate recipes
  const pages = useMemo(() => {
    const pages = []
    let i = 0

    while (i < recipesByCategory.length + 1) {
      if (i % 10 === 0 && i > 0) {
        pages.push(recipesByCategory.slice(i - 10, i))
      }

      if (i % 10 === 0 && recipesByCategory.length - i < 10) {
        pages.push(recipesByCategory.slice(i))
        break
      }

      i++
    }

    return pages
  }, [recipesByCategory])

  const pagesElData = useMemo(() => {
    if (pages.length < 10) {
      return pages.map((page, i) => ({ label: `${i + 1}`, value: i }))
    } else if (pages.length - currentPage < 10) {
      return pages
        .slice(currentPage)
        .map((page, i) => ({ label: `${i + currentPage + 1}`, value: i + currentPage }))
    } else {
      const pagesElData = []
      let i = currentPage

      while (i < currentPage + 7) {
        pagesElData.push({ label: `${i + 1}`, value: i })
        i++
      }

      pagesElData.push({ label: '...' }, { label: `${pages.length}`, value: pages.length - 1 })

      return pagesElData
    }
  }, [pages, currentPage])

  const debounceSearch = debounce((searchParams: URLSearchParams) => {
    console.log('Recipes, debounceSearch - searchParams:', searchParams)
    submit(searchParams)
  }, 300)

  const handleSelectRecipe = (recipe: TypeRecipe) => {
    queryClient.setQueryData(
      ['recipes'],
      ({ recipes, categories }: { recipes: TypeRecipe[]; categories: Category[] }) => {
        console.log('Recipes, handleSelectRecipt - setQueryData recipes, recipe:', recipes, recipe)
        return {
          recipes: recipes.map(_recipe => {
            if (_recipe.idMeal !== recipe.idMeal) return _recipe

            return { ..._recipe, selected: true }
          }),
          categories,
        }
      }
    )

    submit('')
  }

  const handleCategoryChange = (ev: ChangeEvent, v: string) => {
    setCurrentCategory(v)
  }

  const handlePageElClick = (v: number) => {
    setCurrentPage(v)
  }

  const handlePagePrevClick = () => {
    setCurrentPage(currentPage - 1)
  }

  const handlePageNextClick = () => {
    setCurrentPage(currentPage + 1)
  }

  const handleSearchChange = (ev: React.ChangeEvent) => {
    console.log('handleSearchChange - ev.target.value', (ev.target as HTMLInputElement).value)

    const v = (ev.target as HTMLInputElement).value

    if (v === '') return debounceSearch('')

    const searchParams = new URLSearchParams()
    searchParams.append('s', v)

    debounceSearch(searchParams.toString())
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
          <input type="text" onChange={handleSearchChange} />
          {/* <button onClick={handleSearchChange}>search</button> */}
        </div>
        <RecipesPageContainer>
          {pages[currentPage].map(recipe => (
            <Recipe key={recipe.idMeal} recipe={recipe} handleAddToSelected={handleSelectRecipe} />
          ))}
        </RecipesPageContainer>
        <div>
          <button onClick={handlePagePrevClick}>Previous</button>
          {pagesElData.map(pageElData => (
            <span
              onClick={
                pageElData.value
                  ? () => {
                      handlePageElClick(pageElData.value)
                    }
                  : undefined
              }
            >
              {pageElData.label}
            </span>
          ))}
          <button onClick={handlePageNextClick}>Next</button>
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

const RecipesPageContainer = styled.div`
  display: flex;
  flex-direction: column;

  row-gap: 16px;
  padding: 0 16px;
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
