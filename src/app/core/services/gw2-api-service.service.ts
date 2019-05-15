import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Gw2ApiServiceService {
  url = 'https://api.guildwars2.com/v2';
  constructor(private http: HttpClient) { }

  getItems(items?: string[]) {
    const ids = items && items.length > 0 ? `ids=${items.join(',')}` : '';

    return this.http.get(`${this.url}/items?v=latest&${ids}`);
  }
  getItem(id: string) {
    return this.http.get(`${this.url}/items?v=latest&id=${id}`);
  }
  getPrices(id: string) {
    return this.http.get(`${this.url}/commerce/prices?v=latest&id=${id}`);
  }
  getListings(id: string) {
    return this.http.get(`${this.url}/commerce/listings?v=latest&id=${id}`);
  }
}
