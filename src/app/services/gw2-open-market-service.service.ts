import { IItemTradeListing } from './../../server/models/ItemTradeListing';
import { IItem } from './../../server/models/Item';
import { ItemsSearchFilter } from './../models/items-search-filter';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Item } from '../models/item';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Gw2OpenMarketServiceService {
  private apiUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) { }

  public getItems(searchFilter: ItemsSearchFilter): Observable<HttpResponse<IItem[]>> {
    let httpParams = new HttpParams();
    Object.keys(searchFilter).forEach((key) => {
      if(searchFilter[key]) {
        httpParams = httpParams.append(key, searchFilter[key]);
      }
    });
    return this.http.get<IItem[]>(`${this.apiUrl}/items`, {
      params: httpParams,
      observe: 'response'
    });
  }
  public getItemTradeListing(itemId: number): Observable<HttpResponse<IItemTradeListing>> {
    return this.http.get<IItemTradeListing>(`${this.apiUrl}/items/${itemId}/trade-listings`, {
      observe: 'response'
    });
  }
  public getItemRecipes(itemId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}/items/${itemId}/recipes`, {
      observe: 'response'
    });
  }

  public updateItemList(): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/items/update-all-items`, {
      observe: 'response'
    });
  }
  public updateItemPrices(): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/items/update-item-prices`, {
      observe: 'response'
    });
  }

  public updateItemRecipes(): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/items/update-item-recipes`, {
      observe: 'response'
    });
  }
}
