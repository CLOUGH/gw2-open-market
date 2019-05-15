import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class Gw2SpidyServiceService {

  constructor(private http: HttpClient) { }
}
