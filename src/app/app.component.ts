import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';
import { IAppState } from './core/store/app/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'gw2-open-market';

  constructor(
    private router: Router,
    private store: Store<IAppState>
  ) { }

  ngOnInit(): void {
  }
}
