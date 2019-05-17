import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { IAppState } from '../app/app.state';
import { Store } from '@ngrx/store';

@Injectable()
export class NavigationEffect {
    constructor(
        private actions$: Actions,
        private store: Store<IAppState>
    ) { }
}