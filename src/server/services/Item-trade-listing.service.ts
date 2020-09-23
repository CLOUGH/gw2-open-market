import { GW2SpidyApiService } from './gw2-spidy.service';
import { IItemTradeListing } from '../models/ItemTradeListing';
import ItemTradeListing from '../models/ItemTradeListing';
import * as moment from 'moment';
import Item from '../models/Item';
import * as e from 'express';

export class ItemTradeListingService {

  private gw2SpidyApiService: GW2SpidyApiService;
  constructor() {
    this.gw2SpidyApiService = new GW2SpidyApiService();
  }

  async getItemTradeListing(itemId: number): Promise<IItemTradeListing> {
    try {
      // get the latest items listings
      const itemTradeListings = (await this.gw2SpidyApiService.getTradeHistory(itemId));

      // for performance do the update in the background
      const promise = new Promise((resolve, reject) => {
        // store the most recent 6 months of data
        const monthsToKeep = 6;
        const buys = itemTradeListings.buys.filter(buy => moment().diff(moment(buy.timestamp), 'months') <= monthsToKeep)
          .sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());
        const sells = itemTradeListings.sells.filter(buy => moment().diff(moment(buy.timestamp), 'months') <= monthsToKeep)
          .sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());

        ItemTradeListing.updateOne({ id: itemId }, {
          $set: {
            buys,
            sells
          }
        }, { upsert: true }).then(updateResult => {
          console.log(`Updated item ${itemId} trade listing data`);
          resolve(updateResult);
        }).catch(error => {
          console.log(`An error occurred while update item ${itemId} trade listings data`);
          console.error(error);
          reject(error);

        });
      });


      return itemTradeListings;
    } catch (e) {
      console.log(`An error has occurred while trying to get item ${itemId} trade listings`);
      console.error(e);
      throw e;
    }
  }

  async updateAllItemTradeListing(): Promise<void> {
    try {
      const items = await Item.aggregate([
        {
          $lookup: {
            from: 'itemtradelistings',
            localField: 'id',
            foreignField: 'id',
            as: 'trade'
          }
        },
        {
          $unwind: {
            path: "$trade",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            $or: [
              // {
              //   $and: [
              //     {
              //       trade: { $exists: true }
              //     },
              //     {
              //       updatedAt: { $lt: moment().subtract(1, 'week') }
              //     }
              //   ]
              // },
              {
                // trade: { $exists: false }
                trade: null
              },
            ],
          }
        }
      ]);
      console.log(`Found ${items.length} with out dated trade data`);
      for (let index = 0; index < items.length; index++) {
        const item = items[index];

        console.log(`Retrieving item ${item.id} trade data. ${index} of ${items.length}`);
        const beforeTime = moment();
        const numberOfMonths = 6;
        const itemTradeListing = await this.gw2SpidyApiService.getTradeHistory(item.id, numberOfMonths);

        console.log(`Successfully retrieved item ${item.id} trade listings in ${moment().diff(beforeTime, 'milliseconds')}`);
        console.log('Update item records');
        await ItemTradeListing.updateOne({ id: item.id }, { $set: { ...itemTradeListing } }, { upsert: true });
        console.log(`Item ${item.id} trade listing was successfully updated`);

        console.log('Waiting before making a call to the service again');
        await new Promise(resolve => setTimeout(() => resolve(), 1000));
      }

      return null;
    } catch (e) {
      console.log('A error has occurred while getting trade data');
      console.error(e);
      throw e;
    }
  }

  async removeOldListings(): Promise<void> {
    console.log('Received request to remove old trade listing record');
    try {
      console.log('Get the ids of the trade history collection');
      const itemIds = await ItemTradeListing.find({}, 'id');

      for (let itemIndex = 0; itemIndex < itemIds.length; itemIndex++) {
        console.log(`Running trade list update ${itemIndex} of ${itemIds.length}. id: ${itemIds[itemIndex].id}`);

        const itemTradeListing = await ItemTradeListing.findOne({ id: itemIds[itemIndex].id });

        const buys = itemTradeListing.buys.filter(buy => moment().diff(moment(buy.timestamp), 'months') <= 6)
          .sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());
        const sells = itemTradeListing.sells.filter(buy => moment().diff(moment(buy.timestamp), 'months') <= 6)
          .sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());

        await ItemTradeListing.updateOne({
          id: itemTradeListing.id
        }, {
          $set: {
            id: itemTradeListing.id,
            buys,
            sells
          }
        }, { upsert: false });
      }

      console.log('Successfully update trade listing data');
      return null;
    } catch (e) {
      console.log('An error has occurred while trying to remove old trade records');
      console.error(e);
      throw e;
    }
  }
}
