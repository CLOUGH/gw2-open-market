import { Injectable } from '@angular/core';
import { forkJoin, of, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, mergeMap, map, combineAll } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Gw2SpidyServiceService {

  url = 'https://www.gw2spidy.com/api/v0.9/json';

  constructor(private http: HttpClient) { }

  getItemListings(itemId) {

    return forkJoin([
      this.http.jsonp(`${this.url}/listings/${itemId}/buy`, 'callback'),
      this.http.jsonp(`${this.url}/listings/${itemId}/sell`, 'callback')
    ])
      .pipe(
        switchMap((responses: any) => {
          const promises = [];
          responses.forEach(response => {
            for (let i = response.page + 1; i <= response.last_page; i++) {
              promises.push(this.http.jsonp(`${this.url}/listings/${itemId}/${response['sell-or-buy']}/${i}`, 'callback'));
            }
          });

          return forkJoin([of(responses), ...promises]);
        }),
        switchMap((data) => {
          console.log(data);
          const listingsData = {
            buy: data[0][0].results,
            sell: data[0][1].results
          };

          for (let i = 1; i < data.length; i++) {
            if (data[i]['sell-or-buy'] === 'buy') {
              listingsData.buy = listingsData.buy.concat(data[i].results);
            }
            if (data[i]['sell-or-buy'] === 'sell') {
              listingsData.sell = listingsData.sell.concat(data[i].results);
            }
          }
          
          return of(listingsData);
        })
      );
  }
}
