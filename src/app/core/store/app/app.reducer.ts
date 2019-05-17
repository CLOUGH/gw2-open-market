
import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from './app.state';
import { navigationReducer } from '../navigation/navigation.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
    navigation: navigationReducer,
}