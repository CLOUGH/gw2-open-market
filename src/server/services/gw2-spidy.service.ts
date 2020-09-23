import Axios, { AxiosResponse } from 'axios';
import ItemTradeListing, { IItemTradeListing, ITrade } from '../models/ItemTradeListing';
import * as moment from 'moment';


interface GW2SpidyListingResult {
  listing_datetime: string;
  unit_price: number;
  quantity: number;
  listings: number;
}

interface GW2SpidyListingResponse {
  ['sell-or-by']: string;
  count: number;
  last_page: number;
  total: number;
  results: [GW2SpidyListingResult];
}

export class GW2SpidyApiService {
  gw2SpidyApiUrl = 'https://www.gw2spidy.com/api/v0.9/json';

  constructor() {

  }

  async getTradeHistory(itemId: number, numberOfMonths?: number): Promise<IItemTradeListing> {
    try {
      console.log(`Received request to get item ${itemId}`);
      const [buys, sells] = await Promise.all([
        this.getListings(itemId, 'buy', numberOfMonths),
        this.getListings(itemId, 'sell', numberOfMonths)
      ]);
      const itemTradeListing: IItemTradeListing = {
        id: itemId,
        buys,
        sells
      } as IItemTradeListing;

      return itemTradeListing;
    } catch (e) {
      console.log(`A error has occurred while trying to get the trade history date for item ${itemId}`);
      console.log(e);
      throw e;
    }
  }

  private async getListings(itemId, operation, numberOfMonths?: number): Promise<ITrade[]> {
    try {
      let continueSearching = false;
      let listingResponse = null;
      let tradeList: ITrade[] = [];
      // const itemTradeListing = await ItemTradeListing.findOne({ id: itemId });
      // const recentDBTrade: ITrade = itemTradeListing && itemTradeListing[operation === 'buy' ? 'buys' : 'sells']
      //   .reduce((a, b) => a.timestamp > b.timestamp ? a : b);
      let page = 1;

      do {
        const url = `${this.gw2SpidyApiUrl}/listings/${itemId}/${operation}/${page}`;
        console.log(url);
        listingResponse = (await Axios.get<GW2SpidyListingResponse>(url)).data;
        page = page + 1;

        tradeList = [
          ...tradeList,
          ...this.gw2SpidyListingResultToTrade(listingResponse.results)
        ];
        const oldestFromResult = tradeList.reduce((a, b) => moment(a.timestamp).valueOf() < moment(b.timestamp).valueOf() ? a : b);
        // continueSearching = (!recentDBTrade || recentDBTrade.timestamp < oldestFromResult.timestamp)
        //   && page <= listingResponse.last_page;

        continueSearching = (!numberOfMonths && page <= listingResponse.last_page) || (
          numberOfMonths
          && moment().diff(moment(oldestFromResult.timestamp), 'months') < numberOfMonths
          && page <= listingResponse.last_page
        );
      } while (continueSearching);

      if (numberOfMonths) {
        tradeList = [
          ...tradeList.filter(trade => moment().diff(moment(trade.timestamp), 'months') < numberOfMonths)
        ]
      }
      // filter out any data less recent that most recent db dat
      // add the data from db
      // tradeList = [
      //   ...tradeList.filter(trade => !recentDBTrade || trade.timestamp > recentDBTrade.timestamp),
      //   ...(itemTradeListing ? itemTradeListing[operation === 'buy' ? 'buys' : 'sells'] : [])
      // ];

      return tradeList;
    } catch (e) {
      console.log(`An error has occurred while trying to get the ${operation} listings for item ${itemId}`);
      console.error(e);
      throw e;
    }
  }

  private gw2SpidyListingResultToTrade(gw2ListingResults: GW2SpidyListingResult[]): ITrade[] {
    return gw2ListingResults.map(listing => {
      return {
        timestamp: new Date(listing.listing_datetime),
        unit_price: listing.unit_price,
        quantity: listing.quantity,
        listings: listing.listings,
      } as ITrade;
    });
  }

}
