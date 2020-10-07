import { IRecipe } from './../models/Recipe';
import Axios from 'axios';
import Recipe from '../models/Recipe';

export class GW2ProfitsApiService {
  url = 'http://gw2profits.com/json/v3';
  async getMysticForgeRecipes(): Promise<void> {
    console.log('Received request to mystic forge recipes from GW2ProfitsApi ');
    try {
      const recipes = (await Axios.get<IRecipe[]>(this.url)).data;
      console.log(`Received ${recipes.length} recipes from gw2 profits api`);
      const  bulkWriteUpdateRecipes = recipes.map(recipe => {
        return {
          updateOne: {
            filter: { id: recipe.id },
            update: {
              $set: recipe
            },
            upsert: true
          },
        };
      });

      console.log(`Updating recipes from gw2 profits api`);
      await Recipe.bulkWrite(bulkWriteUpdateRecipes);
      console.log(`Successfully updated recipes from gw2 profits api`);
    } catch (error) {
      console.log('An error has occurred while trying to get mystic forge recipes');
      console.log(error);
      throw error;
    }
  }
}
