import { Injectable } from '@nestjs/common'

import { NewRecipeInput } from './dto/new-recipe.input'
import { RecipesArgs } from './dto/recipes.args'
import { Recipe } from './models/recipe.model'

const recipes: Recipe[] = [
  {
    id: 'foo',
    title: 'bar',
    description: 'wow',
    creationDate: new Date(),
    ingredients: ['a', 'b', 'c'],
  },
]

@Injectable()
export class RecipesService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: NewRecipeInput): Promise<Recipe> {
    const recipe = {
      ...data,
      id: new Date().getTime().toString(),
      creationDate: new Date(),
    }

    recipes.push(recipe)

    return recipe
  }

  async findOneById(id: string): Promise<Recipe> {
    return recipes.find(({ id: recipeId }) => id === recipeId)
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return recipes
  }

  async remove(id: string): Promise<boolean> {
    const index = recipes.findIndex(({ id: recipeId }) => id === recipeId)

    if (index >= 0) {
      recipes.splice(index, 1)

      return true
    }

    return false
  }
}
