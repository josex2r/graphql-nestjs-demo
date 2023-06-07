import { NotFoundException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

import { NewRecipeInput } from './dto/new-recipe.input'
import { RecipesArgs } from './dto/recipes.args'
import { Recipe } from './models/recipe.model'
import { RecipesService } from './recipes.service'

@Resolver((of) => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query((returns) => Recipe)
  async recipe(@Args('id') id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOneById(id)
    if (!recipe) {
      throw new NotFoundException(id)
    }
    return recipe
  }

  @Query((returns) => [Recipe])
  recipes(@Args() recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return this.recipesService.findAll(recipesArgs)
  }

  @Mutation((returns) => Recipe)
  async addRecipe(
    @Args('newRecipeData') newRecipeData: NewRecipeInput,
    @Context('recipesPubsub') pubSub: PubSub
  ): Promise<Recipe> {
    const recipe = await this.recipesService.create(newRecipeData)

    pubSub.publish('recipeAdded', { recipeAdded: recipe })

    return recipe
  }

  @Mutation((returns) => Boolean)
  async removeRecipe(@Args('id') id: string) {
    return this.recipesService.remove(id)
  }

  @Subscription((returns) => Recipe)
  recipeAdded(@Context('recipesPubsub') pubSub: PubSub) {
    return pubSub.asyncIterator(['recipeAdded'])
  }
}
