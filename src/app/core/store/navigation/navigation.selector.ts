import { IAppState } from '../app/app.state';
import { createSelector } from '@ngrx/store';
import { INavigationState } from './navigation.state';

export const selectNavigation = (state: IAppState) => state.navigation;

export const selectPreviousUrl = createSelector(
    selectNavigation,
    (state: INavigationState) => state.previousUrl
);