import Axios from 'axios';
import * as moment from 'moment';
import Item, { IItemPrice, IItem } from '../models/Item';
import Recipe from '../models/Recipe';
import * as fs from 'fs';
import * as path from 'path';
export class GW2ApiService {
  gw2ApiUrl = 'https://api.guildwars2.com/v2';
  itemsPerRequest = 200;
  apiRateLimitMilliseconds = 700;

  async updateItemPrices(): Promise<void> {
    console.log('Received request to get item prices');

    console.log('Get the list of listings item from gw2 api');
    const getPricesItemIdsUrl = `${this.gw2ApiUrl}/commerce/prices`;
    const itemIds = (await Axios.get<number[]>(getPricesItemIdsUrl)).data;
    console.log(`Found ${itemIds.length} in our on gw2`);

    const numberOfRequest = Math.floor(itemIds.length / this.itemsPerRequest) + (itemIds.length % this.itemsPerRequest > 0 ? 1 : 0);
    const estimatedElapseTime = numberOfRequest * this.apiRateLimitMilliseconds / 60000;
    const startTime = new Date();

    console.log(`The retrieval of ${itemIds.length} item prices will be done in ${numberOfRequest} request per ${this.itemsPerRequest}. Estimated elapse time is ${estimatedElapseTime} minutes`);
    let lastRequestTime = 0;
    for (let requestIndex = 0; requestIndex < numberOfRequest; requestIndex++) {
      try {
        console.log(`Item price request ${requestIndex + 1} of ${numberOfRequest}. Last request took ${lastRequestTime}ms`);

        const batchItemPricesIds = itemIds.slice(requestIndex * this.itemsPerRequest, (requestIndex + 1) * this.itemsPerRequest);
        const url = `${this.gw2ApiUrl}/commerce/prices?ids=${batchItemPricesIds.join(',')}`;

        const timeBeforeRequest = new Date();
        const gw2ItemPrices = await Axios.get<Promise<IItemPrice[]>>(url).then(response => response.data);

        const bulkWriteItemUpdateQuery = gw2ItemPrices.map(itemPrice => {
          const updateQuery = {
            updateOne: {
              filter: { id: itemPrice.id },
              update: {
                $set: {
                  listed: true,
                  price: {
                    ...itemPrice,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }
                }
              },
              upsert: true
            },

          };
          return updateQuery;
        });

        console.log('Updating item prices');
        await Item.bulkWrite(bulkWriteItemUpdateQuery);
        console.log('Successfully updated item prices');
        lastRequestTime = moment().diff(timeBeforeRequest, 'milliseconds');


        await this.wait(lastRequestTime > this.apiRateLimitMilliseconds ? 0 : this.apiRateLimitMilliseconds - lastRequestTime);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    console.log(`Successfully retrieve item prices. Elapse time ${moment(startTime).fromNow()}`);
  }

  async updateRecipeList(): Promise<void> {
    try {
      const getItemIdsUrl = `${this.gw2ApiUrl}/recipes`;
      const recipeIds = (await Axios.get<string[]>(getItemIdsUrl)).data;

      const numberOfRequest = Math.floor(recipeIds.length / this.itemsPerRequest) + (recipeIds.length % this.itemsPerRequest > 0 ? 1 : 0);
      const estimatedElapseTime = numberOfRequest * this.apiRateLimitMilliseconds / 60000;
      const startTime = new Date();
      const msPerRequest = [];

      for (let requestIndex = 0; requestIndex < numberOfRequest; requestIndex++) {
        try {
          const avgTimeToGetData = Math.round(msPerRequest.length > 0 ? msPerRequest.reduce((a, b) => a + b) / msPerRequest.length : 0);
          console.log(`Recipe request ${requestIndex + 1} of ${numberOfRequest} with avg of ${avgTimeToGetData}ms. Last request took ${msPerRequest.length > 0 ? msPerRequest[msPerRequest.length - 1] : 0}ms`);

          const batchRecipeIds = recipeIds.slice(requestIndex * this.itemsPerRequest, (requestIndex + 1) * this.itemsPerRequest);
          const url = `${this.gw2ApiUrl}/recipes?ids=${batchRecipeIds.join(',')}`;

          const timeBeforeRequest = new Date();
          const recipes = await Axios.get<Promise<IItemPrice[]>>(url).then(response => response.data);

          const bulkWriteRecipeUpdateQuery = recipes.map(recipe => ({
            updateOne: {
              filter: { id: recipe.id },
              update: {
                $set: recipe
              },
              upsert: true
            },
          }));

          console.log('Update recipe database');
          await Recipe.bulkWrite(bulkWriteRecipeUpdateQuery);
          console.log('Completed update of recipe database');

          const processingTime = moment().diff(timeBeforeRequest, 'milliseconds');
          msPerRequest.push(processingTime);
          await this.wait(processingTime > this.apiRateLimitMilliseconds ? 0 : this.apiRateLimitMilliseconds - processingTime);

        } catch (e) {
          console.error(e);
          throw e;
        }
      }

      console.log('Updated all the recipes');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async wait(milliseconds): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }

  async updateItems(): Promise<void> {
    try {
      console.log('Receive request to update items');
      console.log('Get the list of items for gw2 api')
      const getItemIdsUrl = `${this.gw2ApiUrl}/items`;
      const itemIds = (await Axios.get<number[]>(getItemIdsUrl)).data;
      console.log(`Found ${itemIds.length} in our on gw2`);

      // filter the list to the items we dont have in our db
      console.log('Getting all existing items and filtering ones not in our db');
      const dbItemIds = await Item.find({}, 'id');
      console.log(`Found ${dbItemIds.length} in our database`);
      const filteredItems = [];
      for (const itemId of itemIds) {
        const dbItemIndex = dbItemIds.findIndex(dbItemId => dbItemId.id === itemId);

        if (dbItemIndex >= 0) {
          console.log(`Item ${dbItemIds[dbItemIndex].id} was found. Removing it. Items from our db remaining ${dbItemIds.length}. Items not in our db ${filteredItems.length} `);
          dbItemIds.splice(dbItemIndex, 1);
          continue;
        }

        filteredItems.push(itemId);
      }
      console.log(`Found ${itemIds.length} not in our database`);

      const numberOfRequest = Math.floor(filteredItems.length / this.itemsPerRequest)
        + (filteredItems.length % this.itemsPerRequest > 0 ? 1 : 0);
      const estimatedElapseTime = numberOfRequest * this.apiRateLimitMilliseconds / 60000;
      const startTime = new Date();
      const msPerRequest = [];

      console.log(`Found ${filteredItems.length} not in the items collection. Process started at ${startTime} and estimated to complete in ${estimatedElapseTime} minutes`);
      for (let requestIndex = 0; requestIndex < numberOfRequest; requestIndex++) {
        try {
          const avgTimeToGetData = Math.round(msPerRequest.length > 0 ? msPerRequest.reduce((a, b) => a + b) / msPerRequest.length : 0);
          console.log(`Item request ${requestIndex + 1} of ${numberOfRequest} with avg of ${avgTimeToGetData}ms. Last request took ${msPerRequest.length > 0 ? msPerRequest[msPerRequest.length - 1] : 0}ms`);

          const batchItemIds = filteredItems.slice(requestIndex * this.itemsPerRequest, (requestIndex + 1) * this.itemsPerRequest);
          const url = `${this.gw2ApiUrl}/items?ids=${batchItemIds.join(',')}`;

          const timeBeforeRequest = new Date();
          const items = await Axios.get<Promise<IItem[]>>(url).then(response => response.data);

          const bulkWriteItemUpdateQuery = items.map(item => {
            const updateQuery = {
              updateOne: {
                filter: { id: item.id },
                update: {
                  $set: {
                    ...item,
                    listed: false
                  }
                },
                upsert: true
              },

            };
            return updateQuery;
          });

          console.log('Updating item records');
          await Item.bulkWrite(bulkWriteItemUpdateQuery);
          console.log('Completed update of item records');

          const processingTime = moment().diff(timeBeforeRequest, 'milliseconds');
          msPerRequest.push(processingTime);
          await this.wait(processingTime > this.apiRateLimitMilliseconds ? 0 : this.apiRateLimitMilliseconds - processingTime);

        } catch (e) {
          console.error(e);
          throw e;
        }
      }

      console.log('Updated all the items');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
