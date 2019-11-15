import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Gw2OpenMarketService {

  constructor(private http: HttpClient) { }
}
