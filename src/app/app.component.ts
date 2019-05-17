import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { IAppState } from './core/store/app/app.state';
import { Store } from '@ngrx/store';
import { SetPreviousUrl } from './core/store/navigation/navigation.action';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'gw2-open-market';

  constructor(
    private router: Router,
    private store: Store<IAppState>,
    // private route: Route
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e: any) => e instanceof NavigationStart),
        pairwise()
      ).subscribe((e: any) => {
        // console.log(this.route);
        // this.store.dispatch(new SetPreviousUrl());
      });
  }
}
