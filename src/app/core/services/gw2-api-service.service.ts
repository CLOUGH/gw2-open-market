import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Gw2ApiServiceService {
  url = 'https://api.guildwars2.com/v2';
  token = '5F43ED14-E16F-8746-88FE-E74E27986F65DA724725-61E6-4731-A725-EB4A44481F88'
  constructor(private http: HttpClient) { }

  getItems(items?: string[]) {
    const ids = items && items.length > 0 ? `ids=${items.join(',')}` : '';

    return this.http.get(`${this.url}/items?v=latest&${ids}`);
  }
  getItem(id: string) {
    return this.http.get(`${this.url}/items?v=latest&id=${id}`);
  }
  getCommercePrices(id: string) {
    return this.http.get(`${this.url}/commerce/prices?v=latest&id=${id}`);
  }
  getListings(id: string) {
    return this.http.get(`${this.url}/commerce/listings?v=latest&id=${id}`);
  }
  getCommerceListing(items?: string[]) {
    const ids = items && items.length > 0 ? `ids=${items.join(',')}` : '';
    return this.http.get(`${this.url}/commerce/listings?v=latest&${ids}`);
  }
  getTransactions() {
    return forkJoin([
      this.http.get(`${this.url}/commerce/transactions/history/buys?access_token=${this.token}`),
      this.http.get(`${this.url}/commerce/transactions/history/sells?access_token=${this.token}`),
      this.http.get(`${this.url}/commerce/transactions/current/buys?access_token=${this.token}`),
      this.http.get(`${this.url}/commerce/transactions/current/sells?access_token=${this.token}`),

    ]).pipe(
        mergeMap(d => {
          return of({
            historicalBuys: d[0],
            historicalSells: d[1],
            currentBuys: d[2],
            currentSells: d[3],
          });
        })
      )
  }
}
