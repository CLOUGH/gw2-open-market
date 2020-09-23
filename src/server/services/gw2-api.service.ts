import Axios from 'axios';
import { resolve } from 'dns';
import * as moment from 'moment';
import { IItemPrice } from '../models/Item';

export class GW2ApiService {
  gw2ApiUrl = 'https://api.guildwars2.com/v2';
  itemsPerRequest = 200;
  apiRateLimitMilliseconds = 700;

  async getItemPrices(itemIds: number[]): Promise<IItemPrice[]> {
    console.log('Received request to get item prices');
    const numberOfRequest = Math.floor(itemIds.length / this.itemsPerRequest) + (itemIds.length % this.itemsPerRequest > 0 ? 1 : 0);
    const estimatedElapseTime = numberOfRequest * this.apiRateLimitMilliseconds / 60000;
    const startTime = new Date();
    const msPerRequest = [];

    console.log(`The retrieval of ${itemIds.length} item prices will be done in ${numberOfRequest} request per ${this.itemsPerRequest}. Estimated elapse time is ${estimatedElapseTime} minutes`);

    let itemPrices: IItemPrice[] = [];

    for (let requestIndex = 0; requestIndex < numberOfRequest; requestIndex++) {
      try {
        const avgTimeToGetData = Math.round(msPerRequest.length > 0 ? msPerRequest.reduce((a, b) => a + b) / msPerRequest.length : 0);
        console.log(`Item price request ${requestIndex + 1} of ${numberOfRequest} with avg of ${avgTimeToGetData}ms. Last request took ${msPerRequest.length > 0 ? msPerRequest[msPerRequest.length - 1] : 0}ms`);

        const batchItemPricesIds = itemIds.slice(requestIndex * this.itemsPerRequest, (requestIndex + 1) * this.itemsPerRequest);
        const url = `${this.gw2ApiUrl}/commerce/prices?ids=${batchItemPricesIds.join(',')}`;

        const timeBeforeRequest = new Date();
        const gw2ItemPrices = await Axios.get<Promise<IItemPrice[]>>(url).then(response => response.data);
        const msToGetItemPrices = moment().diff(timeBeforeRequest, 'milliseconds')
        msPerRequest.push(msToGetItemPrices);

        itemPrices = [
          ...itemPrices,
          ...gw2ItemPrices
        ];

        await this.wait(msToGetItemPrices > this.apiRateLimitMilliseconds ? 0 : this.apiRateLimitMilliseconds - msToGetItemPrices);

      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    console.log(`Successfully retrieve item prices. Elapse time ${moment(startTime).fromNow()}`);
    return itemPrices;
  }

  async wait(milliseconds): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }
}
