import { IJob } from './../models/Job';
import { GW2ApiService } from './gw2-api.service';
import * as moment from 'moment';
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import Job from '../models/Job';
import { v4 as uuidv4 } from 'uuid';
import Item, { IItemPrice } from '../models/Item';

export class ItemPriceService {
  private gw2ApiService: GW2ApiService;
  private UPDATE_EXISTING_ITEM_PRICE_JOB = 'updateExistingItemPrice';

  constructor() {
    this.gw2ApiService = new GW2ApiService();
  }

  async updateExistingItemPrice(): Promise<mongodb.BulkWriteOpResultObject> {
    console.log('Received request to update  existing item prices');

    let job: IJob = null;
    const processId = uuidv4();

    try {
      // check if the job is already running
      job = await Job.findOne({ name: { $eq: this.UPDATE_EXISTING_ITEM_PRICE_JOB } });
      if (!job) {
        await Job.create({ name: this.UPDATE_EXISTING_ITEM_PRICE_JOB, running: true, processId });
      }
      else if (!job.running) {
        job = await Job.findOneAndUpdate({ name: { $eq: this.UPDATE_EXISTING_ITEM_PRICE_JOB } }, { $set: { running: false } });
      } else {
        console.log('Another process already initiated this job');
        throw new Error(`The ${this.UPDATE_EXISTING_ITEM_PRICE_JOB} job is already running`);
      }

      const itemDocs = await Item.find({

        $or: [{
          'price.updatedAt': {
            $lte: moment().subtract(10, 'minutes').toDate() // get all the item that were not update over 15min
          }
        }, {
          'pice.updatedAt': {
            $exists: false
          }
        }],
      });
      console.log(`Found ${itemDocs.length} item prices that are outdated`);

      const itemIds = itemDocs.map(itemPrice => itemPrice.id);
      const gw2ItemPrices = (await this.gw2ApiService.getItemPrices(itemIds));


      console.log('Updating existing item prices');
      const updateWriteResult = await this.bulkUpdateItemPrice(gw2ItemPrices);

      console.log('Completed update of existing item prices');
      await Job.findOneAndUpdate({ name: { $eq: this.UPDATE_EXISTING_ITEM_PRICE_JOB } }, { $set: { running: false } });
      return updateWriteResult;
    } catch (e) {
      console.log('An error has occurred while trying to update existing item prices');
      console.log(e);
      throw e;
    } finally {
      if (job && job.processId === processId) {
        await Job.findOneAndUpdate({ name: { $eq: this.UPDATE_EXISTING_ITEM_PRICE_JOB } }, { $set: { running: false } });
      }
    }
  }

  private async bulkUpdateItemPrice(itemPrices: IItemPrice[]): Promise<mongodb.BulkWriteOpResultObject> {
    try {
      const updateQuery = itemPrices.map(itemPrice => {
        return {
          updateOne: {
            filter: { id: itemPrice.id },
            update: {
              $set: {
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
      });

      console.log('Saving copy of bulk price update query to disk');
      await new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, './price-update.json'), JSON.stringify(updateQuery, null, 2), (err) => {
          if (err) {
            reject(err);
          }
          console.log('Completed save of bulk price update query to disk');
          resolve();
        });
      });

      const bulkWriteResult = await Item.bulkWrite(updateQuery);
      console.log('Successfully completed bulk update of item price update');

      return bulkWriteResult;
    } catch (e) {
      console.log('An error has occurred while trying to perform bulk update of item prices');
      console.error(e);
      throw e;
    }
  }
}
