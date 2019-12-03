import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Gw2OpenMarketService {
  private apiUrl = 'http://localhost:4040/api';

  constructor(private http: HttpClient) { }

  public getItems(filter?: any): Observable<HttpEvent<any>> {
    return this.http.get<any>(
      `${this.apiUrl}/items`,
      {
        params: filter,
        observe: 'response'
      }
    );
  }
}
